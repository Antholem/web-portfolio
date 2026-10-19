/** Page background per theme; mirrors `--background` in globals.css. */
export const THEME_COLORS = {
  light: "#fafafa",
  dark: "#0a0a0a",
} as const;

export const DEFAULT_THEME = "dark" satisfies keyof typeof THEME_COLORS;
