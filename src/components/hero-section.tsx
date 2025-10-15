import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail, Rss } from "lucide-react";

import { Button } from "@/components/ui/button";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/antholem",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    href: "https://github.com/antholem",
    icon: Github,
  },
  {
    name: "Newsletter",
    href: "https://antholem.com/newsletter",
    icon: Rss,
  },
  {
    name: "Email",
    href: "mailto:hello@antholem.com",
    icon: Mail,
  },
] as const;

export default function HeroSection() {
  return (
    <section id="hero" className="bg-gradient-to-b from-background via-background to-muted/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 px-4 py-20 sm:px-6 md:flex-row md:py-24 lg:px-8">
        <div className="flex-1 space-y-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-primary">
            <span className="size-2 rounded-full bg-primary" aria-hidden />
            Currently welcoming product collaborations
          </div>

          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/70">
              Anthony Olem
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Product designer & full-stack engineer crafting purposeful digital experiences
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              I help founders and product teams transform complex ideas into clear, trustworthy experiences—blending strategy, design systems, and modern engineering for measurable business impact.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="h-12 rounded-full px-8 text-base">
              <Link href="#projects">
                View recent work
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border px-8 text-base"
            >
              <Link href="#contact">
                Start a conversation
                <Mail className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Connect with me
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="group inline-flex size-11 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <social.icon className="size-4 transition-transform group-hover:scale-110" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex-1">
          <div className="relative mx-auto max-w-sm">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] border border-border/60 bg-gradient-to-br from-primary/20 via-background to-background shadow-2xl shadow-primary/10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.45),_transparent_55%)]" aria-hidden />
              <Image
                src="/hero-portrait.svg"
                alt="Portrait illustration of Anthony Olem"
                fill
                priority
                sizes="(min-width: 1024px) 360px, (min-width: 768px) 320px, 280px"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 w-full max-w-[260px] -translate-x-1/2 rounded-3xl border border-border/60 bg-background/95 p-4 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">
                Expertise snapshot
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Product strategy · Design systems · Full-stack delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
