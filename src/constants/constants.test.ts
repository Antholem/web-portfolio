// @vitest-environment node
import { describe, expect, it } from "vitest";

import { readFileSync } from "node:fs";

import { validateContactForm } from "@/lib/contact";

import { FOOTER_SECTION_LINKS, NAV_ITEMS, SECTIONS } from "./navigation";
import { siteConfig } from "./site";
import { DEFAULT_THEME, THEME_COLORS } from "./theme";

describe("SECTIONS", () => {
  const sections = Object.values(SECTIONS);

  it("has unique, URL-safe ids that match their keys", () => {
    for (const [key, section] of Object.entries(SECTIONS)) {
      expect(section.id).toBe(key);
      expect(section.id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
    expect(new Set(sections.map((s) => s.id)).size).toBe(sections.length);
  });

  it("numbers sections 01..n in page order", () => {
    expect(sections.map((s) => s.index)).toEqual(
      sections.map((_, i) => String(i + 1).padStart(2, "0")),
    );
  });

  it("has non-empty nav labels and eyebrows", () => {
    for (const section of sections) {
      expect(section.navLabel.trim()).not.toBe("");
      expect(section.eyebrow.trim()).not.toBe("");
    }
  });
});

describe("NAV_ITEMS", () => {
  it("links to every section, in order, by fragment", () => {
    expect(NAV_ITEMS).toEqual([
      { label: "About", index: "01", href: "#about" },
      { label: "Experience", index: "02", href: "#experience" },
      { label: "Stack", index: "03", href: "#stack" },
      { label: "Services", index: "04", href: "#services" },
      { label: "Work", index: "05", href: "#work" },
      { label: "Contact", index: "06", href: "#contact" },
    ]);
  });
});

describe("FOOTER_SECTION_LINKS", () => {
  it("links to About, Work and Contact", () => {
    expect(FOOTER_SECTION_LINKS).toEqual([
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
      { label: "Contact", href: "#contact" },
    ]);
  });

  it("only points at real section ids", () => {
    const ids = Object.values(SECTIONS).map((s) => `#${s.id}`);
    for (const link of FOOTER_SECTION_LINKS) expect(ids).toContain(link.href);
  });
});

describe("siteConfig", () => {
  it("has an email the contact form itself would accept", () => {
    expect(
      validateContactForm({
        name: "x",
        email: siteConfig.email,
        subject: "x",
        message: "x",
      }).email,
    ).toBeUndefined();
  });

  it("has a tel: href with the same digits as the displayed number", () => {
    expect(siteConfig.phone.href).toMatch(/^tel:\+\d+$/);
    expect(siteConfig.phone.href.replace(/\D/g, "")).toBe(
      siteConfig.phone.display.replace(/\D/g, ""),
    );
  });

  it("links to GitHub over https", () => {
    const url = new URL(siteConfig.links.github);
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe("github.com");
  });

  it("keeps the documented placeholders for LinkedIn and the résumé", () => {
    // Known TODO in site.ts: flip these assertions when real URLs land.
    expect(siteConfig.links.linkedin).toBe("#");
    expect(siteConfig.links.resume).toBe("#");
  });

  it("uses the person's name as the document title", () => {
    expect(siteConfig.title).toBe(siteConfig.name);
    expect(siteConfig.description.length).toBeGreaterThan(50);
    expect(siteConfig.description.length).toBeLessThanOrEqual(160);
  });
});

describe("theme constants", () => {
  const css = readFileSync(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  /** `--background` declared directly in the `selector { … }` block. */
  const background = (selector: string) =>
    css
      .split(`\n${selector} {`)[1]
      ?.split("}")[0]
      .match(/--background: (#[0-9a-f]{6});/)?.[1];

  it("mirror the page background tokens in globals.css", () => {
    expect(THEME_COLORS.light).toBe(background(":root"));
    expect(THEME_COLORS.dark).toBe(background(".dark"));
  });

  it("default to dark, matching the README", () => {
    expect(DEFAULT_THEME).toBe("dark");
    expect(THEME_COLORS[DEFAULT_THEME]).toBe("#0a0a0a");
  });
});
