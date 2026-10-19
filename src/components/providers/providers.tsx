"use client";

import * as React from "react";
import { LucideProvider } from "lucide-react";
import { ThemeProvider } from "next-themes";

import { DEFAULT_THEME } from "@/constants/theme";

import { ThemeColorMeta } from "./theme-color-meta";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={DEFAULT_THEME} enableSystem>
      <ThemeColorMeta />
      <LucideProvider strokeWidth={1.75}>{children}</LucideProvider>
    </ThemeProvider>
  );
}

export { Providers };
