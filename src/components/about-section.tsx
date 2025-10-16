import Image from "next/image";

const milestones = [
  {
    year: "2024",
    title: "Independent Product Engineer",
    description:
      "Partnering with early-stage startups to shape their product vision, build technical foundations, and iterate with velocity.",
  },
  {
    year: "2022",
    title: "Lead Software Engineer",
    description:
      "Led cross-functional teams delivering design systems, observability upgrades, and AI-assisted workflows for global platforms.",
  },
  {
    year: "2019",
    title: "Human-centered Technologist",
    description:
      "Blended UX research with full-stack development to craft inclusive experiences for finance, education, and civic tech.",
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-muted/30 py-16 lg:py-20">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(56,189,248,0.12),_transparent_60%)]"
        aria-hidden
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Crafting resilient products that honor both people and systems
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            I’m Sam Antholem Manalo, a software engineer with a design background who believes that calm, intentional experiences
            are the outcome of teams who build with empathy. My work blends systems thinking, inclusive research, and thoughtful
            automation to ensure digital products stay adaptable as they scale.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            Over the past decade I’ve partnered with product leaders, researchers, and founders to deliver platforms that balance
            performance, accessibility, and expressive brand narratives. Whether I’m architecting design systems, coaching teams on
            modern web tooling, or prototyping AI copilots, my north star is the same: enable people to create with confidence.
          </p>

          <div className="grid gap-6 rounded-3xl border border-primary/10 bg-background/70 p-6 shadow-lg backdrop-blur">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Experience</dt>
                <dd className="mt-2 text-2xl font-bold text-foreground">10+ yrs</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Projects shipped</dt>
                <dd className="mt-2 text-2xl font-bold text-foreground">40+</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Disciplines</dt>
                <dd className="mt-2 text-2xl font-bold text-foreground">Design & Dev</dd>
              </div>
            </dl>
            <p className="text-sm text-muted-foreground">
              I love building bridges between disciplines—helping designers speak the language of systems and engineers advocate for
              inclusive, data-informed experiences.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur">
            <Image
              src="/window.svg"
              alt="Stylized interface window with gradients and geometric accents"
              width={640}
              height={760}
              className="h-auto w-full object-cover"
              priority={false}
            />
          </div>

          <div className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-lg backdrop-blur">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">Milestones</h3>
            <ul className="mt-4 space-y-5">
              {milestones.map((milestone) => (
                <li key={milestone.year} className="relative pl-6">
                  <span
                    className="absolute left-0 top-2 inline-flex size-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(56,189,248,0.15)]"
                    aria-hidden
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">{milestone.year}</p>
                    <p className="text-base font-semibold text-foreground">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
