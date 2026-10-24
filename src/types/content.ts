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

export type Project = {
  name: string;
  year: string;
  /** Short label shown next to the year, e.g. "AI". */
  kind: string;
  role: string;
  tagline: string;
  summary: string;
  highlights: string[];
  tags: string[];
  links: { live: string; source: string };
  image: { src: string; alt: string; width: number; height: number };
};
