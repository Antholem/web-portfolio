import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Research-first discovery",
    description:
      "I facilitate workshops and user interviews to surface the problem behind the brief, then translate the findings into actionable technical plans.",
  },
  {
    title: "Systems over single features",
    description:
      "My focus is on building foundations—design systems, shared libraries, and automation scripts—that help teams ship faster without sacrificing quality.",
  },
  {
    title: "Accessible-by-default",
    description:
      "From color contrast to keyboard flows, every interface starts with inclusive patterns so the experience feels intuitive for everyone.",
  },
  {
    title: "AI-augmented workflows",
    description:
      "I experiment with AI copilots to prototype ideas, audit code, and document decisions, keeping delivery sharp even when timelines are tight.",
  },
] as const;

const behindTheScenes = [
  "I mentor early-career builders through weekly code reviews and design pairing sessions.",
  "I run internal demos that translate technical updates into product narratives stakeholders can rally behind.",
  "I document experiments and lessons learned so future projects start with context instead of guesswork.",
];

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden py-16 lg:py-24">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.12),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(56,189,248,0.08),_transparent_60%)]"
        aria-hidden
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:flex-row lg:gap-16 lg:px-8">
        <div className="max-w-xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Crafting resilient products through curiosity and care
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Every engagement begins with listening. I thrive on uncovering how people actually use digital products and turning those insights into reliable, maintainable solutions. My toolkit blends product strategy, front-end engineering, and thoughtful collaboration so teams can move from idea to impact with confidence.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            There’s more happening behind the scenes than this portfolio currently shows, so I documented the ongoing work and rituals that keep my practice evolving:
          </p>
          <ul className="space-y-3">
            {behindTheScenes.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-muted-foreground sm:text-base">
                <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid flex-1 gap-6 sm:grid-cols-2">
          {highlights.map((highlight) => (
            <Card key={highlight.title} className="bg-card/80 backdrop-blur">
              <CardHeader className="space-y-2">
                <CardTitle className="text-lg font-semibold text-foreground">
                  {highlight.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {highlight.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
