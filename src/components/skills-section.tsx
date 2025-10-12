import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Frontend Engineering",
    description:
      "Crafting responsive, accessible interfaces with modern frameworks and a focus on performance.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Accessibility",
    ],
  },
  {
    title: "Design Systems & Tooling",
    description:
      "Building cohesive component libraries, scalable styling foundations, and efficient developer tooling.",
    skills: [
      "Design Systems",
      "Component Architecture",
      "Storybook",
      "Radix UI",
      "Vercel",
      "CI/CD",
    ],
  },
  {
    title: "Collaboration & Strategy",
    description:
      "Partnering with teams to deliver measurable outcomes through research-driven planning and iteration.",
    skills: [
      "Product Discovery",
      "Stakeholder Workshops",
      "Analytics Translation",
      "Agile Rituals",
      "Cross-functional Leadership",
      "Documentation",
    ],
  },
] as const;

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-muted/30 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Core capabilities
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skill sets that drive purposeful products
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A blend of technical fluency, systems thinking, and collaborative practices to deliver value across the product
            lifecycle.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
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
