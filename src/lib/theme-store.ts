"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const getSystemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

// Apply system theme immediately if no stored preference
const systemTheme = getSystemTheme()
document.documentElement.classList.toggle("dark", systemTheme === "dark")
document.cookie = `theme=${systemTheme};path=/;max-age=${60 * 60 * 24 * 365}`

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: systemTheme,
      setTheme: (theme) => {
        document.documentElement.classList.toggle("dark", theme === "dark")
        set({ theme })
        document.cookie = `theme=${theme};path=/;max-age=${60 * 60 * 24 * 365}`
      },
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light"
        document.documentElement.classList.toggle("dark", next === "dark")
        set({ theme: next })
        document.cookie = `theme=${next};path=/;max-age=${60 * 60 * 24 * 365}`
      },
    }),
    {
      name: "theme",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        const theme = state?.theme ?? systemTheme
        document.documentElement.classList.toggle("dark", theme === "dark")
        document.cookie = `theme=${theme};path=/;max-age=${60 * 60 * 24 * 365}`
      },
    }
  )
)
