import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const experienceHighlights = [
  {
    title: "Product-minded engineering",
    description:
      "Partnering closely with product and design teams to turn insights into shippable experiences that move metrics forward.",
  },
  {
    title: "Human-centered delivery",
    description:
      "Balancing velocity with craft by designing systems that remain maintainable, inclusive, and easy for teams to iterate on.",
  },
  {
    title: "Outcome-focused leadership",
    description:
      "Leading cross-functional initiatives end-to-end—from discovery and roadmap planning to implementation, launch, and growth.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-background py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Product strategist and engineer building purposeful digital experiences
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                I help organizations ship confident, human-centered products by pairing systems thinking with an eye for detail.
                Over the past decade I&apos;ve worked with startups and enterprise teams alike, crafting scalable design systems,
                resilient architectures, and collaborative workflows that empower teams to deliver their best work.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {experienceHighlights.map((highlight) => (
                <Card key={highlight.title} className="h-full bg-muted/40">
                  <CardContent className="space-y-2 p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-primary/80">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild className="min-w-[12rem]">
                <Link href="/resume.pdf" download>
                  Download résumé
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Prefer a quick overview? Let&apos;s connect to explore how I can support your next initiative.
              </p>
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-md justify-center overflow-hidden rounded-2xl bg-muted">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
              alt="Professional workspace with notebook, laptop, and coffee cup."
              width={720}
              height={900}
              className="h-full w-full object-cover"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
