import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Cloud,
  Cog,
  Palette,
  Server,
  Waypoints,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skillCategories: {
  title: string;
  description: string;
  skills: readonly string[];
  icon: LucideIcon;
}[] = [
  {
    title: "Front-end Engineering",
    description:
      "Crafting polished interfaces with performance-minded frameworks, component systems, and modern styling tooling.",
    skills: ["ReactJS", "NextJS", "Tailwind CSS", "Chakra UI", "Material UI", "Shadcn"],
    icon: Waypoints,
  },
  {
    title: "Backend & APIs",
    description:
      "Designing resilient services, APIs, and integrations that scale reliably across diverse runtime environments.",
    skills: ["Backend", "NodeJS", "ExpressJS", "PHP", "Python", "Java"],
    icon: Server,
  },
  {
    title: "Data & Cloud Platforms",
    description:
      "Implementing data models and real-time experiences backed by managed services and developer-friendly platforms.",
    skills: ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "Supabase"],
    icon: Cloud,
  },
  {
    title: "DevOps & Delivery",
    description:
      "Automating delivery workflows and observability to ship confidently from local development to production.",
    skills: ["Docker", "Vercel", "GitHub", "GitLab"],
    icon: Cog,
  },
  {
    title: "Design & Collaboration",
    description:
      "Translating ideas into intuitive journeys through iterative prototyping, feedback loops, and design systems.",
    skills: ["Figma", "Adobe XD"],
    icon: Palette,
  },
  {
    title: "AI & Emerging Tech",
    description:
      "Exploring intelligent tooling to accelerate product discovery, experimentation, and personalized experiences.",
    skills: ["Hugging Face", "Google Gemini"],
    icon: BrainCircuit,
  },
] as const;

export default function SkillsSection() {
  return (
    <section id="skills" className="py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">Core capabilities</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A full-stack toolkit for shipping production-ready products
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            From interface architecture to deployment pipelines, I bring a balanced skill set to deliver resilient, maintainable,
            and human-centered software solutions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {skillCategories.map((category) => (
            <Card key={category.title} className="flex h-full flex-col">
              <CardHeader className="space-y-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <category.icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="space-y-2">
                  <CardTitle className="text-lg text-foreground">{category.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{category.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <ul className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
