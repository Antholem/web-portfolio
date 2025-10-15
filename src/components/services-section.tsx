import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Product Strategy & Discovery",
    description:
      "Align business goals with user needs through structured research, roadmapping, and measurable success criteria.",
    highlights: [
      "Stakeholder workshops",
      "User journey mapping",
      "Lean validation sprints",
    ],
  },
  {
    title: "Experience & Interface Design",
    description:
      "Design intuitive, inclusive interfaces backed by reusable component systems and purposeful visual direction.",
    highlights: [
      "Design systems & UI kits",
      "Interactive prototyping",
      "Accessibility reviews",
    ],
  },
  {
    title: "Full-Stack Engineering",
    description:
      "Ship performant applications with maintainable architectures, API integrations, and reliable deployment workflows.",
    highlights: [
      "Next.js & modern front-end",
      "API & data layer development",
      "CI/CD automation",
    ],
  },
  {
    title: "Lifecycle Partnership",
    description:
      "Support releases post-launch with analytics, experiments, and iteration to keep teams moving confidently.",
    highlights: [
      "Launch planning & QA",
      "Observability dashboards",
      "Growth experiments",
    ],
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
            Partnering end-to-end to move ideas into real impact
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            From first insight to post-launch iteration, I help teams design, build, and evolve digital products with clarity and
            measurable outcomes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.title} className="flex h-full flex-col">
              <CardHeader className="space-y-3">
                <CardTitle className="text-lg text-foreground">{service.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <ul className="flex flex-wrap gap-2">
                  {service.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {highlight}
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
