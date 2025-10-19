import Link from "next/link";

import { Github, Linkedin, Mail } from "lucide-react";

const navigationLinks = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
] as const;

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

export default function FooterSection() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950/95 text-muted-foreground">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(14,165,233,0.08),_transparent_60%)]"
        aria-hidden
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Let&apos;s connect</p>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Ready to bring your next idea to life
          </h2>
          <p className="max-w-xl text-base leading-relaxed">
            I partner with founders, product teams, and agencies to build resilient, human-centered software experiences.
            Reach out if you&apos;re exploring something new or need help scaling what&apos;s working.
          </p>
        </div>

        <div className="flex flex-col items-center gap-10 sm:flex-row lg:items-start">
          <nav aria-label="Quick links" className="space-y-4 text-center sm:text-left">
            <p className="text-sm font-semibold text-foreground">Navigate</p>
            <ul className="space-y-3 text-sm">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4 text-center sm:text-left">
            <p className="text-sm font-semibold text-foreground">Stay in touch</p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target={social.name === "Email" ? undefined : "_blank"}
                  rel={social.name === "Email" ? undefined : "noreferrer noopener"}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  aria-label={`Visit ${social.name}`}
                >
                  <social.icon className="h-5 w-5" aria-hidden />
                </Link>
              ))}
            </div>
            <Link
              href="mailto:antholemlemmanalo@gmail.com"
              className="inline-flex items-center text-sm font-medium text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              antholemlemmanalo@gmail.com
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:text-sm">
          <p>© {new Date().getFullYear()} Sam Antholem Manalo. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Crafted with care using accessibility-first and human-centered principles.
          </p>
        </div>
      </div>
    </footer>
  );
}
