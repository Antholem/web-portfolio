import type { Page } from "@playwright/test";

import { expect, gotoHome, isMobile, test } from "./fixtures";

/** Scrolls through the page so every content-visibility section renders once. */
async function renderWholePage(page: Page) {
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    }
    scrollTo(0, 0);
  });
}

/**
 * Text that sticks out of the viewport (or is clipped by a parent) at the
 * current width. The marquee is excluded: it scrolls off-screen by design.
 */
async function overflowingText(page: Page) {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const offenders: string[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const parent = node.parentElement!;
      if (!node.textContent?.trim()) continue;
      if (parent.closest("[aria-hidden='true'], .sr-only, script, style"))
        continue;
      if (parent.closest("[aria-label='Technologies I work with']")) continue;
      if (getComputedStyle(parent).textOverflow === "ellipsis") continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width === 0) continue;
        if (rect.left < -1 || rect.right > width + 1) {
          offenders.push(
            `"${node.textContent.trim().slice(0, 40)}" [${Math.round(rect.left)}, ${Math.round(rect.right)}]`,
          );
          break;
        }
      }
    }
    return offenders;
  });
}

const horizontalOverflow = (page: Page) =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );

test.describe("layout", () => {
  test("has no horizontal scroll and no text pushed off-screen", async ({
    page,
  }) => {
    await gotoHome(page);
    await renderWholePage(page);
    expect(await horizontalOverflow(page)).toBe(0);
    expect(await overflowingText(page)).toEqual([]);
  });

  test("holds up across the breakpoints (320 → 1920px)", async ({ page }) => {
    test.skip(isMobile(page), "Width sweep runs once, in the desktop project.");
    await gotoHome(page);
    for (const width of [320, 375, 639, 640, 768, 959, 960, 1099, 1100, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await renderWholePage(page);
      expect(await horizontalOverflow(page), `scroll width at ${width}px`).toBe(
        0,
      );
      expect(await overflowingText(page), `text at ${width}px`).toEqual([]);
    }
  });

  test("shows the right header controls for the viewport", async ({ page }) => {
    await gotoHome(page);
    const header = page.getByRole("banner");
    const menu = header.getByRole("button", { name: "Open menu" });
    const primary = header.getByRole("navigation", { name: "Primary" });
    const resume = header.getByRole("link", { name: "Résumé" });
    if (isMobile(page)) {
      await expect(menu).toBeVisible();
      await expect(primary).toBeHidden();
      await expect(resume).toBeHidden();
    } else {
      await expect(menu).toBeHidden();
      await expect(primary).toBeVisible();
      await expect(resume).toBeVisible();
      await expect(
        header.getByRole("link", { name: "Let’s talk" }),
      ).toBeVisible();
    }
    await expect(
      header.getByRole("button", { name: /switch to (light|dark) mode/i }),
    ).toBeVisible();
  });

  test("loads the portrait and logos", async ({ page }) => {
    await gotoHome(page);
    const portrait = page.getByRole("img", {
      name: "Portrait of Sam Antholem Manalo in a dark suit and blue tie",
    });
    await expect(portrait).toBeVisible();
    await expect
      .poll(() =>
        portrait.evaluate((img: HTMLImageElement) => img.naturalWidth),
      )
      .toBeGreaterThan(0);
    const headerLogo = page.getByRole("banner").locator("img");
    await expect
      .poll(() =>
        headerLogo.evaluate((img: HTMLImageElement) => img.naturalWidth),
      )
      .toBeGreaterThan(0);
  });

  test("footer links are not covered by other elements", async ({ page }) => {
    // Was QA-01: at ≥1280px the wordmark's glyph box sat on top of the links.
    await gotoHome(page);
    const nav = page.getByRole("navigation", { name: "Footer" });
    const widths = isMobile(page) ? [390] : [1100, 1280, 1440, 1920];
    for (const width of widths) {
      await page.setViewportSize({
        width,
        height: page.viewportSize()!.height,
      });
      await nav.scrollIntoViewIfNeeded();
      const covered = await nav.evaluate((el) =>
        [...el.querySelectorAll("a")]
          .filter((a) => {
            const r = a.getBoundingClientRect();
            const hit = document.elementFromPoint(
              r.left + r.width / 2,
              r.top + r.height / 2,
            );
            return !a.contains(hit);
          })
          .map((a) => a.textContent),
      );
      expect(covered, `covered footer links at ${width}px`).toEqual([]);
    }
  });
});

test.describe("metadata", () => {
  test("title, description, language and social tags", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Sam Antholem Manalo");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /^Software engineer building scalable digital platforms/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Sam Antholem Manalo",
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website",
    );
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
      "content",
      /width=device-width/,
    );
  });

  test("favicon and apple touch icon are served", async ({ page, request }) => {
    await page.goto("/");
    const icon = page.locator('link[rel="icon"]');
    await expect(icon).toHaveAttribute("type", "image/svg+xml");
    const iconRes = await request.get((await icon.getAttribute("href"))!);
    expect(iconRes.status()).toBe(200);
    expect(iconRes.headers()["content-type"]).toContain("image/svg+xml");

    const apple = page.locator('link[rel="apple-touch-icon"]');
    await expect(apple).toHaveAttribute("sizes", "180x180");
    const appleRes = await request.get((await apple.getAttribute("href"))!);
    expect(appleRes.status()).toBe(200);
    expect(appleRes.headers()["content-type"]).toContain("image/png");
  });

  test("declares a single theme-color tag for the default (dark) theme", async ({
    request,
  }) => {
    // Server HTML, before any script runs.
    const html = await (await request.get("/")).text();
    const tags = html.match(/<meta name="theme-color"[^>]*>/g) ?? [];
    expect(tags).toEqual(['<meta name="theme-color" content="#0a0a0a"/>']);
  });
});

test.describe("runtime health", () => {
  // The auto `pageProblems` fixture fails any test that logs errors/warnings
  // (incl. React hydration mismatches) or gets a 4xx/5xx from the app.
  test("loads, hydrates and scrolls the whole page without console noise", async ({
    page,
  }) => {
    await gotoHome(page);
    await renderWholePage(page);
    await page.reload();
    await expect(
      page.getByRole("button", { name: /switch to (light|dark) mode/i }),
    ).toBeVisible();
  });

  test("hydrates cleanly in light mode too", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await gotoHome(page);
    await expect(
      page.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeVisible();
  });
});
