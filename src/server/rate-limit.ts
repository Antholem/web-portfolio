import "server-only";

import { createHash } from "node:crypto";

export type RateLimitRule = {
  name: string;
  /** Counted per visitor, or once for the whole site. */
  scope: "client" | "site";
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult =
  { allowed: true } | { allowed: false; retryAfterSeconds: number };

/** Fixed-window counter: increments `key` and reports the hit count and seconds left. */
export type RateLimitStore = {
  hit(
    key: string,
    windowSeconds: number,
  ): Promise<{ count: number; ttlSeconds: number }>;
};

/** At most 5 messages an hour per visitor, and a daily cap well under Gmail's 500. */
export const CONTACT_RATE_LIMITS = [
  { name: "contact:ip", scope: "client", limit: 5, windowSeconds: 60 * 60 },
  {
    name: "contact:all",
    scope: "site",
    limit: 100,
    windowSeconds: 24 * 60 * 60,
  },
] as const satisfies readonly RateLimitRule[];

/**
 * Per-process counters. On serverless every instance has its own, so this
 * only slows a flood down; configure Redis for a limit that holds everywhere.
 */
export function createMemoryStore(now = () => Date.now()): RateLimitStore {
  const windows = new Map<string, { count: number; resetAt: number }>();
  return {
    async hit(key, windowSeconds) {
      const time = now();
      if (windows.size > 10_000) {
        for (const [k, w] of windows) if (w.resetAt <= time) windows.delete(k);
      }
      let window = windows.get(key);
      if (!window || window.resetAt <= time) {
        window = { count: 0, resetAt: time + windowSeconds * 1000 };
        windows.set(key, window);
      }
      window.count += 1;
      return {
        count: window.count,
        ttlSeconds: Math.ceil((window.resetAt - time) / 1000),
      };
    },
  };
}

/** Upstash Redis over its REST API: one pipelined round trip, no client library. */
export function createUpstashStore(
  url: string,
  token: string,
  fetchImpl: typeof fetch = fetch,
): RateLimitStore {
  return {
    async hit(key, windowSeconds) {
      const response = await fetchImpl(`${url.replace(/\/+$/, "")}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          // NX: the window starts at the first hit and is never extended.
          ["EXPIRE", key, String(windowSeconds), "NX"],
          ["TTL", key],
        ]),
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Rate limit store responded ${response.status}`);
      }
      const [incr, , ttl] = (await response.json()) as {
        result?: number;
        error?: string;
      }[];
      if (incr?.error || typeof incr?.result !== "number") {
        throw new Error(
          `Rate limit store error: ${incr?.error ?? "no result"}`,
        );
      }
      const ttlSeconds =
        typeof ttl?.result === "number" && ttl.result > 0
          ? ttl.result
          : windowSeconds;
      return { count: incr.result, ttlSeconds };
    },
  };
}

let memoryStore: RateLimitStore | undefined;

/** Redis when configured (Upstash's or Vercel KV's variable names), else memory. */
export function storeFromEnv(
  env: Record<string, string | undefined> = process.env,
): RateLimitStore {
  const url = (env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL)?.trim();
  const token = (env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN)?.trim();
  if (url && token) return createUpstashStore(url, token);
  return (memoryStore ??= createMemoryStore());
}

/** Raw IPs never reach the store: a short hash is enough to tell visitors apart. */
export const hashClientId = (id: string) =>
  createHash("sha256").update(id).digest("hex").slice(0, 32);

/**
 * Checks every rule in order and stops at the first one that is over its
 * limit. Fails open: if the store is unreachable, the message still goes out.
 */
export async function checkRateLimit(
  clientId: string,
  rules: readonly RateLimitRule[],
  store: RateLimitStore,
): Promise<RateLimitResult> {
  try {
    for (const rule of rules) {
      const key =
        rule.scope === "site"
          ? rule.name
          : `${rule.name}:${hashClientId(clientId)}`;
      const { count, ttlSeconds } = await store.hit(key, rule.windowSeconds);
      if (count > rule.limit) {
        return { allowed: false, retryAfterSeconds: Math.max(1, ttlSeconds) };
      }
    }
    return { allowed: true };
  } catch (error) {
    console.error("[rate-limit] store unavailable, allowing request", error);
    return { allowed: true };
  }
}

/** The visitor's IP as the edge saw it (Vercel overwrites these headers). */
export function clientIdFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}
