import type { Metadata } from "next";

import { siteConfig } from "@/constants/site";

/**
 * Open Graph fields every route shares. Next replaces (does not merge) nested
 * metadata objects, so a route that sets `openGraph` must spread these in.
 */
export const baseOpenGraph = {
  type: "website",
  locale: "en_US",
  title: siteConfig.title,
  description: siteConfig.description,
  siteName: siteConfig.name,
} satisfies Metadata["openGraph"];
