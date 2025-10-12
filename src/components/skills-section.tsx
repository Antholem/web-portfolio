import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skills = [
  {
    title: "Frontend Craft",
    description:
      "Interfaces engineered with clean architecture, delightful animations, and resilient accessibility foundations.",
    items: ["HTML5", "CSS3", "TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Systems & Tooling",
    description:
      "Modern tooling that keeps delivery fast, observable, and production ready across environments.",
    items: ["Node.js", "REST APIs", "GraphQL", "Vite", "Jest", "Playwright"],
  },
  {
    title: "Collaboration",
    description:
      "Processes that align cross-functional teams and keep product momentum moving forward.",
    items: ["Agile Coaching", "Design Systems", "UX Collaboration", "CI/CD", "Storybook", "Notion"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Core capabilities
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skills that deliver end-to-end product outcomes
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A blend of engineering depth and product collaboration to ship experiences users love and teams can maintain.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Card key={skill.title} className="border-border/60 bg-background shadow-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="text-xl text-foreground">{skill.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {skill.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {item}
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
