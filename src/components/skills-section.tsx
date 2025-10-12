import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Frontend foundations",
    description: "Crafting accessible interfaces with modern web standards and resilient layouts.",
    skills: ["HTML5", "CSS3", "Responsive Design", "Accessibility"],
  },
  {
    title: "Application frameworks",
    description: "Building interactive views and performant user journeys with component-driven systems.",
    skills: ["React", "Next.js", "Redux Toolkit", "Framer Motion"],
  },
  {
    title: "Tooling & quality",
    description: "Ensuring maintainable codebases through reliable tooling, testing, and automation.",
    skills: ["TypeScript", "Jest", "Playwright", "ESLint"],
  },
  {
    title: "Styling systems",
    description: "Designing cohesive visual languages with scalable design tokens and utilities.",
    skills: ["Tailwind CSS", "Styled Components", "Radix UI", "Design Systems"],
  },
  {
    title: "Backend & APIs",
    description: "Connecting experiences to robust services with modern API and data layers.",
    skills: ["Node.js", "REST", "GraphQL", "Prisma"],
  },
  {
    title: "Collaboration",
    description: "Shipping features efficiently within cross-functional teams and workflows.",
    skills: ["Agile Delivery", "Storybook", "Figma", "Git & GitHub"],
  },
] as const;

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">Core capabilities</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skills that bring ideas from concept to launch
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            From initial discovery to production-ready delivery, these are the tools and practices I rely on to build fast,
            inclusive digital experiences.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {skillCategories.map((category) => (
            <Card key={category.title} className="h-full border-border/60">
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
                      className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground"
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
