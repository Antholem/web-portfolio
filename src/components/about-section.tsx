import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights: { title: string; description: string }[] = [
  {
    title: "Human-centered problem solver",
    description:
      "I partner with founders and product teams to transform ambiguous challenges into clear strategies that balance user needs and business goals.",
  },
  {
    title: "Systems-minded builder",
    description:
      "Design systems, component libraries, and resilient architectures that scale with teams while preserving craft and performance.",
  },
  {
    title: "Trusted collaborator",
    description:
      "A facilitator who thrives at the intersection of design, engineering, and product—aligning stakeholders around measurable outcomes.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-background py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            About
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Blending strategy, craft, and engineering to ship meaningful products
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A multidisciplinary product partner with a decade of experience guiding teams from discovery to delivery. I help organizations move faster with clarity, empathy, and technical excellence.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <Card className="order-2 flex h-full flex-col justify-between gap-8 lg:order-1">
            <CardHeader className="space-y-4">
              <CardTitle className="text-xl text-foreground">
                A partner for the entire product lifecycle
              </CardTitle>
              <p className="text-sm leading-relaxed text-muted-foreground">
                From greenfield experiments to enterprise redesigns, I bridge vision and execution. My approach combines systems thinking, inclusive facilitation, and modern tooling to create digital experiences that perform and endure.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                {highlights.map((highlight) => (
                  <li key={highlight.title} className="space-y-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">
                      {highlight.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="min-w-[200px]">
                  <Link href="/resume.pdf" download>
                    Download résumé
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="#contact">Start a conversation</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="order-1 overflow-hidden rounded-3xl bg-muted lg:order-2">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Professional working at a desk with design sketches and laptop."
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
