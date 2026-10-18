import type { SectionMeta } from "@/types/content";

/** Single source for section anchors, nav labels and "01 / About" eyebrows. */
export const SECTIONS = {
  about: { id: "about", index: "01", navLabel: "About", eyebrow: "About" },
  experience: {
    id: "experience",
    index: "02",
    navLabel: "Experience",
    eyebrow: "Experience",
  },
  stack: { id: "stack", index: "03", navLabel: "Stack", eyebrow: "Stack" },
  services: {
    id: "services",
    index: "04",
    navLabel: "Services",
    eyebrow: "Services",
  },
  work: { id: "work", index: "05", navLabel: "Work", eyebrow: "Selected work" },
  contact: {
    id: "contact",
    index: "06",
    navLabel: "Contact",
    eyebrow: "Contact",
  },
} as const satisfies Record<string, SectionMeta>;

export const NAV_ITEMS = Object.values(SECTIONS).map((section) => ({
  label: section.navLabel,
  index: section.index,
  href: `#${section.id}`,
}));

export const FOOTER_SECTION_LINKS = [
  SECTIONS.about,
  SECTIONS.work,
  SECTIONS.contact,
].map((section) => ({ label: section.navLabel, href: `#${section.id}` }));
