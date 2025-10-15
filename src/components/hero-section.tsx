import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, Sparkles, UserRoundCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const roles = [
  "Product Designer",
  "Full-stack Engineer",
  "AI Workflow Strategist",
];

const highlights = [
  {
    label: "Years of experience",
    value: "8+",
  },
  {
    label: "Products launched",
    value: "25",
  },
  {
    label: "Teams empowered",
    value: "15",
  },
];

export default function HeroSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        aria-hidden
      >
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-slate-300/30 blur-3xl dark:bg-slate-700/50" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 sm:px-6 md:flex-row md:gap-16 lg:px-8">
        <div className="flex w-full flex-col gap-8 md:w-1/2">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            <Sparkles className="h-4 w-4" aria-hidden />
            <span>Portfolio</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Crafting thoughtful digital experiences that scale with purpose
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              I blend systems thinking, code craftsmanship, and AI-assisted workflows to help product teams move from idea to impact fast—without compromising on quality, accessibility, or delight.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {roles.map((role) => (
              <span
                key={role}
                className="rounded-full border border-border/80 bg-background/70 px-4 py-1 text-sm text-muted-foreground shadow-sm backdrop-blur"
              >
                {role}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button asChild size="lg" className="px-6">
              <Link href="/resume.pdf" download>
                <ArrowDownToLine className="h-4 w-4" aria-hidden />
                Download Resume
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="px-6">
              <Link href="#contact">
                <UserRoundCheck className="h-4 w-4" aria-hidden />
                Book a consultation
              </Link>
            </Button>
          </div>

          <dl className="grid w-full gap-6 sm:grid-cols-3">
            {highlights.map((highlight) => (
              <div key={highlight.label} className="rounded-xl border border-border/70 bg-card/60 p-4 text-left shadow-sm backdrop-blur">
                <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {highlight.label}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-foreground">
                  {highlight.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative w-full md:w-1/2">
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border/70 bg-card shadow-xl">
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/20 via-transparent to-transparent" aria-hidden />
              <Image
                src="/profile-portrait.svg"
                alt="Portrait of Alex Morgan"
                width={480}
                height={560}
                priority
                className="w-full object-cover"
              />
              <div className="space-y-1 border-t border-border/70 bg-background/90 p-6 backdrop-blur">
                <p className="text-lg font-semibold text-foreground">Alex Morgan</p>
                <p className="text-sm text-muted-foreground">
                  Principal Product Designer & Engineer partnering with visionary teams worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
