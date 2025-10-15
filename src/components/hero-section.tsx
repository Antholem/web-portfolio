import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-gradient-to-br from-background via-background to-muted/60"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_55%)]" aria-hidden />
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 pb-20 pt-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20 lg:px-8 lg:pt-28">
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
              Product Designer & Engineer
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Crafting human-centered digital experiences that scale
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              I blend product strategy, design systems, and full-stack engineering to launch purposeful experiences that feel as good as they perform.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild className="px-6 py-3 text-sm font-semibold">
              <Link href="/resume.pdf" download>
                <ArrowDownToLine className="size-4" aria-hidden />
                Download résumé
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary/40 bg-background/80 px-6 py-3 text-sm font-semibold backdrop-blur-sm hover:bg-primary/10"
            >
              <Link href="#contact">
                <Mail className="size-4" aria-hidden />
                Let&apos;s collaborate
              </Link>
            </Button>
          </div>

          <dl className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary/20 bg-background/80 p-6 shadow-sm backdrop-blur">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                Experience
              </dt>
              <dd className="mt-3 text-2xl font-semibold text-foreground">8+ years</dd>
              <p className="mt-1 text-xs text-muted-foreground">Leading product and engineering teams across startups and enterprises.</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-background/80 p-6 shadow-sm backdrop-blur">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                Platforms launched
              </dt>
              <dd className="mt-3 text-2xl font-semibold text-foreground">25+</dd>
              <p className="mt-1 text-xs text-muted-foreground">From MVPs to enterprise-scale ecosystems shipped globally.</p>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-background/80 p-6 shadow-sm backdrop-blur">
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
                Recognition
              </dt>
              <dd className="mt-3 text-2xl font-semibold text-foreground">4 awards</dd>
              <p className="mt-1 text-xs text-muted-foreground">Honored for design craft, accessibility, and innovation excellence.</p>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-3xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-background/90 p-4 shadow-xl backdrop-blur">
            <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] border border-white/5 bg-slate-900/60">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_55%)]" aria-hidden />
                <Image
                  src="/profile-portrait.svg"
                  alt="Portrait of a digital product designer and engineer"
                  fill
                  priority
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 320px, 100vw"
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
