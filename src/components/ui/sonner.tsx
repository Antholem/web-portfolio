'use client';

import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Toaster as SonnerToaster } from 'sonner';

import { useThemeStore } from '@/lib/theme-store';
import { cn } from '@/lib/utils';

type ToasterProps = ComponentProps<typeof SonnerToaster> & {
  initialTheme?: 'light' | 'dark';
};

export function Toaster({ initialTheme, className, ...props }: ToasterProps) {
  const theme = useThemeStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : initialTheme;
  const resolvedTheme: 'light' | 'dark' | 'system' = currentTheme
    ? currentTheme === 'dark'
      ? 'light'
      : 'dark'
    : 'system';

  return (
    <SonnerToaster
      theme={resolvedTheme}
      position="bottom-left"
      className={cn(
        'toaster group',
        resolvedTheme !== 'system' && `toaster--${resolvedTheme}`,
        className,
      )}
      toastOptions={{
        className: 'group toast',
        descriptionClassName: 'toast-description',
      }}
      {...props}
    />
  );
}
