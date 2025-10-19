import { Briefcase, Compass, Layers, Sparkles } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Principal software engineer leadership",
    description:
      "Guiding cross-functional teams and stewarding architecture decisions that balance clarity, velocity, and resilience.",
    icon: Briefcase,
  },
  {
    title: "Platform evolution",
    description:
      "Re-architecting design systems, APIs, and delivery workflows so teams can ship faster without sacrificing quality.",
    icon: Layers,
  },
  {
    title: "Experience strategy",
    description:
      "Translating customer insights into intuitive, inclusive, and measurable journeys across every product touchpoint.",
    icon: Compass,
  },
  {
    title: "AI-assisted enablement",
    description:
      "Blending automation and human judgment to prototype, iterate, and operate products with confidence and clarity.",
    icon: Sparkles,
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-20" aria-labelledby="about-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            About
          </p>
          <h2
            id="about-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Designing resilient systems for ambitious teams
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Principal engineer partnering with founders and product leaders to
            turn vision into measurable delivery.
          </p>
        </div>
        <div className="mt-16 grid gap-16 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:items-start">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              I&apos;m a principal software engineer based in Clark, Pampanga,
              Philippines who helps product teams translate complex requirements
              into human-centered software. From discovery through delivery, I
              combine systems thinking, accessible design principles, and
              AI-accelerated workflows to orchestrate cohesive digital
              experiences.
            </p>
            <p>
              Over the past nine years I&apos;ve led distributed engineering teams,
              modernized legacy platforms, and launched data-informed
              experiences across finance, commerce, and SaaS. My approach
              prioritizes maintainability, observability, and seamless
              collaboration with designers, product strategists, and business
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
                      <CardTitle className="text-base text-foreground">{item.title}</CardTitle>
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
