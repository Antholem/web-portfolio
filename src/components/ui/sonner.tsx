'use client'

import { useEffect, useState } from 'react'
import { Toaster as SonnerToaster } from 'sonner'

import { useThemeStore } from '@/lib/theme-store'

export function Toaster() {
  const theme = useThemeStore((state) => state.theme)
  const invertedTheme = theme === 'dark' ? 'light' : 'dark'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SonnerToaster
      position="bottom-left"
      theme={mounted ? invertedTheme : undefined}
    />
  )
}

export { toast } from 'sonner'
