"use client";

import { useThemeStore } from "@/lib/theme-store";
import { Button } from "@/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
    </Button>
  );
}
