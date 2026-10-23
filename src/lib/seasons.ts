export type SeasonId =
  | "birthday"
  | "lunar-new-year"
  | "valentines"
  | "halloween"
  | "christmas"
  | "new-year";

/** [month 1–12, day] */
export type MonthDay = readonly [number, number];

export type SeasonRule =
  | { id: SeasonId; from: MonthDay; to: MonthDay }
  | {
      id: SeasonId;
      /** Moving feasts: the main day per year, shown `before`/`after` days around it. */
      dates: Readonly<Record<number, MonthDay>>;
      before: number;
      after: number;
    };

export type SeasonConfig = {
  /** Highest priority first; the first rule that matches wins. */
  rules: readonly SeasonRule[];
  /** Every season that can be previewed, including ones without an active rule. */
  ids: readonly SeasonId[];
  storageKey: string;
};

export const SEASON_ATTRIBUTE = "data-season";

/**
 * Pure and self-contained (no outer references): it is also serialised into
 * the pre-paint <head> script, so it must run as a standalone function.
 */
export function resolveSeason(
  config: SeasonConfig,
  now: Date = new Date(),
): SeasonId | null {
  const DAY = 86_400_000;
  const year = now.getFullYear();
  const today = Date.UTC(year, now.getMonth(), now.getDate());
  const at = (y: number, md: MonthDay) => Date.UTC(y, md[0] - 1, md[1]);

  for (const rule of config.rules) {
    if ("dates" in rule) {
      // Check neighbouring years so windows that straddle 1 January still match.
      for (const y of [year - 1, year, year + 1]) {
        const main = rule.dates[y];
        if (!main) continue;
        const day = at(y, main);
        if (today >= day - rule.before * DAY && today <= day + rule.after * DAY)
          return rule.id;
      }
    } else {
      const from = at(year, rule.from);
      const to = at(year, rule.to);
      const inside =
        from <= to
          ? today >= from && today <= to
          : today >= from || today <= to; // wraps the new year, e.g. 27 Dec – 3 Jan
      if (inside) return rule.id;
    }
  }
  return null;
}

/**
 * Runs before first paint. A `?season=` query (or a stored preview) overrides
 * the date: an id forces that season, "none" forces the normal theme and
 * "auto" clears the override.
 */
export function bootSeason(
  config: SeasonConfig,
  resolve: typeof resolveSeason,
  attribute: string,
) {
  let season: string | null | undefined;
  try {
    const query = new URLSearchParams(window.location.search).get("season");
    if (query === "auto") window.localStorage.removeItem(config.storageKey);
    else if (query) window.localStorage.setItem(config.storageKey, query);

    const saved = window.localStorage.getItem(config.storageKey);
    if (saved === "none") season = null;
    else if (saved && (config.ids as readonly string[]).indexOf(saved) !== -1)
      season = saved;
  } catch {
    // Storage can be blocked (private mode); fall back to the date.
  }
  if (season === undefined) season = resolve(config);
  const root = document.documentElement;
  if (season) root.setAttribute(attribute, season);
  else root.removeAttribute(attribute);

  // The year being welcomed (Jul–Dec → next year), for CSS `content` on a
  // static page that cannot know the date at build time.
  const now = new Date();
  const welcomed = now.getFullYear() + (now.getMonth() >= 6 ? 1 : 0);
  root.style.setProperty("--season-year", `"${welcomed}"`);
}

export function seasonBootScript(config: SeasonConfig) {
  return `(${bootSeason.toString()})(${JSON.stringify(config)},${resolveSeason.toString()},${JSON.stringify(SEASON_ATTRIBUTE)})`;
}
