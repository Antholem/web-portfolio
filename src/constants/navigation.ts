import type { SectionMeta } from "@/types/content";

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

/**
 * Site chrome (header, footer) also renders on other routes such as the 404,
 * so it links home sections by path: on "/" this is still an in-page jump.
 */
export const homeSection = (id: string) => `/#${id}`;

export const NAV_ITEMS = Object.values(SECTIONS).map((section) => ({
  label: section.navLabel,
  index: section.index,
  href: homeSection(section.id),
}));

export const FOOTER_SECTION_LINKS = [
  SECTIONS.about,
  SECTIONS.work,
  SECTIONS.contact,
].map((section) => ({
  label: section.navLabel,
  href: homeSection(section.id),
}));
