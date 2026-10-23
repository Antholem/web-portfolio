import {
  Box,
  Code,
  Cpu,
  Database,
  LayoutTemplate,
  Layers,
  PenTool,
  Server,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { CONTACT_LIMITS } from "@/lib/contact";

import type {
  ContactTopic,
  ExperienceItem,
  FeaturedProject,
  FocusArea,
  HighlightedText,
  Project,
  ProjectFilter,
  Service,
  StackGroup,
} from "@/types/content";

export const hero = {
  availability: "Open to new opportunities",
  nameLines: ["Sam Antholem", "Manalo."],
  tagline:
    "Software engineer building **scalable digital platforms** where robust architecture meets a **refined user experience**." satisfies HighlightedText,
  summary:
    "Systems thinking, accessibility standards and AI-enhanced workflows — from the first commit to production at scale.",
  portraitAlt: "Portrait of Sam Antholem Manalo in a dark suit and blue tie",
  portraitCaption: "SAM.A.MANALO",
};

export const techMarquee = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Supabase",
  "MongoDB",
  "Docker",
  "Vercel",
  "Tailwind CSS",
  "shadcn/ui",
  "Claude",
  "Gemini API",
];

export const about = {
  title: "Building scalable and reliable systems.",
  lead: "Focused on architecture, performance and AI-driven development.",
  paragraphs: [
    "I’ve led distributed teams, refactored legacy architectures and delivered data-informed platforms across **finance, commerce and SaaS**.",
    "My work centres on maintainability, observability and close collaboration — systems that stay easy to change long after launch, and interfaces people genuinely enjoy using.",
  ] satisfies HighlightedText[],
  focusAreas: [
    {
      title: "System Architecture",
      description:
        "Modular services and clear boundaries that stay maintainable as teams grow.",
      icon: Layers,
    },
    {
      title: "Platform Scaling",
      description:
        "Caching, queues and observability tuned for real production traffic.",
      icon: TrendingUp,
    },
    {
      title: "Experience Design",
      description:
        "Accessible, responsive interfaces built on consistent design systems.",
      icon: LayoutTemplate,
    },
    {
      title: "AI Integration",
      description:
        "Copilots and automation that fit existing workflows — responsibly.",
      icon: Cpu,
    },
  ] satisfies FocusArea[],
};

// TODO: set the start year and refine the summary from the résumé.
export const experience = {
  title: "Where I’ve shipped.",
  items: [
    {
      period: "[Year] — Present",
      role: "Software Engineer",
      organization: "Boomering",
      details: [],
      summary:
        "Build and maintain production web applications end to end — from the PostgreSQL data model to responsive, accessible Next.js interfaces.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
    },
  ] satisfies ExperienceItem[],
};

export const stack = {
  title: "End-to-end engineering for modern web apps.",
  lead: "The tools I reach for — chosen for reliability, developer experience and long-term maintainability.",
  groups: [
    {
      title: "Frontend",
      icon: Code,
      tools: [
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
        "Chakra UI",
        "Material UI",
      ],
    },
    {
      title: "Backend",
      icon: Server,
      tools: ["Node.js", "Express", "PHP", "Python", "Java"],
    },
    {
      title: "Data & Cloud",
      icon: Database,
      tools: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Firebase"],
    },
    {
      title: "DevOps",
      icon: Box,
      tools: ["Docker", "Vercel", "GitHub", "GitLab"],
    },
    {
      title: "Design",
      icon: PenTool,
      tools: ["Figma", "Claude Design", "Adobe XD"],
    },
    {
      title: "AI Integration",
      icon: Sparkles,
      tools: ["Claude", "Google Gemini", "Hugging Face"],
    },
  ] satisfies StackGroup[],
};

