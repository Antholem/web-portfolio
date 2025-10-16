import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
  {
    title: "Systems thinking",
    description:
      "Designing cohesive ecosystems that connect user journeys, interface patterns, and engineering constraints into a single narrative.",
    bullets: [
      "Codified design languages and governance",
      "Cross-platform experience architecture",
      "Measurable success metrics and KPIs",
    ],
  },
  {
    title: "Craft-driven delivery",
    description:
      "Pairing rapid iteration with a dedication to accessibility, performance, and maintainable code that scales with teams.",
    bullets: [
      "Accessible-first component libraries",
      "Progressive enhancement and resiliency",
      "Observability woven into release cycles",
    ],
  },
  {
    title: "Collaborative leadership",
    description:
      "Facilitating alignment between product, design, and engineering partners through clear rituals, shared vocabulary, and transparent roadmaps.",
    bullets: [
      "Workshop facilitation and storytelling",
      "Mentorship for emerging designers & devs",
      "Stakeholder partnership and facilitation",
    ],
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
              About
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Guiding digital products from idea to enduring impact
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              For the past decade, I have helped founders, venture studios, and enterprise leaders turn complex ideas into elegant,
              measurable experiences. My practice bridges strategy, design systems, and full-stack engineering—delivering products
              that feel crafted while remaining resilient under scale.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              I bring multidisciplinary teams together through intentional rituals, shared documentation, and inclusive decision-making.
              Whether leading discovery, shaping the roadmap, or shipping production code, I focus on clarity and momentum.
            </p>
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Years of product leadership
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-foreground">10+</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Cross-disciplinary teams supported
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-foreground">25+</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-6">
            <blockquote className="rounded-2xl border border-primary/20 bg-primary/10 p-6 text-sm leading-relaxed text-primary-foreground shadow-[0_10px_40px_-15px_rgba(14,165,233,0.45)]">
              <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                Philosophy
              </span>
              <p className="mt-3 text-base font-medium text-primary/95">
                Products should empower the people who build them as much as the people who use them. Sustainable systems, thoughtful
                documentation, and compassionate leadership unlock that multiplier effect.
              </p>
            </blockquote>

            <div className="grid gap-6 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <Card key={pillar.title} className="h-full border-border/60 bg-background/60 shadow-sm backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">{pillar.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {pillar.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
