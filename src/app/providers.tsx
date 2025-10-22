'use client';

import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { useThemeStore } from '@/lib/theme-store';

function ChakraColorModeSync() {
  const theme = useThemeStore((state) => state.theme);
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(theme);
  }, [setColorMode, theme]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider resetCSS={false}>
      <ChakraColorModeSync />
      {children}
    </ChakraProvider>
  );
}
