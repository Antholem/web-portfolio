const focusAreas = [
  {
    title: "Human-centered foundations",
    description:
      "Inclusive research, storytelling, and information architecture that ground every solution in authentic audience needs.",
  },
  {
    title: "Systems with staying power",
    description:
      "Design systems, component libraries, and delivery pipelines that scale gracefully as teams and products evolve.",
  },
  {
    title: "Insight-driven iteration",
    description:
      "Continuous discovery habits and instrumentation that translate data into confident, high-velocity improvements.",
  },
] as const;

const milestones = [
  {
    period: "2024 — Present",
    role: "Lead Software Engineer",
    company: "Freelance",
    summary:
      "Partner with product teams to ship performant, AI-assisted web applications and streamline delivery workflows.",
  },
  {
    period: "2021 — 2024",
    role: "Senior Frontend Engineer",
    company: "Beamlabs Studio",
    summary:
      "Led the build-out of modular design systems, accessibility initiatives, and cross-functional delivery practices.",
  },
  {
    period: "2017 — 2021",
    role: "Product Designer",
    company: "Independent & Agency",
    summary:
      "Crafted responsive experiences and growth experiments for SaaS products across fintech, education, and health tech.",
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Designing resilient products from discovery to delivery
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                I bridge strategy, design, and engineering to help teams launch experiences that feel effortless for people and
                maintainable for developers. By pairing systems thinking with thoughtful storytelling, I translate complex
                requirements into digital products that earn trust and deliver measurable results.
              </p>
            </div>

            <dl className="grid gap-6 sm:grid-cols-2">
              {focusAreas.map((focus) => (
                <div
                  key={focus.title}
                  className="rounded-2xl border border-border/60 bg-muted/30 p-6 shadow-sm transition hover:border-primary/50 hover:shadow-md"
                >
                  <dt className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{focus.title}</dt>
                  <dd className="mt-3 text-sm text-muted-foreground">{focus.description}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-slate-100 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Experience Snapshot</p>
              <p className="mt-4 text-lg leading-relaxed text-slate-200">
                Nearly a decade crafting and scaling digital products for startups and growth-stage teams across Asia Pacific and
                North America.
              </p>
            </div>
            <ol className="space-y-6">
              {milestones.map((milestone) => (
                <li key={milestone.period} className="relative rounded-2xl border border-border/60 bg-muted/20 p-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">{milestone.period}</span>
                  <h3 className="mt-3 text-lg font-semibold text-foreground">
                    {milestone.role} · {milestone.company}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{milestone.summary}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
