'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ArrowDownRight, ChevronDown, Github, Linkedin, Mail } from "lucide-react";

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
  const [isResumeMenuOpen, setIsResumeMenuOpen] = useState(false);
  const resumeMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isResumeMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        resumeMenuRef.current &&
        event.target instanceof Node &&
        !resumeMenuRef.current.contains(event.target)
      ) {
        setIsResumeMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsResumeMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isResumeMenuOpen]);

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
              I engineer scalable digital platforms that merge robust architecture with refined user experience. My approach applies systems thinking, accessibility standards, and AI-enhanced workflows to deliver reliable and measurable performance.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="px-6">
              <Link href="#projects">
                View Projects
                <ArrowDownRight className="h-5 w-5" aria-hidden />
              </Link>
            </Button>
            <div
              className="relative flex items-center"
              ref={resumeMenuRef}
              onBlur={(event) => {
                if (
                  resumeMenuRef.current &&
                  event.relatedTarget instanceof Node &&
                  resumeMenuRef.current.contains(event.relatedTarget)
                ) {
                  return;
                }
                setIsResumeMenuOpen(false);
              }}
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-r-none px-6"
              >
                <a
                  href="/assets/resume.pdf"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Sam Antholem Manalo's resume"
                >
                  Download Resume
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="-ml-px rounded-l-none px-3"
                aria-haspopup="menu"
                aria-expanded={isResumeMenuOpen}
                aria-label="More resume options"
                onClick={() => setIsResumeMenuOpen((current) => !current)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setIsResumeMenuOpen(true);
                  }
                }}
              >
                <ChevronDown className="h-4 w-4" aria-hidden />
              </Button>
              {isResumeMenuOpen ? (
                <div
                  role="menu"
                  aria-label="Resume options"
                  className="absolute right-0 top-full z-10 mt-2 w-40 overflow-hidden rounded-md border bg-background p-1 shadow-lg"
                >
                  <a
                    role="menuitem"
                    className="block rounded-sm px-3 py-2 text-sm text-foreground transition hover:bg-accent hover:text-accent-foreground"
                    href="/assets/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View Sam Antholem Manalo's resume"
                    onClick={() => setIsResumeMenuOpen(false)}
                  >
                    View Resume
                  </a>
                </div>
              ) : null}
            </div>
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
          <Image
            src="/assets/profile.jpg"
            alt="Portrait of Sam Antholem Manalo"
            width={480}
            height={560}
            priority
            className="h-auto w-full rounded-[2.5rem] object-cover shadow-xl"
          />
        </div>
      </div>
    </header>
  );
}
