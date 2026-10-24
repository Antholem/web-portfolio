import { expect, gotoHome, isMobile, test } from "./fixtures";

test.describe("404 page", () => {
  // The browser logs the 404 document response itself as a console error.
  test.use({ allowedProblems: /status of 404|HTTP 404/ });

  test("answers unknown URLs with a real 404, noindex and its own title", async ({
    page,
  }) => {
    const response = await page.goto("/no-such-page");
    expect(response!.status()).toBe(404);
    await expect(page).toHaveTitle("Page not found · Sam Antholem Manalo");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "This page drifted off the map.",
      }),
    ).toBeVisible();
  });

  test("“Back to home” returns to the home page", async ({ page }) => {
    await page.goto("/no-such-page");
    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Sam Antholem",
    );
  });

  test("section links leave the 404 and land on the section", async ({
    page,
  }) => {
    await page.goto("/no-such-page");
    await page
      .getByRole("navigation", { name: "Or jump to" })
      .getByRole("link", { name: "Work" })
      .click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect
      .poll(() =>
        page.evaluate(() =>
          Math.abs(
            document.getElementById("work")!.getBoundingClientRect().top,
          ),
        ),
      )
      .toBeLessThan(2);
  });

  test("the header nav works from the 404 too", async ({ page }) => {
    test.skip(isMobile(page), "Desktop nav; the menu is covered elsewhere.");
    await page.goto("/no-such-page");
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Contact" })
      .click();
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(
      page.getByRole("form", { name: "Contact form" }),
    ).toBeInViewport();
  });
});

test.describe("search and link previews", () => {
  test("home page has a canonical URL, social tags and structured data", async ({
    page,
  }) => {
    await gotoHome(page);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /^https?:\/\/[^/]+\/?$/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/opengraph-image/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    const jsonLd = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent())!,
    );
    expect(jsonLd["@graph"][0]).toMatchObject({
      "@type": "Person",
      name: "Sam Antholem Manalo",
    });
  });

  test("serves a 1200×630 PNG preview image", async ({ page, request }) => {
    await gotoHome(page);
    const src = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    const res = await request.get(
      new URL(src!).pathname + new URL(src!).search,
    );
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
    const png = await res.body();
    // PNG IHDR: width and height are big-endian at bytes 16 and 20.
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });

  test("serves robots.txt and a sitemap that list the home page", async ({
    request,
  }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/User-Agent: \*/i);
    expect(robots).toMatch(/Allow: \//);
    expect(robots).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toMatch(/<loc>https?:\/\/[^<]+\/<\/loc>/);
  });
});
