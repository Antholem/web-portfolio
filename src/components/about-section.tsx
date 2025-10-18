import Link from "next/link";

import {
  Briefcase,
  Clock3,
  Github,
  Globe2,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

const highlights = [
  {
    title: "Role",
    value: "Software Engineer",
    description:
      "I lead product-focused engineering engagements, guiding teams from discovery to launch with a balance of craft and delivery discipline.",
    icon: Briefcase,
  },
  {
    title: "Experience",
    value: "7+ years",
    description:
      "Built resilient platforms for SaaS, fintech, and enterprise clients across APAC and North America, from rapid MVPs to scaled systems.",
    icon: Clock3,
  },
  {
    title: "Strengths",
    value: "Systems thinking & DX",
    description:
      "I architect maintainable design systems, API ecosystems, and AI-assisted workflows that keep teams shipping with confidence.",
    icon: Sparkles,
  },
  {
    title: "Collaboration",
    value: "Product-led partnerships",
    description:
      "Working side by side with founders, product, and design leads to translate complex requirements into measurable outcomes.",
    icon: Globe2,
  },
] as const;

const quickFacts = [
  {
    label: "Location",
    value: "Clark, Pampanga, Philippines",
    icon: MapPin,
  },
  {
    label: "Primary focus",
    value: "Full-stack platforms, design systems, and AI-enabled enablement",
    icon: Sparkles,
  },
  {
    label: "Current availability",
    value: "Open to high-impact collaborations and fractional leadership engagements",
    icon: Briefcase,
  },
] as const;

const contactLinks = [
  {
    label: "Email",
    value: "antholemlemmanalo@gmail.com",
    href: "mailto:antholemlemmanalo@gmail.com",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/antholem",
    href: "https://www.linkedin.com/in/antholem",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    value: "github.com/antholem",
    href: "https://github.com/antholem",
    icon: Github,
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden border-y border-white/5 bg-background/80">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_55%),_radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.1),_transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-10">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Engineering resilient products with a human-centered lens
              </h2>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                I’m Sam Antholem Manalo, a software engineer who blends product strategy, systems thinking, and design sensibility to
                build platforms people trust. My work spans interface architecture, data-rich experiences, and automation that keeps
                teams focused on outcomes—not maintenance overhead.
              </p>
              <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Whether modernizing legacy stacks or shaping greenfield products, I partner closely with stakeholders to translate
                vision into high-performing solutions. Every engagement emphasizes accessibility, observability, and iterative delivery
                so the software we ship grows with the business.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {highlights.map((highlight) => {
                const Icon = highlight.icon;

                return (
                  <div
                    key={highlight.title}
                    className="group h-full rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-lg backdrop-blur transition hover:border-primary/40 hover:shadow-primary/20"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          {highlight.title}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-foreground">{highlight.value}</h3>
                        <p className="mt-3 text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="space-y-8 rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-2xl backdrop-blur">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Snapshot</p>
              <h3 className="text-2xl font-semibold text-foreground">Quick facts & availability</h3>
              <p className="text-sm text-muted-foreground">
                A concise overview for collaborators evaluating fit and engagement logistics.
              </p>
            </div>

            <dl className="space-y-6">
              {quickFacts.map((fact) => {
                const Icon = fact.icon;

                return (
                  <div key={fact.label} className="flex gap-4">
                    <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="space-y-1">
                      <dt className="text-sm font-semibold text-foreground">{fact.label}</dt>
                      <dd className="text-sm leading-relaxed text-muted-foreground">{fact.value}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>

            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Let’s connect</p>
              <ul className="space-y-3">
                {contactLinks.map((contact) => {
                  const Icon = contact.icon;
                  const external = contact.href.startsWith("http");

                  return (
                    <li key={contact.label}>
                      <Link
                        href={contact.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer noopener" : undefined}
                        className="group flex items-center justify-between gap-4 rounded-full border border-white/10 bg-background/60 px-5 py-3 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                      >
                        <span className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span>{contact.value}</span>
                        </span>
                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-primary/80 transition group-hover:tracking-[0.5em]">
                          Connect
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
