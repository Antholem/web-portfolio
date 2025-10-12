import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Frontend Engineering",
    description:
      "Crafting responsive interfaces with accessible, component-driven architectures tailored for modern product teams.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Backend Foundations",
    description:
      "Designing resilient APIs and data flows that balance performance, security, and maintainability at scale.",
    skills: ["Node.js", "Express", "PostgreSQL", "GraphQL", "REST"],
  },
  {
    title: "Product Enablement",
    description:
      "Equipping teams with automation, observability, and collaboration tools that accelerate delivery and feedback cycles.",
    skills: ["Jest", "Cypress", "Storybook", "GitHub Actions", "Vercel"],
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
            Skills that move products from idea to impact
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            From prototyping to production hardening, these proficiencies keep teams shipping delightful, dependable experiences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <Card key={category.title} className="h-full">
              <CardHeader className="space-y-3">
                <CardTitle className="text-lg text-foreground">{category.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
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
