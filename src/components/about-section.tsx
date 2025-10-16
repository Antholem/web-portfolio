const highlights = [
  {
    title: "Product-minded engineer",
    description:
      "I collaborate closely with product and design partners to translate real customer insights into pragmatic technical roadmaps.",
  },
  {
    title: "Systems thinker",
    description:
      "From design systems to cloud infrastructure, I look for sustainable patterns that keep teams shipping quickly without sacrificing quality.",
  },
  {
    title: "Inclusive builder",
    description:
      "Accessibility, documentation, and knowledge sharing are core to how I work so that every teammate and user can participate fully.",
  },
] as const;

const personalNotes = [
  "Former community radio host who still curates monthly playlists.",
  "Weekend mentor for early-career developers transitioning into product roles.",
  "Always down to chat about joyful developer tooling and emerging AI workflows.",
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="bg-muted/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
              About
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Helping teams ship thoughtful, resilient experiences
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Over the past six years I have partnered with start-ups and enterprise teams to deliver products across finance, health,
              and developer tooling. My sweet spot lives at the intersection of strategy and execution—translating ambiguous problem
              spaces into clear, measurable outcomes.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Whether I&apos;m building full-stack features, refining design systems, or shaping engineering processes, I focus on creating
              momentum. I believe the best products are built by inclusive, learning-oriented teams who measure success by the value
              delivered to people.
            </p>
            <div className="rounded-3xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-primary/5 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/70">
                In practice
              </p>
              <ul className="mt-4 space-y-4">
                {highlights.map((highlight) => (
                  <li key={highlight.title} className="space-y-1">
                    <h3 className="text-base font-semibold text-foreground sm:text-lg">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-muted-foreground sm:text-base">
                      {highlight.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary/20 via-background to-background/80 p-8 shadow-xl shadow-primary/10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">
                What teammates say
              </p>
              <blockquote className="mt-4 space-y-4 text-base italic text-muted-foreground sm:text-lg">
                <p>
                  “Sam is the rare engineer who can zoom into implementation details and just as quickly advocate for the customer. We ship
                  faster and with more confidence because of their calm, intentional leadership.”
                </p>
                <footer className="text-sm font-medium not-italic text-foreground sm:text-base">
                  — Product Design Lead, Fintech Platform
                </footer>
              </blockquote>
            </div>

            <div className="rounded-3xl border border-border/60 bg-background/80 p-8 shadow-lg shadow-primary/5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/70">
                Outside the codebase
              </p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground sm:text-base">
                {personalNotes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-primary/60" aria-hidden />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
