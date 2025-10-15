import { Briefcase, Compass, Rocket } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const services = [
  {
    title: "Product Strategy & Discovery",
    description:
      "Clarify the problem space, identify opportunities, and align stakeholders around a roadmap rooted in user and market insights.",
    highlights: [
      "Vision & roadmap workshops",
      "User journey mapping",
      "Experiment planning",
    ],
    icon: Compass,
  },
  {
    title: "Experience & Interface Design",
    description:
      "Shape intuitive, inclusive journeys that translate complex requirements into polished, accessible product experiences.",
    highlights: [
      "Design systems & component libraries",
      "Interactive prototyping",
      "Accessibility reviews",
    ],
    icon: Briefcase,
  },
  {
    title: "Full-stack Engineering",
    description:
      "Build performant applications with modern tooling, scalable architectures, and delivery pipelines ready for production.",
    highlights: [
      "API & integration development",
      "Responsive front-end engineering",
      "CI/CD automation",
    ],
    icon: Rocket,
  },
] as const;

export default function ServicesSection() {
  return (
    <section id="services" className="bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Services
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Partnering across the product lifecycle
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            From discovery to deployment, I collaborate with teams to uncover insight, design clarity, and ship software that creates measurable value.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ title, description, highlights, icon: Icon }) => (
            <Card key={title} className="flex h-full flex-col">
              <CardHeader className="space-y-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg text-foreground">{title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="mt-auto">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 inline-block size-1.5 rounded-full bg-primary" aria-hidden />
                      <span>{item}</span>
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
