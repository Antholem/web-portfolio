import { Briefcase, Calendar, MapPin, Send } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const experienceHighlights = [
  {
    title: "Role",
    value: "Principal Software Engineer",
    description: "Leading end-to-end delivery across experience, platform, and automation initiatives.",
    icon: Briefcase,
  },
  {
    title: "Experience",
    value: "10+ years",
    description: "Partnered with startups and enterprises to design resilient, scalable digital platforms.",
    icon: Calendar,
  },
  {
    title: "Location",
    value: "Clark, Pampanga, Philippines",
    description: "Collaborating remotely with distributed product teams across APAC, EMEA, and North America.",
    icon: MapPin,
  },
] as const;

const contactChannels = [
  {
    label: "Email",
    value: "antholemlemmanalo@gmail.com",
    href: "mailto:antholemlemmanalo@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/antholem",
    href: "https://www.linkedin.com/in/antholem",
  },
  {
    label: "GitHub",
    value: "github.com/antholem",
    href: "https://github.com/antholem",
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="bg-muted/30 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:flex-row lg:gap-16 lg:px-8">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Building durable, human-centered products that scale with business ambition
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              I partner with founders, product leaders, and cross-functional teams to transform complex challenges into
              cohesive digital experiences. My approach blends systems thinking, inclusive design, and platform
              automation—ensuring every release balances craft with measurable outcomes.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              From shaping product strategy and roadmaps to mentoring engineering teams, I create pathways that accelerate
              delivery while maintaining technical integrity. The result: resilient platforms, empowered teams, and customers
              who feel seen.
            </p>
          </div>

          <Card className="border border-primary/20 bg-background/90 shadow-lg shadow-primary/10">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                <Send className="h-5 w-5 text-primary" aria-hidden />
                Let&rsquo;s connect
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Ready to collaborate on your next product milestone? Reach out and I&rsquo;ll respond within two business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                {contactChannels.map((channel) => (
                  <div key={channel.label} className="space-y-1">
                    <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      {channel.label}
                    </dt>
                    <dd>
                      <a
                        href={channel.href}
                        className="text-base font-medium text-foreground transition hover:text-primary"
                        target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={channel.href.startsWith("mailto:") ? undefined : "noreferrer noopener"}
                      >
                        {channel.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <Card className="h-full border border-border/60 bg-background/80 backdrop-blur">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl text-foreground">Core focus</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                A multidisciplinary practice spanning product strategy, front-end engineering, backend integrations, and AI
                enablement to ship solutions that endure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  Product-led discovery, experimentation, and roadmap definition
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  Design systems, accessibility, and performance-driven UX implementation
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  Scalable architectures, platform integrations, and CI/CD automation
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block size-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  AI-assisted workflows that augment decision-making and operational efficiency
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-background/80 backdrop-blur">
            <CardContent className="grid gap-6 p-6 sm:grid-cols-3">
              {experienceHighlights.map((highlight) => (
                <div key={highlight.title} className="space-y-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <highlight.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      {highlight.title}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{highlight.value}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
