import { siteConfig } from "@/constants/site";
import { experience, stack } from "@/lib/data";
import { SITE_URL } from "@/lib/site-url";

const isRealUrl = (href: string) => /^https?:\/\//.test(href);

/** schema.org Person + WebSite graph for the home page (search engines, AI crawlers). */
export function buildStructuredData(origin: URL = SITE_URL) {
  const home = origin.href;
  const current = experience.items[0];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${home}#person`,
        name: siteConfig.name,
        alternateName: siteConfig.handle,
        jobTitle: siteConfig.role,
        description: siteConfig.description,
        url: home,
        image: new URL("/images/portrait-avatar.png", origin).href,
        email: `mailto:${siteConfig.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Clark, Pampanga",
          addressCountry: "PH",
        },
        ...(current && {
          worksFor: { "@type": "Organization", name: current.organization },
        }),
        knowsAbout: [...new Set(stack.groups.flatMap((g) => g.tools))],
        // Placeholders ("#") are not identities; list only real profiles.
        sameAs: [siteConfig.links.github, siteConfig.links.linkedin].filter(
          isRealUrl,
        ),
      },
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: siteConfig.name,
        inLanguage: "en",
        author: { "@id": `${home}#person` },
      },
    ] as const,
  };
}

/** JSON for an inline <script>: `<` is escaped so no string can close the tag. */
export const toJsonLd = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");
