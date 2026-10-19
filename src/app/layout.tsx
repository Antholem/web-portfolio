import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { AnchorScrollSettler } from "@/components/layout/anchor-scroll-settler";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers/providers";
import { siteConfig } from "@/constants/site";
import { DEFAULT_THEME, THEME_COLORS } from "@/constants/theme";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

// One tag for the default theme; ThemeColorMeta retargets it to the active theme.
export const viewport: Viewport = {
  themeColor: THEME_COLORS[DEFAULT_THEME],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(GeistSans.variable, GeistMono.variable)}
    >
      <body>
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
          <AnchorScrollSettler />
        </Providers>
      </body>
    </html>
  );
}
