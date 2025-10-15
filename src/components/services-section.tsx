import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const services = [
  {
    title: "Product Strategy & Discovery",
    description:
      "Clarify business goals, uncover user needs, and translate ideas into actionable roadmaps with clear milestones.",
    highlights: [
      "Stakeholder workshops",
      "User journey mapping",
      "Success metric definition",
    ],
  },
  {
    title: "Experience & Interface Design",
    description:
      "Design accessible, conversion-focused interfaces that balance brand expression with intuitive interaction patterns.",
    highlights: [
      "Design systems & component libraries",
      "Responsive prototyping",
      "Accessibility-first workflows",
    ],
  },
  {
    title: "Full-stack Engineering & Delivery",
    description:
      "Ship resilient products using modern frameworks, automated testing, and continuous deployment practices.",
    highlights: [
      "API & data architecture",
      "Performance optimization",
      "CI/CD pipeline automation",
    ],
  },
] as const;

export default function ServicesSection() {
  return (
    <section id="services" className="bg-muted/20 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">What I Offer</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Services to guide products from concept to launch
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Partner across strategy, design, and engineering to deliver cohesive experiences that move the needle for your
            organization.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="flex h-full flex-col">
              <CardHeader className="space-y-3">
                <CardTitle className="text-lg text-foreground">{service.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="leading-relaxed">
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
