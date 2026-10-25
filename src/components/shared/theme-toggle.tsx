"use client";

import type { MouseEvent } from "react";
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

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
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

    // Set before the transition starts so the reveal's first frame is already
    // anchored on the button (no flash of the unclipped new theme).
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const root = document.documentElement.style;
    root.setProperty("--reveal-x", `${x}px`);
    root.setProperty("--reveal-y", `${y}px`);
    root.setProperty("--reveal-r", `${radius}px`);

    // A second toggle mid-reveal supersedes this transition, whose `ready` then
    // rejects with an AbortError ("Transition was skipped"). That is expected;
    // unhandled, it surfaces as an uncaught page error.
    document.startViewTransition(apply).ready.catch(() => {});
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
