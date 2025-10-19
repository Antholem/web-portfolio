import type { LucideIcon } from "lucide-react";
import { Brain, LayoutDashboard, Server } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services: {
  title: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
}[] = [
  {
    title: "Design Systems & Experience Design",
    description:
      "Modular, accessible interface systems that scale across platforms while preserving craft, clarity, and consistency.",
    highlights: [
      "Component libraries & documentation",
      "Responsive UX patterns & prototyping",
      "Accessibility-first interface audits",
    ],
    icon: LayoutDashboard,
  },
  {
    title: "Full-stack Web Engineering",
    description:
      "Robust front-end and backend solutions that balance developer velocity with resilient architecture and observability.",
    highlights: [
      "Next.js and React application development",
      "API design, integrations, and automation",
      "Performance tuning & reliability engineering",
    ],
    icon: Server,
  },
  {
    title: "AI-assisted Product Enablement",
    description:
      "Integrating intelligent tooling, workflows, and copilots that accelerate decision-making and augment human creativity.",
    highlights: [
      "Workflow automation & AI copilots",
      "Knowledge base and content generation",
      "Ethical AI implementation guidance",
    ],
    icon: Brain,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Services
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Partnerships tailored to every stage of product growth
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            From validating ideas to scaling platforms, I bring a multidisciplinary toolkit to plan, build, and evolve digital experiences that resonate.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="flex h-full flex-col">
              <CardHeader className="space-y-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <service.icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="space-y-2">
                  <CardTitle className="text-lg text-foreground">{service.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <ul className="space-y-3 text-left">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                      <span>{highlight}</span>
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
