"use client";

import { useThemeStore } from "@/lib/theme-store";
import { Button } from "@/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
      </Button>
    );
}
