import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    href: "https://github.com/antholem",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/antholem",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "mailto:antholemlemmanalo@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

const navigationLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-background py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-start">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
              Let&apos;s collaborate
            </p>
            <p className="text-base text-muted-foreground">
              Building thoughtful web experiences with clean code, intentional design, and a focus on meaningful impact.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-end">
            <nav aria-label="Footer navigation" className="space-y-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Explore
              </p>
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-foreground transition hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Connect
              </p>
              <ul className="flex gap-4">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-label={label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} Antholem. All rights reserved.</p>
          <p>
            Crafted with passion in Pampanga, Philippines.
          </p>
        </div>
      </div>
    </footer>
  );
}
