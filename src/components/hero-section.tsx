"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowDownRight,
  ChevronDown,
  Download,
  Eye,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

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
  const resumeUrl = "/assets/resume.pdf";

  useEffect(() => {
    if (!isResumeMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        resumeMenuRef.current &&
        !resumeMenuRef.current.contains(event.target as Node)
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

  const toggleResumeMenu = () => {
    setIsResumeMenuOpen((previous) => !previous);
  };

  const closeResumeMenu = () => {
    setIsResumeMenuOpen(false);
  };

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
            <div
              ref={resumeMenuRef}
              className="relative inline-flex rounded-md shadow-sm"
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-r-none border-r-0 px-6"
              >
                <a
                  href={resumeUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download Sam Antholem Manalo's resume"
                  onClick={closeResumeMenu}
                >
                  <Download className="h-5 w-5" aria-hidden />
                  Download Resume
                </a>
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="rounded-l-none px-3"
                aria-label="Show resume options"
                aria-haspopup="menu"
                aria-expanded={isResumeMenuOpen}
                aria-controls="resume-menu"
                onClick={toggleResumeMenu}
              >
                <ChevronDown className="h-4 w-4" aria-hidden />
                <span className="sr-only">More resume options</span>
              </Button>
              {isResumeMenuOpen ? (
                <div
                  id="resume-menu"
                  role="menu"
                  aria-label="Resume options"
                  className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-md border bg-background p-1 shadow-lg"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      closeResumeMenu();
                    }
                  }}
                >
                  <a
                    role="menuitem"
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition hover:bg-accent hover:text-accent-foreground"
                    onClick={closeResumeMenu}
                  >
                    <Eye className="h-4 w-4" aria-hidden />
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
