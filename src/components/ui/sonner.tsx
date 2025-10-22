'use client';

import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

import { useThemeStore } from '@/lib/theme-store';

type ToasterProps = ComponentProps<typeof SonnerToaster> & {
  initialTheme?: 'light' | 'dark';
};

export function Toaster({ initialTheme, ...props }: ToasterProps) {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : initialTheme;

  const resolvedTheme = useMemo((): 'light' | 'dark' | 'system' => {
    if (!currentTheme) {
      return 'system';
    }

    return currentTheme === 'dark' ? 'light' : 'dark';
  }, [currentTheme]);

  return (
    <SonnerToaster
      theme={resolvedTheme}
      position="bottom-left"
      className="toaster group"
      toastOptions={{
        className: 'group toast',
        descriptionClassName: 'toast-description',
      }}
      {...props}
    />
  );
}
