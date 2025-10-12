import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Frontend Engineering",
    description:
      "Interfaces crafted with modern frameworks, component systems, and design fidelity across devices.",
    skills: ["ReactJS", "NextJS", "Tailwind CSS", "Chakra UI", "Material UI", "Shadcn"],
  },
  {
    title: "Backend & APIs",
    description:
      "Resilient services and RESTful APIs tuned for scalability, observability, and developer experience.",
    skills: ["Backend", "NodeJS", "ExpressJS", "PHP", "Python", "Java"],
  },
  {
    title: "Data Platforms",
    description:
      "Operational and analytical data layers optimized for reliability, integrity, and performance.",
    skills: ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "Supabase"],
  },
  {
    title: "DevOps & Delivery",
    description:
      "Automated workflows that streamline shipping, monitoring, and iteration across environments.",
    skills: ["Docker", "Vercel"],
  },
  {
    title: "Product Design",
    description:
      "Human-centered design systems aligning user journeys with brand identity and accessibility.",
    skills: ["Figma", "Adobe XD"],
  },
  {
    title: "Collaboration & AI",
    description:
      "Versioned collaboration and emerging AI tooling to accelerate experimentation and insight.",
    skills: ["GitHub", "GitLab", "Hugging Face", "Google Gemini"],
  },
] as const;

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Core Expertise
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skills that power resilient digital products
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A multidisciplinary toolkit spanning product discovery through deployment, enabling cohesive experiences and
            performant systems.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {skillCategories.map((category) => (
            <Card key={category.title} className="h-full border-border/60">
              <CardHeader className="space-y-3">
                <CardTitle className="text-lg text-foreground">{category.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-background px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground shadow-sm"
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
