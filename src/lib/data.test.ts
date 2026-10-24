import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { CONTACT_LIMITS } from "./contact";

import {
  about,
  contact,
  experience,
  footer,
  hero,
  services,
  stack,
  techMarquee,
  work,
} from "./data";

// Content integrity: these catch edits that would break rendering (duplicate
// React keys, missing screenshots, broken links) before they reach the page.

const unique = (values: readonly string[]) =>
  new Set(values).size === values.length;

/** `**` markers must pair up or HighlightedText renders literal asterisks. */
const balancedHighlights = (text: string) =>
  (text.match(/\*\*/g) ?? []).length % 2 === 0;

describe("content data", () => {
  it("hero has two name lines and balanced highlight markers", () => {
    expect(hero.nameLines).toHaveLength(2);
    expect(balancedHighlights(hero.tagline)).toBe(true);
    expect(hero.portraitAlt.trim()).not.toBe("");
  });

  it("about paragraphs have balanced highlight markers and unique keys", () => {
    for (const p of about.paragraphs) expect(balancedHighlights(p)).toBe(true);
    expect(unique(about.paragraphs)).toBe(true);
    expect(unique(about.focusAreas.map((a) => a.title))).toBe(true);
  });

  it("experience entries have unique keys and unique tags", () => {
    expect(
      unique(experience.items.map((item) => `${item.role}-${item.period}`)),
    ).toBe(true);
    for (const item of experience.items) expect(unique(item.tags)).toBe(true);
  });

  it("stack groups and services have unique titles, tools and features", () => {
    expect(unique(stack.groups.map((g) => g.title))).toBe(true);
    for (const g of stack.groups) {
      expect(g.tools.length).toBeGreaterThan(0);
      expect(unique(g.tools)).toBe(true);
    }
    expect(unique(services.items.map((s) => s.title))).toBe(true);
    for (const s of services.items) expect(unique(s.features)).toBe(true);
  });

  it("tech marquee has no duplicates", () => {
    expect(techMarquee.length).toBeGreaterThan(0);
    expect(unique(techMarquee)).toBe(true);
  });

  describe("work", () => {
    const { project } = work;

    it("links to a real live site and source over https", () => {
      for (const href of [project.links.live, project.links.source]) {
        expect(new URL(href).protocol).toBe("https:");
      }
    });

    it("has a local screenshot with real dimensions and alt text", () => {
      expect(project.image.src).toMatch(/^\/images\/projects\/.+\.(webp|png)$/);
      expect(existsSync(join("public", project.image.src))).toBe(true);
      expect(project.image.width).toBeGreaterThan(0);
      expect(project.image.height).toBeGreaterThan(0);
      expect(project.image.alt.trim()).not.toBe("");
    });

    it("has unique tags and highlights", () => {
      expect(unique(project.tags)).toBe(true);
      expect(unique(project.highlights)).toBe(true);
    });
  });

  describe("contact", () => {
    it("has a subject placeholder that fits the subject limit", () => {
      expect(contact.subjectPlaceholder.length).toBeGreaterThan(0);
      expect(contact.subjectPlaceholder.length).toBeLessThanOrEqual(
        CONTACT_LIMITS.subject,
      );
    });

    it("has a positive message limit", () => {
      expect(Number.isInteger(contact.messageMaxLength)).toBe(true);
      expect(contact.messageMaxLength).toBeGreaterThan(0);
    });
  });

  it("footer has a tagline and wordmark", () => {
    expect(footer.tagline.trim()).not.toBe("");
    expect(footer.wordmark.trim()).not.toBe("");
  });
});
