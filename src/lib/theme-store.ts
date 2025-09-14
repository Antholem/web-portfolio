'use client'

import { create } from 'zustand'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('theme') as Theme | null
    if (stored) {
      document.documentElement.classList.toggle('dark', stored === 'dark')
      return stored
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', prefersDark)
    return prefersDark ? 'dark' : 'light'
  }
  return 'light'
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    set({ theme })
    window.localStorage.setItem('theme', theme)
    document.cookie = `theme=${theme};path=/;max-age=${60 * 60 * 24 * 365}`
  },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark', next === 'dark')
    set({ theme: next })
    window.localStorage.setItem('theme', next)
    document.cookie = `theme=${next};path=/;max-age=${60 * 60 * 24 * 365}`
  },
}))
