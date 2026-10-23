import {
  Cake,
  Flower2,
  Ghost,
  Heart,
  PartyPopper,
  Snowflake,
  type LucideIcon,
} from "lucide-react";

import type {
  MonthDay,
  SeasonConfig,
  SeasonId,
  SeasonRule,
} from "@/lib/seasons";

const OWNER_BIRTHDAY: MonthDay | null = [8, 5];

/** Lunar New Year (Spring Festival) — first day of the lunar year. */
const LUNAR_NEW_YEAR: Record<number, MonthDay> = {
  2026: [2, 17],
  2027: [2, 6],
  2028: [1, 26],
  2029: [2, 13],
  2030: [2, 3],
  2031: [1, 23],
  2032: [2, 11],
  2033: [1, 31],
  2034: [2, 19],
  2035: [2, 8],
};

// Priority order: the first matching rule wins. Valentine's sits above Lunar
// New Year so 14 Feb always reads as Valentine's when the two overlap.
// Windows sit between a single day and the 2–3 week events games run
// (e.g. Fortnite/Overwatch Halloween from ~9 Oct, Steam winter sale to ~5 Jan).
const RULES: SeasonRule[] = [
  ...(OWNER_BIRTHDAY
    ? [{ id: "birthday", from: OWNER_BIRTHDAY, to: OWNER_BIRTHDAY } as const]
    : []),
  { id: "valentines", from: [2, 7], to: [2, 14] },
  { id: "lunar-new-year", dates: LUNAR_NEW_YEAR, before: 5, after: 7 },
  { id: "halloween", from: [10, 17], to: [11, 1] },
  { id: "christmas", from: [12, 1], to: [12, 26] },
  { id: "new-year", from: [12, 27], to: [1, 5] },
];

export const SEASON_CONFIG: SeasonConfig = {
  rules: RULES,
  ids: [
    "birthday",
    "lunar-new-year",
    "valentines",
    "halloween",
    "christmas",
    "new-year",
  ],
  storageKey: "season-preview",
};

export type SeasonMeta = {
  id: SeasonId;
  label: string;
  greeting: string;
  icon: LucideIcon;
  /** Human-readable window, for the preview control. */
  when: string;
};

export const SEASONS: SeasonMeta[] = [
  {
    id: "new-year",
    label: "New Year",
    greeting: "Happy New Year",
    icon: PartyPopper,
    when: "27 Dec – 5 Jan",
  },
  {
    id: "lunar-new-year",
    label: "Lunar New Year",
    greeting: "Happy Lunar New Year",
    icon: Flower2,
    when: "5 days before – 7 days after (date varies)",
  },
  {
    id: "valentines",
    label: "Valentine’s Day",
    greeting: "Happy Valentine’s",
    icon: Heart,
    when: "7 – 14 Feb",
  },
  {
    id: "halloween",
    label: "Halloween",
    greeting: "Happy Halloween",
    icon: Ghost,
    when: "17 Oct – 1 Nov",
  },
  {
    id: "christmas",
    label: "Christmas",
    greeting: "Happy holidays",
    icon: Snowflake,
    when: "1 – 26 Dec",
  },
  {
    id: "birthday",
    label: "Birthday",
    greeting: "It’s my birthday",
    icon: Cake,
    when: "5 Aug",
  },
];
