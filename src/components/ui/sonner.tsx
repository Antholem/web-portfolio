'use client';

import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

import { useThemeStore } from '@/lib/theme-store';
import { cn } from '@/lib/utils';

type ToasterProps = ComponentProps<typeof SonnerToaster> & {
  initialTheme?: 'light' | 'dark';
};

const invertTheme = (value: 'light' | 'dark') => (value === 'dark' ? 'light' : 'dark');

export function Toaster({ initialTheme, className, ...props }: ToasterProps) {
  const theme = useThemeStore((state) => state.theme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() =>
    initialTheme ? invertTheme(initialTheme) : 'dark',
  );

  useEffect(() => {
    if (!initialTheme) {
      const isDark = document.documentElement.classList.contains('dark');
      setResolvedTheme(isDark ? 'light' : 'dark');
    }
  }, [initialTheme]);

  useEffect(() => {
    setResolvedTheme(invertTheme(theme));
  }, [theme]);

  return (
    <SonnerToaster
      theme={resolvedTheme}
      position="bottom-left"
      className={cn('toaster group', `toaster--${resolvedTheme}`, className)}
      toastOptions={{
        className: 'group toast',
        descriptionClassName: 'toast-description',
      }}
      {...props}
    />
  );
}
