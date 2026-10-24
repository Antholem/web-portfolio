// @vitest-environment node
import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/constants/site";

import { resolveSiteUrl, SITE_URL } from "./site-url";
import { buildStructuredData, toJsonLd } from "./structured-data";

describe("resolveSiteUrl", () => {
  it("prefers an explicit NEXT_PUBLIC_SITE_URL", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: " https://sam.dev ",
        VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app",
      }).href,
    ).toBe("https://sam.dev/");
  });

  it("falls back to Vercel's production domain over https", () => {
    expect(
      resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "portfolio.vercel.app" })
        .href,
    ).toBe("https://portfolio.vercel.app/");
  });

  it("uses the local dev server when nothing is configured", () => {
    expect(resolveSiteUrl({}).href).toBe("http://localhost:3000/");
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "  " }).href).toBe(
      "http://localhost:3000/",
    );
  });
});

describe("sitemap and robots", () => {
  it("lists the home page at the site origin", () => {
    const [home, ...rest] = sitemap();
    expect(rest).toEqual([]);
    expect(home.url).toBe(SITE_URL.href);
    expect(home.lastModified).toBeInstanceOf(Date);
  });

  it("allows every crawler and points at the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: new URL("/sitemap.xml", SITE_URL).href,
    });
  });
});

describe("structured data", () => {
  const origin = new URL("https://sam.dev");
  const [person, website] = buildStructuredData(origin)["@graph"];

  it("describes the person with absolute URLs on the given origin", () => {
    expect(person).toMatchObject({
      "@type": "Person",
      "@id": "https://sam.dev/#person",
      name: siteConfig.name,
      jobTitle: siteConfig.role,
      url: "https://sam.dev/",
      image: "https://sam.dev/images/portrait-avatar.png",
      email: `mailto:${siteConfig.email}`,
      worksFor: { "@type": "Organization", name: "Boomering" },
    });
    expect(website).toMatchObject({
      "@type": "WebSite",
      author: { "@id": "https://sam.dev/#person" },
    });
  });

  it("lists only real profile URLs in sameAs (no '#' placeholders)", () => {
    expect(person.sameAs).toContain(siteConfig.links.github);
    for (const url of person.sameAs) expect(url).toMatch(/^https?:\/\//);
  });

  it("lists each skill once", () => {
    expect(new Set(person.knowsAbout).size).toBe(person.knowsAbout.length);
    expect(person.knowsAbout).toContain("Next.js");
  });

  it("serialises without a raw '<', so no value can close the script tag", () => {
    const json = toJsonLd({ evil: "</script><script>alert(1)</script>" });
    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual({
      evil: "</script><script>alert(1)</script>",
    });
  });
});
