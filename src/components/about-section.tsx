import Link from "next/link";

import { Briefcase, Calendar, Mail, MapPin, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    label: "Role",
    value: "Principal Software Engineer",
    icon: Briefcase,
  },
  {
    label: "Experience",
    value: "9+ years shipping products",
    icon: Calendar,
  },
  {
    label: "Location",
    value: "Clark, Pampanga, Philippines",
    icon: MapPin,
  },
  {
    label: "Availability",
    value: "Open to strategic collaborations",
    icon: MessageSquare,
  },
] as const;

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-background/60 py-20 sm:py-24"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:items-start">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
              About
            </p>
            <div className="space-y-4">
              <h2
                id="about-heading"
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                Crafting thoughtful systems that scale with your vision
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                I help product teams translate complex business requirements into
                resilient, human-centered software. From discovery through
                delivery, I combine systems thinking, accessible design
                principles, and AI-accelerated workflows to orchestrate cohesive
                digital experiences that deliver measurable results.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Over the past decade, I&apos;ve led distributed engineering teams,
                modernized legacy platforms, and launched data-informed
                experiences across finance, commerce, and SaaS. My approach
                prioritizes maintainability, observability, and seamless
                collaboration with designers, product strategists, and business
                stakeholders.
              </p>
            </div>
            <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-muted/5 p-6 backdrop-blur">
              <dl className="grid gap-4 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-2xl border border-transparent bg-background/80 p-4 shadow-sm transition hover:border-primary/40 hover:shadow-lg"
                  >
                    <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <item.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                        {item.label}
                      </dt>
                      <dd className="text-sm font-medium text-foreground sm:text-base">
                        {item.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="flex flex-col gap-3 rounded-2xl bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                    Let&apos;s collaborate
                  </p>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Share your goals and I&apos;ll respond within two business days to explore the fit.
                  </p>
                </div>
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="mailto:antholemlemmanalo@gmail.com">
                    <Mail className="mr-2 h-5 w-5" aria-hidden />
                    Email Sam
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-8 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950/70 p-8 shadow-2xl backdrop-blur">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Guiding principles
              </p>
              <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li className="rounded-2xl border border-white/5 bg-background/80 p-4">
                  <span className="font-semibold text-foreground">Outcome-first partnerships:</span> I align technical strategy with business OKRs so every release moves the metrics that matter.
                </li>
                <li className="rounded-2xl border border-white/5 bg-background/80 p-4">
                  <span className="font-semibold text-foreground">Inclusive experience design:</span> Accessible, adaptive interfaces ensure products work beautifully for every customer segment.
                </li>
                <li className="rounded-2xl border border-white/5 bg-background/80 p-4">
                  <span className="font-semibold text-foreground">Operational excellence:</span> Automated quality gates, analytics, and observability keep platforms reliable long after launch.
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 text-sm leading-relaxed text-primary-foreground">
              <p className="font-semibold text-primary-foreground">
                Trusted collaborator for scaling startups and enterprise teams.
              </p>
              <p className="mt-2 text-primary-foreground/90">
                Whether you need to accelerate delivery, evolve product-market fit, or modernize mission-critical systems, I offer a steady partnership shaped by empathy, clarity, and accountability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
