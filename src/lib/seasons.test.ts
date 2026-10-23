// @vitest-environment node
import { describe, expect, it } from "vitest";

import { SEASON_CONFIG } from "@/constants/seasons";

import { resolveSeason, seasonBootScript, type SeasonConfig } from "./seasons";

const on = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12);
const season = (y: number, m: number, d: number, config = SEASON_CONFIG) =>
  resolveSeason(config, on(y, m, d));

describe("resolveSeason (site config)", () => {
  it.each([
    // Normal days
    [2026, 3, 15, null],
    [2026, 7, 1, null],
    [2026, 11, 30, null],
    // Christmas 1–26 Dec, edges included
    [2026, 12, 1, "christmas"],
    [2026, 12, 25, "christmas"],
    [2026, 12, 26, "christmas"],
    // New Year 27 Dec – 5 Jan, across the year boundary
    [2026, 12, 27, "new-year"],
    [2026, 12, 31, "new-year"],
    [2027, 1, 1, "new-year"],
    [2027, 1, 5, "new-year"],
    [2027, 1, 6, null],
    // Valentine's 7–14 Feb (2028: no Lunar New Year overlap)
    [2028, 2, 6, null],
    [2028, 2, 7, "valentines"],
    [2028, 2, 14, "valentines"],
    [2028, 2, 15, null],
    // Halloween 17 Oct – 1 Nov
    [2026, 10, 16, null],
    [2026, 10, 17, "halloween"],
    [2026, 10, 31, "halloween"],
    [2026, 11, 1, "halloween"],
    [2026, 11, 2, null],
    // Birthday 5 Aug, that day only
    [2026, 8, 4, null],
    [2026, 8, 5, "birthday"],
    [2027, 8, 5, "birthday"],
    [2026, 8, 6, null],
  ] as const)("%i-%i-%i → %s", (y, m, d, expected) => {
    expect(season(y, m, d)).toBe(expected);
  });

  it("follows the moving Lunar New Year date (5 days before – 7 after)", () => {
    // 2026: 17 Feb → 12–24 Feb (12–14 Feb yield to Valentine's, below)
    expect(season(2026, 2, 15)).toBe("lunar-new-year");
    expect(season(2026, 2, 24)).toBe("lunar-new-year");
    expect(season(2026, 2, 25)).toBeNull();
    // 2028: 26 Jan → 21 Jan – 2 Feb
    expect(season(2028, 1, 20)).toBeNull();
    expect(season(2028, 1, 21)).toBe("lunar-new-year");
    expect(season(2028, 2, 2)).toBe("lunar-new-year");
  });

  it("keeps Valentine's on 7–14 Feb even when Lunar New Year overlaps", () => {
    // 2026: Lunar New Year window starts 12 Feb.
    expect(season(2026, 2, 12)).toBe("valentines");
    expect(season(2026, 2, 14)).toBe("valentines");
    // 2029: Lunar New Year is 13 Feb itself.
    expect(season(2029, 2, 13)).toBe("valentines");
    expect(season(2029, 2, 15)).toBe("lunar-new-year");
    // 2027: Lunar New Year is 6 Feb; it holds until Valentine's begins.
    expect(season(2027, 2, 6)).toBe("lunar-new-year");
    expect(season(2027, 2, 7)).toBe("valentines");
  });
});

describe("resolveSeason (rules)", () => {
  const withBirthday: SeasonConfig = {
    ...SEASON_CONFIG,
    rules: [
      { id: "birthday", from: [12, 24], to: [12, 24] },
      ...SEASON_CONFIG.rules,
    ],
  };

  it("lets the birthday win over any other season that day", () => {
    expect(season(2026, 12, 24, withBirthday)).toBe("birthday");
    expect(season(2026, 12, 23, withBirthday)).toBe("christmas");
  });

  it("matches a moving feast whose window crosses into the previous year", () => {
    const config: SeasonConfig = {
      ...SEASON_CONFIG,
      rules: [{ id: "new-year", dates: { 2027: [1, 1] }, before: 2, after: 0 }],
    };
    expect(season(2026, 12, 30, config)).toBe("new-year");
    expect(season(2026, 12, 29, config)).toBeNull();
  });
});

describe("seasonBootScript", () => {
  it("is a self-contained expression that embeds the config", () => {
    const script = seasonBootScript(SEASON_CONFIG);
    expect(script).toContain('"storageKey":"season-preview"');
    expect(script).toContain('"data-season"');
    // Must parse as standalone JavaScript.
    expect(() => new Function(script)).not.toThrow();
  });
});
