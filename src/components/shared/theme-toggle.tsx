"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === "dark";

  const label = !mounted
    ? "Toggle theme"
    : isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

  function toggleTheme() {
    // next-themes writes the class in an effect; flushSync commits it (and the
    // effect) before the view transition captures the "new" snapshot.
    const apply = () => flushSync(() => setTheme(isDark ? "light" : "dark"));

    if (
      typeof document.startViewTransition !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
      return;
    }
    document.startViewTransition(apply);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={toggleTheme}
    >
      {/* Swapped by the `.dark` class so the server-rendered icon is already correct. */}
      <Sun className="hidden dark:block" aria-hidden />
      <Moon className="dark:hidden" aria-hidden />
    </Button>
  );
}

export { ThemeToggle };
