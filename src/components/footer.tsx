import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const serviceHighlights = [
  "Product strategy & discovery",
  "Design systems & prototyping",
  "Full-stack web engineering",
];

const socialLinks = [
  {
    label: "Email",
    href: "mailto:antholemlemmanalo@gmail.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    href: "https://github.com/antholem",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/antholem",
    icon: Linkedin,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
                Anthony Lemuel Manalo
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Crafting human-centered digital products that deliver measurable impact.
              </h2>
              <p className="text-base text-muted-foreground">
                I combine product strategy, interface design, and full-stack development to help teams ship experiences that grow with their audience.
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Currently booking for Q2 2025
              </p>
              <p className="mt-3 text-base text-muted-foreground">
                Tell me about your next milestone and I&rsquo;ll respond within two business days with a tailored collaboration plan.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="mailto:antholemlemmanalo@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition hover:border-primary/60 hover:text-primary"
                >
                  Email directly
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <div className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Navigate
              </h3>
              <ul className="space-y-3 text-base text-muted-foreground">
                {navigationLinks.map((link) => (
                  <li key={link.label}>
                    <Link className="transition hover:text-primary" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Focus areas
              </h3>
              <ul className="space-y-3 text-base text-muted-foreground">
                {serviceHighlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-5 sm:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Connect
              </h3>
              <ul className="flex flex-wrap gap-4">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                      className="group inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/60 hover:text-primary"
                    >
                      <Icon className="h-4 w-4 transition group-hover:scale-110" aria-hidden />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Anthony Lemuel Manalo. All rights reserved.
          </p>
          <p className="mt-4 sm:mt-0">
            Built with intention in Pampanga, Philippines.
          </p>
        </div>
      </div>
    </footer>
  );
}
