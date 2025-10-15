import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const focusAreas = [
  {
    title: "Product Strategy",
    description:
      "Guiding discovery and roadmapping sessions that align stakeholder goals with measurable product outcomes.",
  },
  {
    title: "Design Systems",
    description:
      "Building accessible, scalable component libraries that empower teams to ship cohesive experiences quickly.",
  },
  {
    title: "End-to-end Delivery",
    description:
      "Pairing rapid prototyping with reliable engineering practices to deliver resilient software to production.",
  },
  {
    title: "Mentorship & Enablement",
    description:
      "Coaching cross-functional teams and establishing rituals that encourage collaboration, learning, and ownership.",
  },
] as const;

const stats = [
  { label: "Years crafting digital products", value: "8+" },
  { label: "Ship-ready launches", value: "35" },
  { label: "Workshops facilitated", value: "20" },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="bg-background py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="order-2 space-y-8 lg:order-1">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
                About
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Design-minded engineer shaping high-impact product experiences
              </h2>
              <p className="text-base text-muted-foreground">
                I partner with founders, product leaders, and design teams to translate complex ideas into purposeful, scalable
                digital products. My approach balances experimentation with rigor—merging human-centered research, system
                thinking, and reliable engineering foundations.
              </p>
              <p className="text-base text-muted-foreground">
                Whether creating a net-new platform or refining mature ecosystems, I focus on clarity, craft, and collaboration
                to deliver experiences that feel effortless and drive measurable value.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {focusAreas.map((area) => (
                <Card key={area.title} className="h-full border-none bg-muted/40">
                  <CardHeader className="space-y-2 pb-2">
                    <CardTitle className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">
                      {area.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {area.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <a href="/resume.pdf" download>
                  Download resume
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#contact">Schedule a call</a>
              </Button>
              <p className="text-sm text-muted-foreground">
                Currently partnering with teams shaping next-gen product experiences.
              </p>
            </div>
          </div>

          <Card className="order-1 overflow-hidden rounded-3xl border-none bg-muted/20 shadow-lg lg:order-2">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Designer collaborating with a teammate at a laptop."
                fill
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 90vw"
                className="object-cover"
                priority={false}
              />
            </div>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl bg-background/70 p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                I champion inclusive collaboration, ensuring every launch is supported by robust documentation, thoughtful
                handoffs, and a roadmap for continuous improvement.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
