import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Frontend Engineering",
    description:
      "Modern interfaces engineered with component libraries, performant styling systems, and design systems at scale.",
    skills: ["ReactJS", "NextJS", "Tailwind CSS", "Chakra UI", "Material UI", "Shadcn"],
  },
  {
    title: "Backend & APIs",
    description:
      "Robust services crafted with scalable runtimes, RESTful patterns, and secure application architectures.",
    skills: ["Backend", "NodeJS", "ExpressJS", "PHP", "Python", "Java"],
  },
  {
    title: "Data & Platforms",
    description:
      "Resilient data layers spanning SQL, NoSQL, and serverless ecosystems for data-driven product decisions.",
    skills: ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "Supabase"],
  },
  {
    title: "DevOps & Delivery",
    description:
      "Streamlined deployment workflows with containerization, cloud platforms, and collaborative source control.",
    skills: ["Docker", "Vercel", "GitHub", "GitLab"],
  },
  {
    title: "Product & AI Tooling",
    description:
      "Human-centered design and emerging AI copilots that accelerate discovery, ideation, and experimentation.",
    skills: ["Figma", "Adobe XD", "Hugging Face", "Google Gemini"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">Core Capabilities</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Expertise across the product lifecycle
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A multidisciplinary toolkit that bridges user experience, engineering craft, and operational excellence to deliver
            resilient digital products.
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
