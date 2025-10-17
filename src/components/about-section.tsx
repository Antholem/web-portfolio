const focusAreas = [
  {
    title: "Empathetic systems thinking",
    description:
      "I translate complex requirements into purposeful experiences by aligning business objectives with the realities of user journeys and technical constraints.",
  },
  {
    title: "Sustainable delivery rituals",
    description:
      "From discovery to release, I champion predictable workflows, shared documentation, and healthy collaboration that keeps teams shipping with confidence.",
  },
  {
    title: "AI-assisted craftsmanship",
    description:
      "I pair human intuition with automation and AI tooling to accelerate decision-making, improve quality, and unlock new creative possibilities for teams.",
  },
  {
    title: "Outcome-driven partnerships",
    description:
      "Every engagement is framed around measurable impact—clarity on success metrics, transparent communication, and iteration that compounds value over time.",
  },
] as const;

const milestones = [
  {
    period: "2016 — Present",
    title: "Product Engineering Leader",
    description:
      "Built resilient, design-led platforms across fintech, enterprise SaaS, and creative tooling with distributed teams across APAC and North America.",
  },
  {
    period: "2012 — 2016",
    title: "Design Systems & Front-end Specialist",
    description:
      "Scaled responsive design systems, accessibility guidelines, and component libraries that elevated brand consistency across multi-platform ecosystems.",
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-muted/30 py-16 lg:py-24">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_55%),_radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.1),_transparent_60%)]"
        aria-hidden
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Building thoughtful products starts with understanding the people behind them
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                I bring over a decade of end-to-end product experience—moving fluidly between discovery, UX strategy, and full-stack delivery. Whether I’m leading a cross-functional squad or pairing with founders, I focus on creating adaptable systems that balance craft, clarity, and measurable results.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                My approach blends facilitation, rigorous documentation, and technical depth. The outcome: teams that communicate better, ship faster, and build platforms that evolve gracefully alongside customer needs.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {focusAreas.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-background/80 p-6 shadow-lg shadow-slate-900/10 backdrop-blur"
                >
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/10 bg-background/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Origins</p>
              <h3 className="text-2xl font-semibold text-foreground">A career shaped by design-led engineering</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                From agency collaborations to product leadership roles, I’ve helped teams navigate growth by connecting systems thinking with pragmatic execution.
              </p>
            </div>
            <div className="space-y-6">
              {milestones.map((milestone) => (
                <div key={milestone.title} className="border-l border-primary/30 pl-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">{milestone.period}</p>
                  <h4 className="mt-2 text-lg font-semibold text-foreground">{milestone.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
