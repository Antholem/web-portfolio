'use client';

import { useColorMode } from '@chakra-ui/react';
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  const { colorMode } = useColorMode();
  const theme = colorMode === 'dark' ? 'light' : 'dark';

  return <SonnerToaster position="bottom-left" theme={theme} />;
}
