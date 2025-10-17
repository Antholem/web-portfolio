export default function AboutSection() {
  return (
    <section id="about" className="bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
              About
            </p>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                A systems-minded builder focused on resilient, human-centered products
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Over the past decade, I&apos;ve helped cross-functional teams bring ideas to life—from early experiments to
                production platforms serving global audiences. My approach blends product strategy, interaction design, and
                modern engineering practices to ship work that feels polished, performant, and purposeful.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Whether I&apos;m untangling legacy systems, defining design languages, or prototyping AI-assisted workflows, I
                thrive in the space between vision and execution. I champion inclusive experiences, measurable outcomes, and
                healthy collaboration that keeps teams shipping with confidence.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-background/80 p-6 shadow-lg shadow-primary/5 backdrop-blur">
              <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                Core strengths
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>Translating complex requirements into accessible, elegant digital systems.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>Designing component-driven architectures that scale with product maturity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>Championing reliable delivery pipelines and observability practices.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-background/80 p-6 shadow-lg shadow-primary/5 backdrop-blur">
              <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                Beyond the code
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>Facilitating workshops that align stakeholders around purposeful outcomes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>Mentoring engineers and designers to grow balanced, multidisciplinary teams.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>Experimenting with AI tooling to accelerate discovery and iteration.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
