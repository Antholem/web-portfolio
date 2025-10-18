import Link from "next/link";

import { ArrowUpRight, Briefcase, Compass, Mail, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const focusAreas = [
  {
    title: "Platform evolution",
    description:
      "Re-architecting design systems, APIs, and delivery workflows so teams can ship faster without sacrificing quality.",
    icon: Briefcase,
  },
  {
    title: "Experience strategy",
    description:
      "Facilitating discovery and translating customer insights into intuitive, inclusive, and measurable digital journeys.",
    icon: Compass,
  },
  {
    title: "AI-assisted enablement",
    description:
      "Blending automation and human judgment to prototype, iterate, and operate products with clarity and confidence.",
    icon: Sparkles,
  },
] as const;

const stats = [
  {
    label: "Years of experience",
    value: "7+",
    description: "Leading full-stack initiatives across SaaS, enterprise, and startup environments.",
  },
  {
    label: "Core role",
    value: "Software Engineer",
    description: "Partnering with founders, designers, and engineers to launch resilient web platforms.",
  },
] as const;

const contacts = [
  {
    label: "Email",
    value: "antholemlemmanalo@gmail.com",
    href: "mailto:antholemlemmanalo@gmail.com",
    icon: Mail,
  },
  {
    label: "Location",
    value: "Clark, Pampanga, Philippines",
    icon: MapPin,
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Building human-centered products with resilient engineering
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                I help product teams design, build, and scale digital experiences that balance clarity, accessibility, and
                long-term maintainability. My approach combines systems thinking with hands-on engineering to deliver solutions
                that are both intuitive for users and sustainable for teams.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Whether reimagining legacy platforms or launching new initiatives, I collaborate closely with stakeholders to
                align on measurable outcomes, de-risk delivery, and iterate quickly. The result: thoughtful products that make
                a tangible difference for businesses and the people they serve.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {focusAreas.map((area) => (
                <Card key={area.title} className="h-full border-border/60 bg-card/80">
                  <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                    <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <area.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <CardTitle className="text-base font-semibold text-foreground">{area.title}</CardTitle>
                      <CardDescription className="mt-2 text-sm leading-relaxed">{area.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-border/60 bg-card/80">
              <CardHeader className="space-y-4">
                <CardTitle className="text-lg font-semibold text-foreground">Snapshot</CardTitle>
                <div className="grid gap-4 sm:grid-cols-2">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-border/60 bg-background/50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{stat.label}</p>
                      <p className="mt-2 text-3xl font-semibold text-foreground">{stat.value}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>

            <Card className="border-border/60 bg-card/80">
              <CardHeader className="space-y-4">
                <CardTitle className="text-lg font-semibold text-foreground">Let&apos;s collaborate</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Reach out to discuss product strategy, platform modernization, or opportunities to craft something new.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <dl className="space-y-4">
                  {contacts.map((contact) => (
                    <div key={contact.label} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <contact.icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                          {contact.label}
                        </dt>
                        <dd className="mt-1 text-sm font-medium text-foreground">
                          {contact.href ? (
                            <Link href={contact.href} className="hover:text-primary">
                              {contact.value}
                            </Link>
                          ) : (
                            contact.value
                          )}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="sm" className="px-4">
                    <Link href="#projects">
                      View featured work
                      <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="px-4">
                    <Link href="https://www.linkedin.com/in/antholem" target="_blank" rel="noreferrer noopener">
                      Connect on LinkedIn
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
