import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Frontend Engineering",
    description:
      "Frameworks and design systems used to craft responsive, accessible interfaces with consistent brand expression.",
    items: ["ReactJS", "NextJS", "Tailwind CSS", "Chakra UI", "Material UI", "shadcn/ui"],
  },
  {
    title: "Backend & APIs",
    description:
      "Server-side languages, frameworks, and architectural patterns for building secure, scalable application backbones.",
    items: ["Backend", "NodeJS", "ExpressJS", "PHP", "Python", "Java"],
  },
  {
    title: "Data & Storage",
    description:
      "Databases and realtime platforms leveraged to persist, query, and synchronize critical product data.",
    items: ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "Supabase"],
  },
  {
    title: "DevOps & Delivery",
    description:
      "Infrastructure and deployment tooling that keeps shipping pipelines reliable, observable, and repeatable.",
    items: ["Docker", "Vercel"],
  },
  {
    title: "Product Experience",
    description:
      "Collaboration tools that support user-centered discovery, prototyping, and cross-functional alignment.",
    items: ["Figma", "Adobe XD", "GitHub", "GitLab"],
  },
  {
    title: "AI & Emerging Tech",
    description:
      "Platforms and models applied to accelerate workflows, automate insights, and prototype intelligent features.",
    items: ["Hugging Face", "Google Gemini"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-muted/20 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Core capabilities
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skills that power end-to-end product delivery
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A multidisciplinary toolkit spanning interface engineering, backend systems, data platforms, and collaborative tooling to deliver resilient digital products.
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
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-secondary-foreground"
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
