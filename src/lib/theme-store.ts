'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const getSystemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme') as Theme | null
  return stored ?? getSystemTheme()
}

const initialTheme = getInitialTheme()
if (typeof window !== 'undefined') {
  document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  document.cookie = `theme=${initialTheme};path=/;max-age=${60 * 60 * 24 * 365}`
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: initialTheme,
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        set({ theme })
        document.cookie = `theme=${theme};path=/;max-age=${60 * 60 * 24 * 365}`
      },
      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', next === 'dark')
        set({ theme: next })
        document.cookie = `theme=${next};path=/;max-age=${60 * 60 * 24 * 365}`
      },
    }),
    { name: 'theme' }
  )
)
