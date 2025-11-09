import { Briefcase, Compass, Layers, Sparkles } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "System Architecture",
    description:
      "Designing scalable and maintainable software structures focused on performance, reliability, and clean design patterns.",
    icon: Briefcase,
  },
  {
    title: "Platform Scaling",
    description:
      "Improving system performance and reliability through refactoring, API optimization, and efficient deployment pipelines.",
    icon: Layers,
  },
  {
    title: "Experience Design",
    description:
      "Building accessible and data-informed interfaces that align usability with measurable product goals.",
    icon: Compass,
  },
  {
    title: "AI Integration",
    description:
      "Embedding AI-driven features and automation into workflows to enhance development efficiency and decision accuracy.",
    icon: Sparkles,
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            About
          </p>
          <h2
            id="about-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Building scalable and reliable systems
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Focused on architecture, performance, and AI-driven development.
          </p>
        </div>
        <div className="mt-16 grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              I&apos;m a software engineer based in Clark, Pampanga, Philippines,
              focused on building scalable, maintainable, and human-centered
              systems. I translate complex business requirements into reliable
              software through systems thinking, accessibility-driven design,
              and AI-assisted development workflows.
            </p>
            <p>
              I&apos;ve led distributed teams, refactored legacy architectures,
              and delivered data-informed platforms across finance, commerce, and
              SaaS. My work emphasizes maintainability, observability, and
              effective collaboration with product, design, and engineering
              stakeholders.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <Card key={item.title} className="h-full">
                  <CardHeader className="space-y-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="space-y-2">
                      <CardTitle className="text-base text-foreground">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
