"use client";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Providers } from "@/components/providers/providers";
import { ErrorState } from "@/components/shared/error-state";
import { siteConfig } from "@/constants/site";
import { errorPage } from "@/lib/data";
import { cn } from "@/lib/utils";

import "./globals.css";

/**
 * Replaces the root layout when the layout itself throws, so it brings its own
 * document, styles, fonts and theme (Providers runs next-themes, which applies
 * the visitor's stored theme like the normal layout does).
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(GeistSans.variable, GeistMono.variable)}
    >
      <body>
        <title>{`${errorPage.title} · ${siteConfig.name}`}</title>
        <Providers>
          <ErrorState error={error} retry={retry} />
        </Providers>
      </body>
    </html>
  );
}
