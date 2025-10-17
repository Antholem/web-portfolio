export default function AboutSection() {
  const highlights = [
    "Crafting user-first product strategies that connect technical execution with human impact.",
    "Building modular, maintainable systems that stay flexible as ideas scale and evolve.",
    "Facilitating discovery workshops and design critiques to keep teams aligned and inspired.",
  ];

  return (
    <section id="about" className="py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:px-8">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            About
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Product-minded engineering with a systems thinker's lens
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            I focus on shaping resilient digital experiences that balance craft, performance, and accessibility.
            Beyond shipping features, I enjoy translating complex requirements into intuitive journeys and fostering
            collaboration across product, design, and engineering.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            There's more work I'm proud of that isn't showcased here yet—from exploratory prototypes to
            long-running platform initiatives. If you're curious, I'd be happy to walk you through the ideas,
            tradeoffs, and lessons that shaped them.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-border bg-card/50 p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-foreground">How I like to collaborate</h3>
          <ul className="space-y-4">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span
                  className="mt-1 inline-flex size-2 flex-shrink-0 rounded-full bg-primary"
                  aria-hidden
                />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
