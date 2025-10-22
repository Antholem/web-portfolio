'use client';

import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

import { useThemeStore } from '@/lib/theme-store';
import { cn } from '@/lib/utils';

type ToasterProps = ComponentProps<typeof SonnerToaster> & {
  initialTheme?: 'light' | 'dark';
};

const invertTheme = (value: 'light' | 'dark') => (value === 'dark' ? 'light' : 'dark');

export function Toaster({ initialTheme, className, ...props }: ToasterProps) {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = useMemo<'light' | 'dark'>(() => {
    if (mounted) {
      return theme;
    }

    if (initialTheme) {
      return initialTheme;
    }

    return 'light';
  }, [initialTheme, mounted, theme]);

  const resolvedTheme = useMemo<'light' | 'dark'>(() => invertTheme(activeTheme), [activeTheme]);

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
