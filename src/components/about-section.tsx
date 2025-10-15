import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, Globe, Lightbulb, Users2 } from "lucide-react";

const differentiators = [
  {
    title: "Strategy meets craft",
    description:
      "Translate business goals into clear product roadmaps, measurable outcomes, and experience principles that keep teams aligned.",
    support:
      "From the first discovery session to the final delivery, I connect qualitative insights with data-informed decisions.",
    icon: Lightbulb,
  },
  {
    title: "Collaborative leadership",
    description:
      "Create trust with cross-functional partners through transparent communication, co-creation workshops, and thoughtful documentation.",
    support:
      "I facilitate working sessions that empower teams, streamline feedback loops, and keep the entire organization engaged.",
    icon: Users2,
  },
  {
    title: "Global perspective",
    description:
      "Blend startup velocity with enterprise rigor, informed by engagements across fintech, SaaS, media, and emerging technology sectors.",
    support:
      "Each engagement applies learnings from distributed teams, complex stakeholder environments, and multi-market launches.",
    icon: Globe,
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="bg-muted/20 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
              About
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Guiding digital products from idea to enduring impact
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              I partner with founders, product leaders, and engineering teams to design and deliver inclusive, resilient web
              experiences. With a background that spans product strategy, front-end architecture, and experience design, I help
              teams ship with confidence and keep momentum long after launch.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              My approach blends hands-on craft with systems thinking—establishing scalable design languages, aligning technical
              decisions with business priorities, and mentoring teams to move faster without sacrificing quality.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/resume.pdf" download>
                  Download résumé
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#contact" className="inline-flex items-center gap-2">
                  Book a discovery call
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Designer collaborating with teammates around a laptop and sketches."
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                priority={false}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {differentiators.map((item) => (
            <Card key={item.title} className="h-full">
              <CardHeader className="space-y-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="space-y-2">
                  <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{item.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{item.support}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
