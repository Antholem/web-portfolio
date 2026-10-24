// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  checkRateLimit,
  clientIdFromHeaders,
  CONTACT_RATE_LIMITS,
  createMemoryStore,
  createUpstashStore,
  hashClientId,
  storeFromEnv,
  type RateLimitRule,
  type RateLimitStore,
} from "./rate-limit";

const perClient: RateLimitRule = {
  name: "t:ip",
  scope: "client",
  limit: 2,
  windowSeconds: 60,
};
const site: RateLimitRule = {
  name: "t:all",
  scope: "site",
  limit: 3,
  windowSeconds: 3600,
};

describe("createMemoryStore", () => {
  it("counts hits in a fixed window and resets when it ends", async () => {
    let now = 0;
    const store = createMemoryStore(() => now);
    expect(await store.hit("k", 60)).toEqual({ count: 1, ttlSeconds: 60 });
    now = 45_000;
    expect(await store.hit("k", 60)).toEqual({ count: 2, ttlSeconds: 15 });
    now = 60_000;
    expect(await store.hit("k", 60)).toEqual({ count: 1, ttlSeconds: 60 });
  });

  it("keeps keys apart", async () => {
    const store = createMemoryStore(() => 0);
    await store.hit("a", 60);
    expect((await store.hit("b", 60)).count).toBe(1);
  });
});

describe("checkRateLimit", () => {
  it("allows up to the limit, then blocks with the time left in the window", async () => {
    let now = 0;
    const store = createMemoryStore(() => now);
    const check = () => checkRateLimit("1.2.3.4", [perClient], store);
    expect(await check()).toEqual({ allowed: true });
    expect(await check()).toEqual({ allowed: true });
    now = 20_000;
    expect(await check()).toEqual({ allowed: false, retryAfterSeconds: 40 });
    now = 60_000;
    expect(await check()).toEqual({ allowed: true });
  });

  it("limits each visitor separately", async () => {
    const store = createMemoryStore(() => 0);
    await checkRateLimit("a", [perClient], store);
    await checkRateLimit("a", [perClient], store);
    expect((await checkRateLimit("a", [perClient], store)).allowed).toBe(false);
    expect((await checkRateLimit("b", [perClient], store)).allowed).toBe(true);
  });

  it("applies a site-wide rule across all visitors", async () => {
    const store = createMemoryStore(() => 0);
    for (const ip of ["a", "b", "c"]) {
      expect((await checkRateLimit(ip, [site], store)).allowed).toBe(true);
    }
    expect(await checkRateLimit("d", [site], store)).toEqual({
      allowed: false,
      retryAfterSeconds: 3600,
    });
  });

  it("stops at the first rule over its limit (the site counter is untouched)", async () => {
    const hit = vi.fn<RateLimitStore["hit"]>(async () => ({
      count: 99,
      ttlSeconds: 10,
    }));
    await checkRateLimit("a", [perClient, site], { hit });
    expect(hit).toHaveBeenCalledTimes(1);
  });

  it("keys visitors by a hash, never the raw IP", async () => {
    const hit = vi.fn<RateLimitStore["hit"]>(async () => ({
      count: 1,
      ttlSeconds: 60,
    }));
    await checkRateLimit("203.0.113.9", [perClient, site], { hit });
    expect(hit.mock.calls.map(([key]) => key)).toEqual([
      `t:ip:${hashClientId("203.0.113.9")}`,
      "t:all",
    ]);
    expect(JSON.stringify(hit.mock.calls)).not.toContain("203.0.113.9");
  });

  it("fails open (and logs) when the store is unreachable", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await checkRateLimit("a", [perClient], {
      hit: () => Promise.reject(new Error("ECONNREFUSED")),
    });
    expect(result).toEqual({ allowed: true });
    expect(log).toHaveBeenCalledOnce();
  });

  it("ships contact limits: 5 an hour per visitor, 100 a day overall", () => {
    expect(CONTACT_RATE_LIMITS).toEqual([
      { name: "contact:ip", scope: "client", limit: 5, windowSeconds: 3600 },
      {
        name: "contact:all",
        scope: "site",
        limit: 100,
        windowSeconds: 86400,
      },
    ]);
  });
});

describe("createUpstashStore", () => {
  const reply = (body: unknown, init?: ResponseInit) =>
    vi.fn<typeof fetch>(async () => Response.json(body, init));

  it("sends one authenticated pipeline: INCR, EXPIRE NX, TTL", async () => {
    const fetchImpl = reply([{ result: 3 }, { result: 0 }, { result: 1200 }]);
    const store = createUpstashStore(
      "https://redis.example.test/",
      "secret",
      fetchImpl,
    );
    expect(await store.hit("k", 3600)).toEqual({ count: 3, ttlSeconds: 1200 });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://redis.example.test/pipeline");
    expect(init?.method).toBe("POST");
    expect(new Headers(init?.headers).get("authorization")).toBe(
      "Bearer secret",
    );
    expect(JSON.parse(String(init?.body))).toEqual([
      ["INCR", "k"],
      ["EXPIRE", "k", "3600", "NX"],
      ["TTL", "k"],
    ]);
  });

  it("falls back to the full window if TTL is unavailable", async () => {
    const store = createUpstashStore(
      "https://r.test",
      "t",
      reply([{ result: 1 }, { result: 1 }, { result: -1 }]),
    );
    expect(await store.hit("k", 60)).toEqual({ count: 1, ttlSeconds: 60 });
  });

  it("throws on HTTP and command errors (so the check fails open)", async () => {
    await expect(
      createUpstashStore("https://r.test", "t", reply({}, { status: 401 })).hit(
        "k",
        60,
      ),
    ).rejects.toThrow("401");
    await expect(
      createUpstashStore(
        "https://r.test",
        "t",
        reply([{ error: "WRONGTYPE" }, {}, {}]),
      ).hit("k", 60),
    ).rejects.toThrow("WRONGTYPE");
  });
});

describe("storeFromEnv", () => {
  it("uses Redis when Upstash or Vercel KV credentials are set", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () =>
        Response.json([{ result: 1 }, { result: 1 }, { result: 60 }]),
      );
    for (const env of [
      {
        UPSTASH_REDIS_REST_URL: "https://u.test",
        UPSTASH_REDIS_REST_TOKEN: "x",
      },
      { KV_REST_API_URL: "https://kv.test", KV_REST_API_TOKEN: "y" },
    ]) {
      await storeFromEnv(env).hit("k", 60);
    }
    expect(fetchSpy.mock.calls.map(([url]) => url)).toEqual([
      "https://u.test/pipeline",
      "https://kv.test/pipeline",
    ]);
  });

  it("falls back to one shared in-memory store", () => {
    expect(storeFromEnv({})).toBe(storeFromEnv({ KV_REST_API_URL: " " }));
  });
});

describe("clientIdFromHeaders", () => {
  it.each([
    [{ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }, "203.0.113.9"],
    [{ "x-real-ip": "198.51.100.7" }, "198.51.100.7"],
    [{}, "unknown"],
  ])("reads %j as %s", (init, expected) => {
    expect(clientIdFromHeaders(new Headers(init))).toBe(expected);
  });
});
