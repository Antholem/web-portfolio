// @vitest-environment node
import { describe, expect, it } from "vitest";

import { contentSecurityPolicy, securityHeaders } from "./security-headers";

const directives = (csp: string) =>
  Object.fromEntries(
    csp.split("; ").map((d) => {
      const [name, ...sources] = d.split(" ");
      return [name, sources];
    }),
  );

describe("contentSecurityPolicy", () => {
  it("locks every source to this origin and forbids framing and plugins", () => {
    const csp = directives(contentSecurityPolicy({ dev: false }));
    expect(csp["default-src"]).toEqual(["'self'"]);
    expect(csp["connect-src"]).toEqual(["'self'"]);
    expect(csp["font-src"]).toEqual(["'self'"]);
    expect(csp["form-action"]).toEqual(["'self'"]);
    expect(csp["base-uri"]).toEqual(["'self'"]);
    expect(csp["object-src"]).toEqual(["'none'"]);
    expect(csp["frame-ancestors"]).toEqual(["'none'"]);
  });

  it("allows eval only in development", () => {
    expect(contentSecurityPolicy({ dev: false })).not.toContain("unsafe-eval");
    expect(
      directives(contentSecurityPolicy({ dev: true }))["script-src"],
    ).toContain("'unsafe-eval'");
  });

  it("never allows third-party hosts or wildcards", () => {
    const csp = contentSecurityPolicy({ dev: false });
    expect(csp).not.toMatch(/https?:|\*/);
  });
});

describe("securityHeaders", () => {
  it("sends each header once", () => {
    const keys = securityHeaders({ dev: false }).map((h) => h.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toEqual([
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Cross-Origin-Opener-Policy",
    ]);
  });

  it("keeps the clipboard available for “Copy email”", () => {
    const policy = securityHeaders({ dev: false }).find(
      (h) => h.key === "Permissions-Policy",
    )!.value;
    expect(policy).not.toContain("clipboard");
    expect(policy).toContain("camera=()");
  });
});
