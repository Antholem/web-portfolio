import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

const socialLinks = [
  {
    label: "Email",
    href: "mailto:hello@jordanmitchell.design",
    icon: Mail,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jordanmitchell",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/jordanmitchell",
    icon: Github,
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-primary/5 via-background to-transparent lg:block" aria-hidden />
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="relative flex-1 space-y-10">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full border border-primary/10 bg-background/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-primary/70 backdrop-blur">
              Portfolio 2024
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Jordan Mitchell
              </h1>
              <p className="text-lg font-medium text-muted-foreground sm:text-xl">
                Product Designer & Full-stack Engineer crafting high-performing, human-centered digital platforms.
              </p>
            </div>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
              I build elegant systems that bring clarity to complex problems—bridging research, design, and engineering to ship delightful experiences at scale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Button asChild size="lg">
              <Link href="#projects" className="group">
                View selected work
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#contact">Schedule a conversation</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex size-2 rounded-full bg-emerald-500" aria-hidden />
              <span>Currently partnering with seed to series B founders</span>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <Button
                  key={link.label}
                  asChild
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-transparent text-muted-foreground transition hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
                >
                  <Link href={link.href} aria-label={link.label} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>
                    <link.icon className="size-5" aria-hidden />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex-1 lg:max-w-md">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 via-background to-background shadow-xl">
            <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-white/70 to-white/20 shadow-inner" aria-hidden />
            <div className="relative inset-0 flex h-full items-end justify-center p-6">
              <Image
                src="/profile-portrait.svg"
                alt="Jordan Mitchell portrait"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">12+</p>
              <p>Years creating digital products</p>
            </div>
            <div className="h-10 w-px bg-border" aria-hidden />
            <div className="text-center">
              <p className="text-2xl font-semibold text-foreground">40+</p>
              <p>Products launched with cross-functional teams</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
