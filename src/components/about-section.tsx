const pillars = [
  {
    title: "Human-centered engineering",
    description:
      "Balancing product strategy with inclusive design principles to craft experiences that are intuitive, accessible, and genuinely helpful.",
  },
  {
    title: "Systems thinking mindset",
    description:
      "Connecting architecture, workflows, and tooling so every feature fits into a resilient ecosystem that can adapt to change.",
  },
  {
    title: "Collaborative delivery",
    description:
      "Working closely with founders, product leaders, and cross-functional teams to align direction, ship iteratively, and learn fast.",
  },
];

const stats = [
  { value: "7+", label: "Years shipping digital products" },
  { value: "25+", label: "End-to-end launches" },
  { value: "6", label: "Cross-functional teams supported" },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-muted/30 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Building thoughtful platforms with clarity, empathy, and reliability
          </h2>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground lg:mx-0">
            I partner with teams to translate complex ideas into usable software. My approach blends human-centered design, full-stack engineering, and a commitment to measurable outcomes so that every release advances both product vision and business goals.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-border bg-background p-6 text-left shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-foreground">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6 text-left shadow-inner">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">What drives my work</p>
              <p className="mt-3 text-sm text-muted-foreground">
                High-performing products come from pairing rigorous engineering with narrative clarity. I thrive when we can align teams around shared goals, set up sustainable processes, and deliver experiences people love using every day.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-left text-slate-50 shadow-2xl">
            <div
              className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_60%)]"
              aria-hidden
            />
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">In practice</p>
            <p className="mt-4 text-lg font-medium text-slate-100">
              Whether embedded with a product team or collaborating as a strategic partner, I help uncover the right problems, prototype solutions rapidly, and deliver maintainable systems that scale with your organization.
            </p>
            <dl className="mt-8 grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-[0.2em] text-primary/60">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-semibold text-slate-50">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
