"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

/** Ghost icon button: sun in dark mode, moon in light mode. */
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === "dark";

  const label = !mounted
    ? "Toggle theme"
    : isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Icons swap via the `.dark` class so the first paint is already correct. */}
      <Sun className="hidden dark:block" aria-hidden />
      <Moon className="dark:hidden" aria-hidden />
    </Button>
  );
}

export { ThemeToggle };
