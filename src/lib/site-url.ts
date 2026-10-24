/**
 * Canonical origin for metadata, the sitemap and structured data. An explicit
 * NEXT_PUBLIC_SITE_URL wins (set it once a custom domain is live); on Vercel
 * the production domain is provided automatically; locally it is the dev server.
 */
export function resolveSiteUrl(env: Record<string, string | undefined>) {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return new URL(explicit);
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

export const SITE_URL = resolveSiteUrl(process.env);
