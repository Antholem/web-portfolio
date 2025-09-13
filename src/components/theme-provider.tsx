"use client";

import { ReactNode, useEffect } from "react";
import { useTheme } from "@/lib/theme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useTheme((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}
