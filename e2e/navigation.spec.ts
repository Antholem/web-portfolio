import type { Locator, Page } from "@playwright/test";

import { expect, gotoHome, isMobile, test } from "./fixtures";

const SECTIONS = [
  { label: "About", id: "about", eyebrow: "01 / About" },
  { label: "Experience", id: "experience", eyebrow: "02 / Experience" },
  { label: "Stack", id: "stack", eyebrow: "03 / Stack" },
  { label: "Services", id: "services", eyebrow: "04 / Services" },
  { label: "Work", id: "work", eyebrow: "05 / Selected work" },
  { label: "Contact", id: "contact", eyebrow: "06 / Contact" },
];

/** The section is scrolled to, and its heading is not hidden under the sticky header. */
async function expectLandedOn(page: Page, id: string, eyebrow: string) {
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  const section = page.locator(`#${id}`);
  // Top-aligned, unless the page has run out of scroll (the last section).
  await expect
    .poll(() =>
      section.evaluate((el) => {
        const top = el.getBoundingClientRect().top;
        const atBottom =
          Math.ceil(scrollY + innerHeight) >=
          document.documentElement.scrollHeight - 1;
        return Math.abs(top) <= 1 || (atBottom && top > 0);
      }),
    )
    .toBe(true);
  const header = (await page.getByRole("banner").boundingBox())!;
  const label = (await section.getByText(eyebrow).boundingBox())!;
  expect(label.y).toBeGreaterThanOrEqual(header.y + header.height);
  await expect(section.getByRole("heading", { level: 2 })).toBeInViewport();
}

async function getScrollY(page: Page) {
  return page.evaluate(() => Math.round(window.scrollY));
}

const menuButton = (page: Page): Locator =>
  page.getByRole("button", { name: /open menu|close menu/i });

test.describe("in-page navigation", () => {
  for (const { label, id, eyebrow } of SECTIONS) {
    test(`header link “${label}” scrolls to its section`, async ({ page }) => {
      await gotoHome(page);
      if (isMobile(page)) {
        await menuButton(page).click();
        await page
          .getByRole("navigation", { name: "Mobile" })
          .getByRole("link", { name: new RegExp(`^${label}`) })
          .click();
        await expect(
          page.getByRole("navigation", { name: "Mobile" }),
        ).toBeHidden();
      } else {
        await page
          .getByRole("navigation", { name: "Primary" })
          .getByRole("link", { name: label })
          .click();
      }
      await expectLandedOn(page, id, eyebrow);
    });
  }

  test("deep links land on the section", async ({ page }) => {
    await gotoHome(page, "/#services");
    await expectLandedOn(page, "services", "04 / Services");
  });

  test("hero “View projects” jumps to the work section", async ({ page }) => {
    await gotoHome(page);
    await page.getByRole("link", { name: "View projects" }).click();
    await expectLandedOn(page, "work", "05 / Selected work");
  });

  test("header “Let’s talk” jumps to contact", async ({ page }) => {
    await gotoHome(page);
    if (isMobile(page)) {
      await menuButton(page).click();
      await page
        .getByRole("navigation", { name: "Mobile" })
        .getByRole("link", { name: "Let’s talk" })
        .click();
    } else {
      await page
        .getByRole("banner")
        .getByRole("link", { name: "Let’s talk" })
        .click();
    }
    await expectLandedOn(page, "contact", "06 / Contact");
  });

  test("footer section links navigate", async ({ page }) => {
    await gotoHome(page);
    for (const [label, id, eyebrow] of [
      ["Work", "work", "05 / Selected work"],
      ["About", "about", "01 / About"],
      ["Contact", "contact", "06 / Contact"],
    ]) {
      await page
        .getByRole("navigation", { name: "Footer" })
        .getByRole("link", { name: label })
        .click();
      await expectLandedOn(page, id, eyebrow);
    }
  });

  test("a deep link to the last section lands on it after a cold load", async ({
    page,
  }) => {
    await gotoHome(page, "/#contact");
    await expectLandedOn(page, "contact", "06 / Contact");
  });

  test("Back/Forward between sections re-aligns the target", async ({
    page,
  }) => {
    await gotoHome(page, "/#about");
    await page.goto("/#contact");
    await expectLandedOn(page, "contact", "06 / Contact");
    await page.goBack();
    await expectLandedOn(page, "about", "01 / About");
    await page.goForward();
    await expectLandedOn(page, "contact", "06 / Contact");
  });

  test("the visitor's own scroll wins over the anchor settler", async ({
    page,
  }) => {
    await gotoHome(page);
    await page.getByRole("link", { name: "View projects" }).click();
    await expectLandedOn(page, "work", "05 / Selected work");
    await page.mouse.wheel(0, 600);
    await expect
      .poll(async () =>
        Math.round((await page.locator("#work").boundingBox())!.y),
      )
      .toBeLessThan(-300);
  });

  test("footer “Back to top” returns to the top", async ({ page }) => {
    await gotoHome(page);
    const footer = page.getByRole("contentinfo");
    await footer.scrollIntoViewIfNeeded();
    await expect.poll(() => getScrollY(page)).toBeGreaterThan(0);
    await footer.getByRole("link", { name: "Back to top" }).click();
    await expect.poll(() => getScrollY(page)).toBe(0);
    await expect(page).toHaveURL(/#top$/);
  });

  test("the logo returns to the top", async ({ page }) => {
    await gotoHome(page, "/#contact");
    await expect.poll(() => getScrollY(page)).toBeGreaterThan(0);
    await page.getByRole("link", { name: /— home$/ }).click();
    await expect.poll(() => getScrollY(page)).toBe(0);
  });

  test("the header stays pinned while scrolling", async ({ page }) => {
    await gotoHome(page, "/#stack");
    await expect.poll(() => getScrollY(page)).toBeGreaterThan(0);
    const header = (await page.getByRole("banner").boundingBox())!;
    expect(header.y).toBe(0);
    await expect(page.getByRole("banner")).toBeInViewport();
  });

  test("external profile links point at the configured URLs", async ({
    page,
  }) => {
    await gotoHome(page);
    await expect(
      page.getByRole("link", { name: "GitHub" }).first(),
    ).toHaveAttribute("href", "https://github.com/Antholem");
    await expect(
      page.getByRole("link", { name: "More on GitHub" }),
    ).toHaveAttribute("href", "https://github.com/Antholem");
  });
});

test.describe("mobile menu", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!isMobile(page), "The menu only exists below 960px.");
    await gotoHome(page);
  });

  test("desktop nav is replaced by a menu button", async ({ page }) => {
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeHidden();
    await expect(menuButton(page)).toBeVisible();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("opens, lists every section and closes on Escape", async ({ page }) => {
    await menuButton(page).click();
    const nav = page.getByRole("navigation", { name: "Mobile" });
    await expect(nav).toBeVisible();
    await expect(menuButton(page)).toHaveAccessibleName("Close menu");
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
    await expect(menuButton(page)).toHaveAttribute(
      "aria-controls",
      "mobile-nav",
    );

    for (const { label } of SECTIONS) {
      await expect(
        nav.getByRole("link", { name: new RegExp(`^${label}`) }),
      ).toBeVisible();
    }
    // The open menu must fit on screen so every item is reachable.
    const box = (await nav.boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize()!.height);

    await page.keyboard.press("Escape");
    await expect(nav).toBeHidden();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("closes when a link is followed and lands on the section", async ({
    page,
  }) => {
    await menuButton(page).click();
    await page
      .getByRole("navigation", { name: "Mobile" })
      .getByRole("link", { name: /^Stack/ })
      .click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
    await expectLandedOn(page, "stack", "03 / Stack");
  });

  test("closes when the viewport grows to desktop", async ({ page }) => {
    await menuButton(page).click();
    await expect(
      page.getByRole("navigation", { name: "Mobile" }),
    ).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 844 });
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeVisible();
    // Shrinking again must not resurrect it.
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
  });

  // Was QA-04: focus used to fall to <body>.
  test("Escape from a menu link returns focus to the menu button", async ({
    page,
  }) => {
    await menuButton(page).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(
      page
        .getByRole("navigation", { name: "Mobile" })
        .getByRole("link", { name: /^About/ }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
    await expect(menuButton(page)).toBeFocused();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape in a page field leaves focus in that field", async ({
    page,
  }) => {
    await menuButton(page).click();
    const name = page.getByRole("textbox", { name: "Name" });
    await name.focus();
    await expect(name).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(name).toBeFocused();
  });

  test("the Résumé link closes the menu too", async ({ page }) => {
    await menuButton(page).click();
    await page
      .getByRole("navigation", { name: "Mobile" })
      .getByRole("link", { name: "Résumé" })
      .click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  });

  test("the home link is named by its visible text (label in name)", async ({
    page,
  }) => {
    await expect(
      page.getByRole("link", { name: "antholem — home", exact: true }),
    ).toBeVisible();
  });
});

test.describe("robustness", () => {
  test.use({ allowedProblems: /URI malformed/ });

  test("a malformed fragment in the URL does not crash the page", async ({
    page,
  }) => {
    await page.goto("/#100%");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("This page couldn’t load")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /switch to (light|dark) mode/i }),
    ).toBeVisible();
  });
});

