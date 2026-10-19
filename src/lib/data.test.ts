import { describe, expect, it } from "vitest";

import { PROJECT_PREVIEWS } from "@/components/sections/work/previews/project-previews";

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
// React keys, missing previews, empty filters) before they reach the page.

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
    const all = [work.featured, ...work.projects];

    it("has unique project slugs, each with a preview", () => {
      expect(unique(all.map((p) => p.slug))).toBe(true);
      for (const p of all)
        expect(PROJECT_PREVIEWS[p.slug]).toBeTypeOf("function");
    });

    it("starts with an 'all' filter and has unique filter values", () => {
      expect(work.filters[0].value).toBe("all");
      expect(unique(work.filters.map((f) => f.value))).toBe(true);
    });

    it("never offers a filter that would show an empty gallery", () => {
      for (const filter of work.filters.slice(1)) {
        expect(all.some((p) => p.category === filter.value)).toBe(true);
      }
    });

    it("has a filter for every project category", () => {
      const values = work.filters.map((f) => f.value as string);
      for (const p of all) expect(values).toContain(p.category);
    });

    it("has unique tags and link labels per project", () => {
      for (const p of all) expect(unique(p.tags)).toBe(true);
      for (const p of work.projects) {
        expect(unique(p.links.map((l) => l.label))).toBe(true);
      }
    });
  });

  describe("contact", () => {
    it("has unique topic values and labels", () => {
      expect(contact.topics.length).toBeGreaterThan(0);
      expect(unique(contact.topics.map((t) => t.value))).toBe(true);
      expect(unique(contact.topics.map((t) => t.label))).toBe(true);
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
