import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Frontend Engineering",
    description:
      "Type-safe interfaces crafted with accessible components, design systems, and responsive interaction patterns.",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Radix UI"],
  },
  {
    title: "Backend & APIs",
    description:
      "Resilient services with efficient data workflows, secure integrations, and predictable contract-first APIs.",
    skills: ["Node.js", "tRPC", "REST", "GraphQL", "Prisma"],
  },
  {
    title: "DevOps & Tooling",
    description:
      "Automation pipelines and observability practices that keep delivery fast, dependable, and insight-driven.",
    skills: ["Vercel", "Docker", "GitHub Actions", "Playwright", "Storybook"],
  },
  {
    title: "Product Strategy",
    description:
      "Collaborative discovery, roadmap alignment, and measurement plans that connect user value to business outcomes.",
    skills: ["Roadmapping", "Experimentation", "Analytics", "Stakeholder Workshops", "UX Research"],
  },
] as const;

export default function SkillsSection() {
  return (
    <section id="skills" className="py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">Core capabilities</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skills that move products from concept to launch
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A balanced toolkit across design systems, platform architecture, and delivery rituals to keep cross-functional teams
            aligned and shipping.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skillCategories.map((category) => (
            <Card key={category.title} className="flex h-full flex-col">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl text-foreground">{category.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {category.description}
                </CardDescription>
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
