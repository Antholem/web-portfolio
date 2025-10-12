import { Code2, Database, Palette, Sparkles } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const skillCategories = [
  {
    icon: Sparkles,
    label: "Strategy & Discovery",
    title: "Product Thinking",
    description:
      "Partnering with stakeholders to define success metrics, prioritize roadmaps, and translate business goals into actionable experiments.",
    skills: [
      "Roadmap planning",
      "Design workshops",
      "A/B testing",
      "Analytics",
    ],
  },
  {
    icon: Palette,
    label: "Design Systems",
    title: "Experience Design",
    description:
      "Crafting cohesive visual languages, prototyping interactions, and ensuring accessibility across responsive breakpoints and platforms.",
    skills: [
      "Figma",
      "Component libraries",
      "Motion design",
      "WCAG compliance",
    ],
  },
  {
    icon: Code2,
    label: "Frontend Engineering",
    title: "Modern Web Stacks",
    description:
      "Building performant interfaces with reusable architecture, strong typing, and production-grade tooling for teams of all sizes.",
    skills: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Testing",
    ],
  },
  {
    icon: Database,
    label: "Platform Integrations",
    title: "Scalable Delivery",
    description:
      "Connecting services, optimizing data flows, and automating deployments to keep user experiences resilient and maintainable.",
    skills: [
      "Node.js",
      "GraphQL",
      "CI/CD",
      "Cloud services",
    ],
  },
] as const;

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Core capabilities
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skills that move ideas from insight to impact
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A blend of strategy, design, and engineering expertise keeps projects moving smoothly from discovery to launch and beyond.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {skillCategories.map((category) => (
            <Card key={category.title} className="flex h-full flex-col">
              <CardHeader className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <category.icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {category.label}
                  </p>
                  <CardTitle className="text-xl text-foreground">{category.title}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
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
