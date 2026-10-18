"use client";

import * as React from "react";
import { LucideProvider } from "lucide-react";
import { ThemeProvider } from "next-themes";

/** App-wide client providers: theme (dark by default) and the 1.75 icon stroke. */
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <LucideProvider strokeWidth={1.75}>{children}</LucideProvider>
    </ThemeProvider>
  );
}

export { Providers };
