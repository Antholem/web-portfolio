"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { useThemeStore } from "@/lib/theme-store"

export default function ThemeToggle({ initialTheme }: { initialTheme?: "light" | "dark" }) {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (initialTheme) {
      setTheme(initialTheme)
    }
    setMounted(true)
  }, [initialTheme, setTheme])

  const currentTheme = mounted ? theme : initialTheme || theme

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {currentTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

