import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { AnchorScrollSettler } from "@/components/layout/anchor-scroll-settler";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Providers } from "@/components/providers/providers";
import { SeasonScript } from "@/components/seasonal/season-script";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/constants/site";
import { DEFAULT_THEME, THEME_COLORS } from "@/constants/theme";
import { baseOpenGraph } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site-url";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: siteConfig.title, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: SITE_URL.href }],
  creator: siteConfig.name,
  keywords: [
    siteConfig.name,
    siteConfig.handle,
    siteConfig.role,
    "Full-stack developer",
    "Next.js developer",
    "React",
    "TypeScript",
    "Philippines",
  ],
  openGraph: baseOpenGraph,
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
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
      // Lets Next keep our CSS smooth scrolling (it pauses it on route changes).
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(GeistSans.variable, GeistMono.variable)}
    >
      <head>
        <SeasonScript />
      </head>
      <body>
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
          <AnchorScrollSettler />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
