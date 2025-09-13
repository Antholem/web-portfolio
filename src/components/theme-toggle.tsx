"use client";

import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/lib/theme-store";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggle}
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </Button>
  );
}
