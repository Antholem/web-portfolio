import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Frontend Engineering",
    description:
      "Interfaces built with modern frameworks, component systems, and accessible styling.",
    skills: ["ReactJS", "NextJS", "Tailwind CSS", "Chakra UI", "Material UI", "Shadcn"],
  },
  {
    title: "Backend & APIs",
    description:
      "Services delivered with scalable runtimes, REST patterns, and secure architecture.",
    skills: ["Backend", "NodeJS", "ExpressJS", "PHP", "Python", "Java"],
  },
  {
    title: "Data & Platforms",
    description:
      "Data stacks spanning SQL, NoSQL, and serverless tooling for product insights.",
    skills: ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "Supabase"],
  },
  {
    title: "DevOps & Delivery",
    description:
      "Pipelines powered by containers, cloud hosting, and collaborative version control.",
    skills: ["Docker", "Vercel", "GitHub", "GitLab"],
  },
  {
    title: "Product & AI Tooling",
    description:
      "Design and AI platforms that accelerate exploration, prototyping, and content.",
    skills: ["Figma", "Adobe XD", "Hugging Face", "Google Gemini"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">Key Skills</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Full-stack capabilities at a glance
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A focused toolkit across design, engineering, and delivery to ship reliable, user-centered products.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <Card key={category.title} className="flex h-full flex-col">
              <CardHeader className="space-y-3">
                <CardTitle className="text-lg text-foreground">{category.title}</CardTitle>
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
