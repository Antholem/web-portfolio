import { expect, gotoHome, snackbar, test } from "./fixtures";

test.describe("security headers", () => {
  for (const path of [
    "/",
    "/no-such-page",
    "/opengraph-image",
    "/robots.txt",
  ]) {
    test(`are sent on ${path}`, async ({ request }) => {
      const headers = (await request.get(path)).headers();
      expect(headers["content-security-policy"]).toContain(
        "frame-ancestors 'none'",
      );
      expect(headers["content-security-policy"]).not.toContain("unsafe-eval");
      expect(headers["strict-transport-security"]).toMatch(/max-age=\d+/);
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["referrer-policy"]).toBe(
        "strict-origin-when-cross-origin",
      );
      expect(headers["permissions-policy"]).toContain("camera=()");
      expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
      expect(headers["x-powered-by"]).toBeUndefined();
    });
  }
});

test.describe("content security policy", () => {
  test("nothing the site does trips it", async ({ page }) => {
    // Collected in the page from the very first script, then read back.
    await page.addInitScript(() => {
      const w = window as typeof window & { __cspViolations: string[] };
      w.__cspViolations = [];
      document.addEventListener("securitypolicyviolation", (event) =>
        w.__cspViolations.push(
          `${event.violatedDirective} ← ${event.blockedURI || "inline"}`,
        ),
      );
    });

    await gotoHome(page);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => requestAnimationFrame(r));
      }
    });
    await page.getByRole("button", { name: /switch to light mode/i }).click();

    const form = page.getByRole("form", { name: "Contact form" });
    await form.getByRole("textbox", { name: "Name" }).fill("CSP Visitor");
    await form.getByRole("textbox", { name: "Email" }).fill("csp@example.test");
    await form.getByRole("textbox", { name: "Subject" }).fill("CSP check");
    await form.getByRole("textbox", { name: "Message" }).fill("Hello");
    await form.getByRole("button", { name: "Send message" }).click();
    await expect(snackbar(page, "Message sent")).toBeVisible({
      timeout: 15_000,
    });

    const violations = await page.evaluate(
      () =>
        (window as typeof window & { __cspViolations: string[] })
          .__cspViolations,
    );
    expect(violations).toEqual([]);
  });

  test.describe("against a foreign script", () => {
    // The browser logs the blocked load as a console error: that is the point.
    test.use({ allowedProblems: /Content Security Policy|evil\.js/ });

    test("blocks it", async ({ page }) => {
      await gotoHome(page);
      const loaded = await page.evaluate(
        () =>
          new Promise<boolean>((resolve) => {
            const script = document.createElement("script");
            script.src = "https://example.com/evil.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.append(script);
          }),
      );
      expect(loaded).toBe(false);
    });
  });
});
