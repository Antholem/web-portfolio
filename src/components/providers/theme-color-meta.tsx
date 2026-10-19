"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import { THEME_COLORS } from "@/constants/theme";

/** Keeps the browser UI colour in step with the site theme, not the OS one. */
function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[resolvedTheme]);
  }, [resolvedTheme]);

  return null;
}

export { ThemeColorMeta };