test.describe("smooth scrolling", () => {
  /** Distinct scroll positions seen over ~1.5s after `act` — 1–2 means a jump. */
  async function scrollSteps(page: Page, act: () => Promise<void>) {
    await page.evaluate(() => {
      const w = window as unknown as { __steps: number[] };
      w.__steps = [];
      const start = performance.now();
      const tick = () => {
        w.__steps.push(Math.round(scrollY));
        if (performance.now() - start < 1500) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await act();
    await page.waitForTimeout(1700);
    const steps = await page.evaluate(
      () => (window as unknown as { __steps: number[] }).__steps,
    );
    return steps.filter((v, i) => i === 0 || v !== steps[i - 1]).length - 1;
  }

  const sectionTop = (page: Page, id: string) =>
    page
      .locator(`#${id}`)
      .evaluate((el) => Math.round(el.getBoundingClientRect().top) || 0); // avoid -0

  test("nav links glide to the section and land aligned; the logo glides back to the top", async ({
    page,
  }) => {
    test.skip(
      isMobile(page),
      "desktop nav; the mobile menu shares the same links",
    );
    await gotoHome(page);
    const glide = await scrollSteps(page, () =>
      page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Contact" })
        .click(),
    );
    expect(glide).toBeGreaterThan(10);
    await expect.poll(() => sectionTop(page, "contact")).toBe(0);

    // With a settle still pending for #contact, #top must not be pulled back.
    const back = await scrollSteps(page, () =>
      page.getByRole("banner").getByRole("link", { name: /home$/ }).click(),
    );
    expect(back).toBeGreaterThan(10);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });

    test("jumps instantly instead of gliding", async ({ page }) => {
      test.skip(isMobile(page), "desktop nav");
      await gotoHome(page);
      const steps = await scrollSteps(page, () =>
        page
          .getByRole("navigation", { name: "Primary" })
          .getByRole("link", { name: "Contact" })
          .click(),
      );
      expect(steps).toBeLessThanOrEqual(3);
      await expect.poll(() => sectionTop(page, "contact")).toBe(0);
    });
  });
});
