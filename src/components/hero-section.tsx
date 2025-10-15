import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, Mail, MapPin, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

const highlights = [
  "Design systems that elevate complex products",
  "Full-stack engineering grounded in UX craft",
  "AI-assisted workflows that accelerate delivery",
];

export default function HeroSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/40"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(circle_at_top,_theme(colors.primary/10),_transparent_65%)]" />
        <div className="absolute -left-40 top-1/2 size-[28rem] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:py-24 lg:px-8">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
            <Sparkles className="size-3" aria-hidden />
            Product Designer &amp; Full-stack Engineer
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Crafting intentional digital experiences that balance strategy, design, and code.
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              I help venture-backed teams move from concept to scale with design systems, engineering rigor, and AI-enabled workflows that keep user value at the center.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground lg:flex-row lg:items-center lg:gap-8">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-primary" aria-hidden />
              Remote · Open to global collaborations
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="size-4 text-primary" aria-hidden />
              hello@antholem.studio
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg">
              <Link href="/resume.pdf" download>
                <ArrowDownToLine className="size-4" aria-hidden />
                Download resume
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#contact">Discuss a project</Link>
            </Button>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-xl border border-border/60 bg-background/60 p-4 text-sm text-muted-foreground shadow-sm backdrop-blur"
              >
                {highlight}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex-1">
          <div className="mx-auto size-[18rem] max-w-full rounded-[2.5rem] border border-border/50 bg-background/80 p-4 shadow-xl backdrop-blur md:size-[22rem]">
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/5 to-background">
              <Image
                src="/profile-portrait.svg"
                alt="Portrait of Anthony Lema, product designer and engineer"
                fill
                priority
                className="object-cover object-top"
                sizes="(min-width: 1024px) 22rem, 18rem"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
