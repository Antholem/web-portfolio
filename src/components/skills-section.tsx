import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  Cog,
  Database,
  PanelsTopLeft,
  ServerCog,
  Users2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const skillCategories: {
  title: string;
  description: string;
  skills: string[];
  icon: LucideIcon;
}[] = [
  {
    title: "Frontend",
    description:
      "Building responsive and maintainable interfaces with modern frameworks and design systems.",
    skills: ["ReactJS", "NextJS", "Tailwind CSS", "Chakra UI", "Material UI", "Shadcn"],
    icon: PanelsTopLeft,
  },
  {
    title: "Backend",
    description:
      "Developing secure and scalable APIs with clean architecture and consistent performance.",
    skills: ["NodeJS", "ExpressJS", "PHP", "Python", "Java"],
    icon: ServerCog,
  },
  {
    title: "Data & Cloud",
    description:
      "Managing databases and cloud services to support reliable, real-time applications.",
    skills: ["MongoDB", "MySQL", "PostgreSQL", "Firebase", "Supabase"],
    icon: Database,
  },
  {
    title: "DevOps",
    description:
      "Automating deployment, monitoring, and delivery pipelines for smooth production workflows.",
    skills: ["Docker", "Vercel", "GitHub", "GitLab"],
    icon: Cog,
  },
  {
    title: "Design",
    description:
      "Creating user flows and prototypes that connect usability with functional design systems.",
    skills: ["Figma", "Adobe XD"],
    icon: Users2,
  },
  {
    title: "AI Integration",
    description:
      "Embedding AI tools and APIs into products to improve automation, insights, and development speed.",
    skills: ["Hugging Face", "Google Gemini"],
    icon: BrainCircuit,
  },
] as const;

export default function SkillsSection() {
  return (
    <section id="skills" className="py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Skills
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            End-to-end engineering for modern web apps
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            From frontend to cloud, I focus on building reliable systems with clean architecture and efficient delivery.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {skillCategories.map((category) => (
            <Card key={category.title} className="flex h-full flex-col">
              <CardHeader className="space-y-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <category.icon className="h-5 w-5" aria-hidden />
                </span>
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
