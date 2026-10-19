import { test as base, expect, type Page } from "@playwright/test";

type Fixtures = {
  /** Console errors/warnings, uncaught errors and failed same-origin requests. */
  pageProblems: string[];
  /**
   * Problems a test expects; matches are not reported. A single RegExp (use
   * alternation for several): Playwright reads an array option as a
   * [value, options] tuple.
   */
  allowedProblems: RegExp | null;
};

export const test = base.extend<Fixtures>({
  allowedProblems: [null, { option: true }],

  pageProblems: [
    async ({ page, baseURL, allowedProblems }, use) => {
      const problems: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error" || msg.type() === "warning") {
          problems.push(`console.${msg.type()}: ${msg.text()}`);
        }
      });
      page.on("pageerror", (error) =>
        problems.push(`pageerror: ${error.message}`),
      );
      page.on("response", (response) => {
        if (response.url().startsWith(baseURL!) && response.status() >= 400) {
          problems.push(`HTTP ${response.status()}: ${response.url()}`);
        }
      });

      await use(problems);

      const unexpected = problems.filter((p) => !allowedProblems?.test(p));
      expect(unexpected, "console errors, warnings or failed requests").toEqual(
        [],
      );
    },
    { auto: true },
  ],
});

export { expect };

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 960;

/** Waits until React has hydrated (the theme toggle gets its real label). */
export async function gotoHome(page: Page, path = "/") {
  await page.goto(path);
  await expect(
    page.getByRole("button", { name: /switch to (light|dark) mode/i }),
  ).toBeVisible();
}

export async function getTheme(page: Page) {
  return page.evaluate(() => {
    const cls = document.documentElement.classList;
    return cls.contains("dark") ? "dark" : cls.contains("light") ? "light" : "";
  });
}
