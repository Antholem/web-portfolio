import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

import { expect, gotoHome, isMobile, test } from "./fixtures";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/**
 * Sections use `content-visibility: auto`, so off-screen ones are not laid out
 * and axe cannot measure their contrast. Nothing on the page depends on the
 * viewport height, so temporarily make the viewport as tall as the document:
 * every section renders and one axe pass covers the whole page.
 */
async function scan(page: Page) {
  const original = page.viewportSize()!;
  // Render once at the real size so `contain-intrinsic-size: auto` settles.
  const height = await page.evaluate(async () => {
    for (
      let y = 0;
      y < document.documentElement.scrollHeight;
      y += innerHeight
    ) {
      scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(r));
    }
    scrollTo(0, 0);
    return document.documentElement.scrollHeight;
  });
  await page.setViewportSize({ width: original.width, height });
  await page.evaluate(
    () =>
      new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
  );
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  await page.setViewportSize(original);
  return results.violations.flatMap((v) =>
    v.nodes.map(
      (node) =>
        `${v.id} (${v.impact}): ${node.target.join(" ")} — ${node.failureSummary?.split("\n")[1]?.trim() ?? v.help}`,
    ),
  );
}

async function setTheme(page: Page, theme: "dark" | "light") {
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
  await gotoHome(page);
  await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${theme}\\b`));
}

for (const theme of ["dark", "light"] as const) {
  test.describe(`axe (${theme} theme)`, () => {
    // One axe pass over the full ~8000px document takes 10–25s on its own;
    // under parallel workers it can exceed the 30s default. Not a hang: budget for it.
    test.describe.configure({ timeout: 90_000 });

    test("whole page has no WCAG 2.1 A/AA violations", async ({ page }) => {
      await setTheme(page, theme);
      expect(await scan(page)).toEqual([]);
    });

    test("contact form in its error state", async ({ page }) => {
      await setTheme(page, theme);
      const form = page.getByRole("form", { name: "Contact form" });
      await form.scrollIntoViewIfNeeded();
      await form.getByRole("button", { name: "Send message" }).click();
      await expect(form.getByText("Tell me your name")).toBeVisible();
      const results = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        .include("#contact")
        .analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    });

    test("contact form success state", async ({ page }) => {
      await setTheme(page, theme);
      const form = page.getByRole("form", { name: "Contact form" });
      await form.scrollIntoViewIfNeeded();
      await form.getByRole("textbox", { name: "Name" }).fill("Axe Visitor");
      await form
        .getByRole("textbox", { name: "Email" })
        .fill("axe@example.test");
      await form.getByRole("textbox", { name: "Message" }).fill("Hello");
      await form.getByRole("button", { name: "Send message" }).click();
      await expect(
        page.getByRole("heading", { name: "Message sent" }),
      ).toBeFocused();
      const results = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        .include("#contact")
        .analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    });

    test("open mobile menu", async ({ page }) => {
      test.skip(!isMobile(page), "Mobile menu only exists below 960px.");
      await setTheme(page, theme);
      await page.getByRole("button", { name: "Open menu" }).click();
      const results = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        .include("header")
        .analyze();
      expect(results.violations.map((v) => v.id)).toEqual([]);
    });
  });
}

test("visible link text is part of the accessible name (WCAG 2.5.3)", async ({
  page,
}) => {
  // Was QA-03: the home link's aria-label hid its visible text.
  await gotoHome(page);
  await expect(
    page.getByRole("banner").getByRole("link").first(),
  ).toHaveAccessibleName(
    isMobile(page) ? "antholem — home" : "antholem / software engineer — home",
  );
  const results = await new AxeBuilder({ page })
    .withRules(["label-content-name-mismatch"])
    .analyze();
  expect(
    results.violations.flatMap((v) => v.nodes.map((n) => n.target.join(" "))),
  ).toEqual([]);
});

/** Asserts the focused element shows a visible focus indicator. */
async function expectFocusVisible(page: Page) {
  const style = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const s = getComputedStyle(el);
    // The message textarea is borderless by design; its wrapper owns the
    // focus ring via :focus-within.
    const owner = el.tagName === "TEXTAREA" ? el.parentElement! : el;
    return {
      tag: el.tagName,
      name:
        el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 30),
      outline: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) >= 1,
      ring: getComputedStyle(owner).boxShadow !== "none",
    };
  });
  expect(
    style.outline || style.ring,
    `focus indicator on ${style.tag} "${style.name}"`,
  ).toBe(true);
}

async function tabTo(page: Page) {
  await page.keyboard.press("Tab");
  await expectFocusVisible(page);
}

test.describe("keyboard", () => {
  test("header: logical tab order with visible focus", async ({ page }) => {
    await gotoHome(page);
    const expected = isMobile(page)
      ? ["antholem — home", "Switch to light mode", "Open menu"]
      : [
          "antholem / software engineer — home",
          "About",
          "Experience",
          "Stack",
          "Services",
          "Work",
          "Contact",
          "Switch to light mode",
          "Résumé",
          "Let’s talk",
        ];
    for (const name of expected) {
      await tabTo(page);
      const focused = page.locator(":focus");
      await expect(focused).toHaveAccessibleName(name);
    }
    // Then straight into the page content.
    await tabTo(page);
    await expect(page.locator(":focus")).toHaveAccessibleName("View projects");
  });

  test("mobile menu is fully keyboard operable", async ({ page }) => {
    test.skip(!isMobile(page), "Mobile menu only exists below 960px.");
    await gotoHome(page);
    const button = page.getByRole("button", { name: "Open menu" });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("navigation", { name: "Mobile" }),
    ).toBeVisible();
    for (const label of [
      "About",
      "Experience",
      "Stack",
      "Services",
      "Work",
      "Contact",
    ]) {
      await tabTo(page);
      await expect(page.locator(":focus")).toHaveText(new RegExp(`^${label}`));
    }
    await tabTo(page);
    await expect(page.locator(":focus")).toHaveText("Résumé");
    await tabTo(page);
    await expect(page.locator(":focus")).toHaveText("Let’s talk");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeHidden();
  });

  // The E2E server uses nodemailer's JSON transport: nothing is delivered.
  test("contact form can be filled and sent with the keyboard alone", async ({
    page,
  }) => {
    await gotoHome(page, "/#contact");
    await page
      .getByRole("heading", { name: "Let’s collaborate on your next project." })
      .click();
    const names = [];
    for (let i = 0; i < 4; i++) {
      await tabTo(page);
      names.push(
        await page.evaluate(
          () =>
            document.activeElement!.getAttribute("aria-label") ??
            document.activeElement!.textContent,
        ),
      );
    }
    expect(names).toEqual([
      "antholemlemmanalo@gmail.com",
      "Copy email address",
      "+63 977 333 6944",
      "", // the Name input (its <label> is checked below)
    ]);
    await expect(page.getByRole("textbox", { name: "Name" })).toBeFocused();
    await page.keyboard.type("Jane");
    await tabTo(page);
    await expect(page.getByRole("textbox", { name: "Email" })).toBeFocused();
    await page.keyboard.type("jane@example.test");

    await tabTo(page);
    await expect(
      page.getByRole("radio", { name: "Full-stack build" }),
    ).toBeFocused();
    await page.keyboard.press("ArrowRight");
    // Radix moves roving focus on a timer; act only once it has landed.
    await expect(
      page.getByRole("radio", { name: "Design system" }),
    ).toBeFocused();
    await page.keyboard.press("Space");
    await expect(
      page.getByRole("radio", { name: "Design system" }),
    ).toHaveAttribute("aria-checked", "true");

    // The formatting toolbar is a single tab stop; arrows move within it.
    await tabTo(page);
    await expect(page.getByRole("button", { name: "Bold" })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("button", { name: "Italic" })).toBeFocused();

    await tabTo(page);
    await expect(page.getByRole("textbox", { name: "Message" })).toBeFocused();
    await page.keyboard.type("Hello");
    await tabTo(page);
    await expect(
      page.getByRole("button", { name: "Refine with AI" }),
    ).toBeFocused();
    await tabTo(page);
    await expect(
      page.getByRole("button", { name: "Send message" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    // Focus lands on the confirmation, so screen readers announce it.
    await expect(
      page.getByRole("heading", { name: "Message sent" }),
    ).toBeFocused();
    await tabTo(page);
    await expect(
      page.getByRole("button", { name: "Send another" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("textbox", { name: "Name" })).toHaveValue("");
  });

  test("validation errors move focus to the first invalid field", async ({
    page,
  }) => {
    await gotoHome(page, "/#contact");
    const send = page.getByRole("button", { name: "Send message" });
    await send.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("textbox", { name: "Name" })).toBeFocused();
    await expectFocusVisible(page);
  });
});

test.describe("reduced motion", () => {
  test.use({ colorScheme: "dark" });

  test("stops decorative animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoHome(page);
    const marquee = page
      .getByRole("region", { name: "Technologies I work with" })
      .getByRole("list");
    expect(
      await marquee.evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    const pulse = await page.evaluate(() => {
      const dot = [...document.querySelectorAll("span[aria-hidden]")].find(
        (el) => el.className.includes("before:animate-status-pulse"),
      )!;
      return getComputedStyle(dot, "::before").display;
    });
    expect(pulse).toBe("none");
  });

  test("animates when motion is allowed (control)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await gotoHome(page);
    const marquee = page
      .getByRole("region", { name: "Technologies I work with" })
      .getByRole("list");
    expect(
      await marquee.evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("marquee");
  });
});
