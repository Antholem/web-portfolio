import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const strengths = [
  {
    title: "Systems thinking",
    description:
      "I zoom out to understand the full product ecosystem so that every solution accounts for workflows, governance, and long-term maintainability.",
  },
  {
    title: "Collaborative delivery",
    description:
      "I thrive in pairing with designers, product leads, and fellow engineers to translate insights into production-ready experiences with momentum.",
  },
  {
    title: "Operational empathy",
    description:
      "I build with the teams who will support a platform in mind, establishing patterns, documentation, and automation that make shipping sustainable.",
  },
];

const explorations = [
  "Applying AI-assisted tooling responsibly across the product lifecycle",
  "Designing inclusive experiences that balance speed with accessibility",
  "Refining design-to-dev pipelines so teams can iterate with confidence",
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-background py-16 lg:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              A product-minded engineer shaping thoughtful digital systems
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              My craft sits at the intersection of resilient architecture and purposeful experience design. I partner with teams
              from the earliest discovery conversations through launch, ensuring that every interaction aligns with the wider
              business narrative while remaining practical for the people who maintain it.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Whether I&rsquo;m mapping information flows, establishing component libraries, or codifying delivery processes, I
              value clarity, empathy, and momentum. That means facilitating alignment, documenting what matters, and keeping a
              close feedback loop with users and collaborators.
            </p>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg text-primary">Portfolio in progress</CardTitle>
                <CardDescription className="text-sm text-primary/90">
                  This portfolio is still evolving&mdash;several case studies and experiments haven&rsquo;t been published here yet. If
                  you&rsquo;re curious about work that isn&rsquo;t showcased, I&rsquo;m happy to walk you through it.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="h-full border-white/10 bg-muted/10">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg text-foreground">How I show up</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  A glimpse into the principles that guide my collaborations and the areas I&rsquo;m currently expanding.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Principles</p>
                  <ul className="space-y-4">
                    {strengths.map((strength) => (
                      <li key={strength.title} className="space-y-2 rounded-xl border border-white/10 bg-background/60 p-4">
                        <p className="text-sm font-semibold text-foreground">{strength.title}</p>
                        <p className="text-sm leading-relaxed text-muted-foreground">{strength.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Currently exploring</p>
                  <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {explorations.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
