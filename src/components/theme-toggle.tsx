"use client"

import { FiSun, FiMoon } from "react-icons/fi"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/lib/theme-store"

export function ThemeToggle() {
  const { theme, toggle } = useThemeStore()
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggle}
    >
      {theme === "dark" ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </Button>
  )
}
