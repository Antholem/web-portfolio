import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  {
    label: "Experience",
    value: "8+ years leading design & engineering teams",
  },
  {
    label: "Focus",
    value: "Product design, full-stack systems & AI workflows",
  },
  {
    label: "Availability",
    value: "Consulting engagements & fractional leadership",
  },
];

export default function HeroSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_65%)]" />
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-16 px-4 py-16 sm:px-6 lg:flex-row lg:items-stretch lg:px-8 lg:py-24">
        <div className="flex w-full flex-1 flex-col justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" aria-hidden />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              Product Designer & Full-Stack Engineer
            </span>
          </div>

          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Building polished, resilient digital products that scale
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            I partner with founders and product teams to craft thoughtful experiences, ship reliable software, and weave AI-assistive workflows that keep teams focused on what matters most.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link href="/resume.pdf" download>
                <ArrowDownToLine className="h-4 w-4" aria-hidden />
                Download Resume
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border/70 bg-background/60 backdrop-blur">
              <Link href="#projects">View Projects</Link>
            </Button>
          </div>

          <dl className="mt-12 grid w-full gap-6 sm:grid-cols-3">
            {highlights.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-2xl border border-border/60 bg-background/80 p-6 shadow-sm backdrop-blur"
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {highlight.label}
                </dt>
                <dd className="mt-3 text-sm text-foreground/90">{highlight.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex w-full max-w-sm flex-1 items-center justify-center">
          <div className="relative h-[420px] w-full max-w-[360px]">
            <div className="absolute inset-0 -z-10 rounded-[3rem] bg-gradient-to-br from-primary/40 via-primary/20 to-transparent blur-3xl" aria-hidden />
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-background/70 p-4 shadow-2xl shadow-primary/30 backdrop-blur">
              <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-muted/50 via-background to-background">
                <Image
                  src="/profile-portrait.svg"
                  alt="Portrait of Ayaan Malik"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
