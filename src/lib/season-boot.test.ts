// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";

import { SEASON_CONFIG } from "@/constants/seasons";

import { bootSeason, resolveSeason, SEASON_ATTRIBUTE } from "./seasons";

const root = () => document.documentElement;
const boot = () => bootSeason(SEASON_CONFIG, resolveSeason, SEASON_ATTRIBUTE);
const on = (y: number, m: number, d: number) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(y, m - 1, d, 12));
};

describe("bootSeason", () => {
  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
    root().removeAttribute(SEASON_ATTRIBUTE);
    root().style.removeProperty("--season-year");
  });

  it("applies today's season and the year being welcomed", () => {
    on(2026, 12, 28);
    boot();
    expect(root().getAttribute(SEASON_ATTRIBUTE)).toBe("new-year");
    expect(root().style.getPropertyValue("--season-year")).toBe('"2027"');
  });

  it("welcomes the current year once January has started", () => {
    on(2027, 1, 2);
    boot();
    expect(root().getAttribute(SEASON_ATTRIBUTE)).toBe("new-year");
    expect(root().style.getPropertyValue("--season-year")).toBe('"2027"');
  });

  it("leaves the normal theme on ordinary days", () => {
    on(2026, 3, 15);
    root().setAttribute(SEASON_ATTRIBUTE, "stale");
    boot();
    expect(root().hasAttribute(SEASON_ATTRIBUTE)).toBe(false);
  });

  it("lets ?season= force a season and remembers it", () => {
    on(2026, 3, 15);
    window.history.replaceState(null, "", "/?season=halloween");
    boot();
    expect(root().getAttribute(SEASON_ATTRIBUTE)).toBe("halloween");

    window.history.replaceState(null, "", "/");
    boot();
    expect(root().getAttribute(SEASON_ATTRIBUTE)).toBe("halloween");
  });

  it("forces the normal theme with ?season=none, and auto clears it", () => {
    on(2026, 12, 10);
    window.history.replaceState(null, "", "/?season=none");
    boot();
    expect(root().hasAttribute(SEASON_ATTRIBUTE)).toBe(false);

    window.history.replaceState(null, "", "/?season=auto");
    boot();
    expect(root().getAttribute(SEASON_ATTRIBUTE)).toBe("christmas");
    expect(window.localStorage.getItem(SEASON_CONFIG.storageKey)).toBeNull();
  });

  it("ignores unknown season names", () => {
    on(2026, 12, 10);
    window.history.replaceState(null, "", "/?season=easter");
    boot();
    expect(root().getAttribute(SEASON_ATTRIBUTE)).toBe("christmas");
  });
});
