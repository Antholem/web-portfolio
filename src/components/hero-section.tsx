import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/janedoe",
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/janedoe",
    icon: Github,
  },
  {
    label: "Email",
    href: "mailto:hello@janedoe.design",
    icon: Mail,
  },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/40"
    >
      <div className="mx-auto flex max-w-6xl flex-col-reverse gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div className="space-y-8 lg:w-1/2">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
              Portfolio of Jane Doe
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Product Designer & Full-stack Engineer
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              I build immersive digital products that blend thoughtful experience design with resilient engineering. From design systems to end-to-end applications, I help teams ship faster and smarter.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="#projects">
                View Projects
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/resume.pdf">
                Download Résumé
                <Download className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Currently partnering with</p>
              <p>High-growth teams to craft human-centered products.</p>
            </div>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <Link
                  key={social.href}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/60 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex max-w-sm items-center justify-center lg:mx-0 lg:w-1/2">
          <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-3xl" aria-hidden />
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/60 p-4 shadow-2xl backdrop-blur">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-muted to-background p-4">
              <Image
                src="/profile-portrait.svg"
                alt="Portrait of Jane Doe"
                priority
                width={480}
                height={640}
                className="h-auto w-full"
              />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Based in New York</span>
              <span>Open to remote collaborations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" aria-hidden />
    </section>
  );
}
