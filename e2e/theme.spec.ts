import { expect, getTheme, gotoHome, test } from "./fixtures";

/** Wraps document.startViewTransition so tests can see whether it ran. */
async function spyOnViewTransitions(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const w = window as typeof window & {
      __vt: { calls: number; finished: number; themeAtStart: string[] };
    };
    w.__vt = { calls: 0, finished: 0, themeAtStart: [] };
    const original = Document.prototype.startViewTransition;
    if (!original) return;
    Document.prototype.startViewTransition = function (
      this: Document,
      ...args: Parameters<Document["startViewTransition"]>
    ) {
      w.__vt.calls += 1;
      w.__vt.themeAtStart.push(document.documentElement.className);
      const transition = original.apply(this, args);
      transition.finished.then(() => (w.__vt.finished += 1));
      return transition;
    } as Document["startViewTransition"];
  });
}

const vtState = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      (
        window as typeof window & {
          __vt: { calls: number; finished: number; themeAtStart: string[] };
        }
      ).__vt,
  );

test.describe("theme", () => {
  test("defaults to dark regardless of the OS preference", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await gotoHome(page);
    expect(await getTheme(page)).toBe("dark");
    await expect(
      page.getByRole("button", { name: "Switch to light mode" }),
    ).toBeVisible();
    const bg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );
    expect(bg).toBe("rgb(10, 10, 10)");
  });

  test("toggles with a circular View Transition anchored on the button and persists across reloads", async ({
    page,
  }) => {
    await spyOnViewTransitions(page);
    await gotoHome(page);
    const toggle = page.getByRole("button", { name: "Switch to light mode" });
    const box = (await toggle.boundingBox())!;

    await toggle.click();

    await expect(
      page.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeVisible();
    expect(await getTheme(page)).toBe("light");
    await expect.poll(async () => (await vtState(page)).finished).toBe(1);
    const vt = await vtState(page);
    expect(vt.calls).toBe(1);
    // The old snapshot is captured while the page is still dark.
    expect(vt.themeAtStart[0]).toContain("dark");

    const origin = await page.evaluate(() => {
      const s = document.documentElement.style;
      return {
        x: parseFloat(s.getPropertyValue("--reveal-x")),
        y: parseFloat(s.getPropertyValue("--reveal-y")),
        r: parseFloat(s.getPropertyValue("--reveal-r")),
        w: innerWidth,
        h: innerHeight,
      };
    });
    expect(origin.x).toBeCloseTo(box.x + box.width / 2, 0);
    expect(origin.y).toBeCloseTo(box.y + box.height / 2, 0);
    // The circle must reach the farthest corner or part of the page never flips.
    const farthest = Math.hypot(
      Math.max(origin.x, origin.w - origin.x),
      Math.max(origin.y, origin.h - origin.y),
    );
    expect(origin.r).toBeGreaterThanOrEqual(farthest - 0.5);

    expect(
      await page.evaluate(
        () => getComputedStyle(document.body).backgroundColor,
      ),
    ).toBe("rgb(250, 250, 250)");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "light",
    );

    await page.reload();
    // next-themes' inline script applies the class before first paint.
    expect(await getTheme(page)).toBe("light");
    await expect(
      page.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Switch to dark mode" }).click();
    await expect(
      page.getByRole("button", { name: "Switch to light mode" }),
    ).toBeVisible();
    expect(await getTheme(page)).toBe("dark");
  });

  test("applies the stored theme before hydration (no flash)", async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/", { waitUntil: "commit" });
    await page.waitForSelector("body");
    // Read as early as possible: the inline script must already have run.
    const firstPaint = await page.evaluate(() => ({
      cls: document.documentElement.className,
      scheme: getComputedStyle(document.documentElement).colorScheme,
    }));
    expect(firstPaint.cls).toContain("light");
    expect(firstPaint.scheme).toBe("light");
  });

  test("skips the View Transition for reduced-motion users", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await spyOnViewTransitions(page);
    await gotoHome(page);
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await expect(
      page.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeVisible();
    expect(await getTheme(page)).toBe("light");
    expect((await vtState(page)).calls).toBe(0);
  });

  test("swaps the sun/moon icon with the theme", async ({ page }) => {
    await gotoHome(page);
    const toggle = page.getByRole("button", { name: /switch to/i });
    await expect(toggle.locator("svg.lucide-sun")).toBeVisible();
    await expect(toggle.locator("svg.lucide-moon")).toBeHidden();
    await toggle.click();
    await expect(toggle.locator("svg.lucide-moon")).toBeVisible();
    await expect(toggle.locator("svg.lucide-sun")).toBeHidden();
  });

  test("can be operated from the keyboard", async ({ page }) => {
    await gotoHome(page);
    const toggle = page.getByRole("button", { name: "Switch to light mode" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("button", { name: "Switch to dark mode" }),
    ).toBeFocused();
    await page.keyboard.press("Space");
    await expect(
      page.getByRole("button", { name: "Switch to light mode" }),
    ).toBeFocused();
  });

  // Was QA-05: theme-color used to follow only the OS scheme.
  for (const os of ["light", "dark"] as const) {
    test(`browser chrome colour (theme-color) matches the site theme on a ${os} OS`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: os });
      await gotoHome(page);
      const read = () =>
        page.evaluate(() => {
          const metas = [
            ...document.querySelectorAll<HTMLMetaElement>(
              'meta[name="theme-color"]',
            ),
          ];
          const active = metas.filter(
            (m) => !m.media || matchMedia(m.media).matches,
          );
          const probe = document.createElement("div");
          probe.style.color = active[0]?.content ?? "";
          document.body.append(probe);
          const meta = getComputedStyle(probe).color;
          probe.remove();
          return {
            count: active.length,
            meta,
            page: getComputedStyle(document.body).backgroundColor,
          };
        });

      // Default (dark) site, whatever the OS says.
      await expect.poll(read).toEqual({
        count: 1,
        meta: "rgb(10, 10, 10)",
        page: "rgb(10, 10, 10)",
      });

      await page.getByRole("button", { name: "Switch to light mode" }).click();
      await expect.poll(read).toEqual({
        count: 1,
        meta: "rgb(250, 250, 250)",
        page: "rgb(250, 250, 250)",
      });

      await page.reload();
      await expect.poll(read).toEqual({
        count: 1,
        meta: "rgb(250, 250, 250)",
        page: "rgb(250, 250, 250)",
      });

      await page.getByRole("button", { name: "Switch to dark mode" }).click();
      await expect.poll(read).toEqual({
        count: 1,
        meta: "rgb(10, 10, 10)",
        page: "rgb(10, 10, 10)",
      });
    });
  }
});
