import type { Page } from "@playwright/test";

import { expect, gotoHome, test } from "./fixtures";

const PROJECTS = {
  all: ["Ledgerline", "Merchly", "Relay", "Forge UI"],
  web: ["Ledgerline", "Merchly"],
  ai: ["Relay"],
  oss: ["Forge UI"],
};

const visibleProjects = (page: Page) =>
  page
    .locator("#work article")
    .getByRole("heading", { level: 3 })
    .allTextContents();

test.describe("project filter", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page, "/#work");
  });

  test("filters projects by category and back to all", async ({ page }) => {
    const filter = page.getByRole("radiogroup", { name: "Filter projects" });
    await expect(filter.getByRole("radio", { name: "All" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(await visibleProjects(page)).toEqual(PROJECTS.all);

    for (const [label, key] of [
      ["Web apps", "web"],
      ["AI", "ai"],
      ["Open source", "oss"],
      ["All", "all"],
    ] as const) {
      await filter.getByRole("radio", { name: label }).click();
      await expect(filter.getByRole("radio", { name: label })).toHaveAttribute(
        "aria-checked",
        "true",
      );
      await expect.poll(() => visibleProjects(page)).toEqual(PROJECTS[key]);
    }
  });

  test("clicking the active filter keeps it selected", async ({ page }) => {
    const ai = page
      .getByRole("radiogroup", { name: "Filter projects" })
      .getByRole("radio", { name: "AI" });
    await ai.click();
    await ai.click();
    await expect(ai).toHaveAttribute("aria-checked", "true");
    expect(await visibleProjects(page)).toEqual(PROJECTS.ai);
  });

  test("works from the keyboard with roving focus", async ({ page }) => {
    await page
      .getByRole("heading", { name: "Scalable products built with precision." })
      .click();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("radio", { name: "All", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(
      page.getByRole("radio", { name: "Web apps", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("ArrowRight");
    // Radix moves roving focus on a timer; act only once it has landed.
    await expect(
      page
        .getByRole("radiogroup", { name: "Filter projects" })
        .getByRole("radio", { name: "AI" }),
    ).toBeFocused();
    await page.keyboard.press("Space");
    await expect(
      page
        .getByRole("radiogroup", { name: "Filter projects" })
        .getByRole("radio", { name: "AI" }),
    ).toHaveAttribute("aria-checked", "true");
    await expect.poll(() => visibleProjects(page)).toEqual(PROJECTS.ai);

    // One tab stop for the whole group: Tab leaves it for the first card link.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Case study" })).toBeFocused();
  });

  test("filtering does not shift the page or lose the filter bar", async ({
    page,
  }) => {
    const filter = page.getByRole("radiogroup", { name: "Filter projects" });
    const before = (await filter.boundingBox())!.y;
    await filter.getByRole("radio", { name: "Open source" }).click();
    await expect(filter).toBeInViewport();
    expect(
      Math.abs((await filter.boundingBox())!.y - before),
    ).toBeLessThanOrEqual(1);
  });
});
