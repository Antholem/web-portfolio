import type { LucideIcon } from "lucide-react";

/** Text where `**phrase**` is rendered in the foreground colour. */
export type HighlightedText = string;

export type SectionMeta = {
  id: string;
  index: string;
  navLabel: string;
  eyebrow: string;
};

export type FocusArea = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type ExperienceItem = {
  period: string;
  role: string;
  organization: string;
  details: string[];
  summary: string;
  tags: string[];
};

export type StackGroup = {
  title: string;
  icon: LucideIcon;
  tools: string[];
};

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
};

export type ProjectCategory = "web" | "ai" | "oss";

export type ProjectFilter = {
  value: ProjectCategory | "all";
  label: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectPreviewKey = "ledgerline" | "merchly" | "relay" | "forge";

export type Project = {
  slug: ProjectPreviewKey;
  name: string;
  year: string;
  category: ProjectCategory;
  /** Short label shown next to the year, e.g. "Web app". */
  kind: string;
  summary: string;
  tags: string[];
  links: ProjectLink[];
};

export type FeaturedProject = Omit<Project, "links"> & {
  role: string;
  tagline: string;
  highlights: string[];
  links: {
    caseStudy: string;
    demo: string;
    source: string;
  };
};

export type ContactTopic = {
  value: string;
  label: string;
};