export const services = {
  title: "Technical solutions for modern product teams.",
  items: [
    {
      title: "Design Systems",
      description:
        "Component libraries and patterns that keep products consistent as they grow.",
      icon: LayoutTemplate,
      features: [
        "Component libraries",
        "Responsive, accessible UX patterns",
        "Interface audits & usability testing",
      ],
    },
    {
      title: "Full-Stack Development",
      description:
        "Production-ready web apps, from the data model to the deployed interface.",
      icon: Code,
      features: [
        "Next.js & React applications",
        "API design & third-party integrations",
        "Performance & observability",
      ],
    },
    {
      title: "AI Integration",
      description:
        "Practical AI features that save time without compromising trust.",
      icon: Sparkles,
      features: [
        "AI copilots & workflow automation",
        "Content generation & data processing",
        "Responsible AI adoption",
      ],
    },
  ] satisfies Service[],
};

// TODO: projects are mockup content — replace with real ones and real links.
export const work = {
  title: "Scalable products built with precision.",
  filters: [
    { value: "all", label: "All" },
    { value: "web", label: "Web apps" },
    { value: "ai", label: "AI" },
    { value: "oss", label: "Open source" },
  ] satisfies ProjectFilter[],
  featured: {
    slug: "ledgerline",
    name: "Ledgerline",
    year: "2026",
    category: "web",
    kind: "Web app",
    role: "Lead engineer",
    tagline: "Real-time finance operations dashboard",
    summary:
      "Unifies payouts, invoices and bank feeds into one event-sourced ledger, so finance teams reconcile accounts as transactions happen — not at month-end.",
    highlights: [
      "Event-sourced ledger with full audit trail",
      "Live updates over WebSockets",
      "Role-based access and SSO",
    ],
    tags: ["Next.js", "TypeScript", "tRPC", "PostgreSQL", "Redis"],
    links: {
      caseStudy: "#",
      demo: "#",
      source: "#",
    },
  } satisfies FeaturedProject,
  projects: [
    {
      slug: "merchly",
      name: "Merchly",
      year: "2025",
      category: "web",
      kind: "Web app",
      summary:
        "A headless storefront and admin with server-rendered product pages, Stripe checkout and real-time inventory sync.",
      tags: ["Next.js", "Stripe", "Supabase", "Tailwind"],
      links: [
        { label: "Case study", href: "#" },
        { label: "Live demo ↗", href: "#" },
      ],
    },
    {
      slug: "relay",
      name: "Relay",
      year: "2025",
      category: "ai",
      kind: "AI",
      summary:
        "A support copilot that drafts grounded replies from a team’s docs and past tickets, with citations agents can verify.",
      tags: ["Next.js", "Gemini API", "pgvector", "AI SDK"],
      links: [
        { label: "Case study", href: "#" },
        { label: "Live demo ↗", href: "#" },
      ],
    },
    {
      slug: "forge",
      name: "Forge UI",
      year: "2024",
      category: "oss",
      kind: "Open source",
      summary:
        "Accessible React primitives with design tokens, dark mode and documented patterns, built on Radix and Tailwind.",
      tags: ["React", "Radix UI", "Tailwind", "Storybook"],
      links: [
        { label: "Docs", href: "#" },
        { label: "GitHub ↗", href: "#" },
      ],
    },
  ] satisfies Project[],
};

export const contact = {
  title: "Let’s collaborate on your next project.",
  lead: "Have a product to build, a platform to scale or a team that needs another senior engineer? Send a note — I reply within two business days.",
  topics: [
    { value: "build", label: "Full-stack build" },
    { value: "design-system", label: "Design system" },
    { value: "ai", label: "AI integration" },
    { value: "consulting", label: "Consulting" },
  ] satisfies ContactTopic[],
  messageMaxLength: CONTACT_LIMITS.message,
  messagePlaceholder:
    "Tell me about the product, timeline and what success looks like…",
  success: {
    title: "Message sent",
    description:
      "Thanks for reaching out — I’ll get back to you within two business days.",
    reset: "Send another",
  },
  failure: {
    title: "Couldn’t send your message",
    description: "Check your connection and try again.",
  },
};

export const footer = {
  tagline:
    "Software engineer building scalable, accessible platforms — from architecture to interface.",
  wordmark: "antholem",
};
