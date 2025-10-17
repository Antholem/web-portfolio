const highlights = [
  {
    title: "Design systems with intent",
    description:
      "I obsess over clarity and consistency, building component libraries that scale gracefully across platforms without losing character.",
  },
  {
    title: "Engineering for resilience",
    description:
      "Robust architecture, thoughtful automation, and a relentless focus on maintainability keep the products I ship dependable under pressure.",
  },
  {
    title: "Learning in public",
    description:
      "This portfolio is still growing. I'm actively curating new explorations—case studies, experiments, and process notes—to share soon.",
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-background">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(14,165,233,0.1),_transparent_60%)]"
        aria-hidden
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16 lg:py-24">
        <div className="space-y-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              A maker focused on meaningful, measurable impact
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              I'm Sam Antholem Manalo, a software engineer who thrives at the intersection of design systems, human-centered
              research, and reliable delivery. I architect digital experiences that balance polish with performance and keep
              teams shipping with confidence.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              There's more I'm excited to share—process deep dives, experiments, and collaborations that haven't made it into
              this portfolio just yet. Until then, consider this a living snapshot of the craft, curiosity, and care I bring to
              every engagement.
            </p>
          </div>
          <dl className="grid gap-6 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="rounded-2xl border border-white/5 bg-slate-950/60 p-6 shadow-lg shadow-primary/10 backdrop-blur"
              >
                <dt className="text-base font-semibold text-foreground">{highlight.title}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{highlight.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto flex max-w-md items-center justify-center lg:mx-0">
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/60 p-1 shadow-2xl backdrop-blur">
            <div className="rounded-[2.3rem] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 text-left">
              <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Still Evolving</p>
              <p className="mt-4 text-2xl font-semibold text-foreground">
                I'm currently curating more of my story.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Expect behind-the-scenes looks at problem framing, collaboration rituals, and the systems thinking that guide my
                builds. I'm excited to make this space a richer reflection of the way I work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
