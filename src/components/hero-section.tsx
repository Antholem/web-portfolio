import Image from "next/image";
import Link from "next/link";

import { ArrowDownRight, Github, Linkedin, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/antholem",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/antholem",
    icon: Linkedin,
  },
  {
    name: "Email",
    href: "mailto:antholemlemmanalo@gmail.com",
    icon: Mail,
  },
] as const;

export default function HeroSection() {
  return (
    <header id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-4 py-24 sm:px-6 lg:flex-row lg:items-start lg:py-28">
        <div className="flex-1 space-y-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
              Sam Antholem Manalo
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Software Engineer
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              I design and build resilient digital platforms that balance delightful experiences with reliable engineering. My practice combines systems thinking, accessibility, and AI-assisted workflows to deliver measurable business impact.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="px-6">
              <Link href="#projects">
                View Projects
                <ArrowDownRight className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-6">
              <Link href="#contact">Download Resume</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Currently based in
              </p>
              <p className="mt-1 text-base font-medium text-foreground">
                Clark, Pampanga, Philippines
              </p>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  asChild
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-transparent bg-primary/10 text-primary transition hover:border-primary/30 hover:bg-primary/20"
                  aria-label={`Visit ${social.name}`}
                >
                  <Link href={social.href} target={social.name === "Email" ? undefined : "_blank"} rel={social.name === "Email" ? undefined : "noreferrer noopener"}>
                    <social.icon className="h-5 w-5" aria-hidden />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex max-w-sm flex-1 items-center justify-center">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
            <Image
              src="/profile-portrait.svg"
              alt="Illustrated portrait of Sam Antholem Manalo"
              width={480}
              height={560}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
