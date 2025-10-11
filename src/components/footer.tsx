import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://github.com/antholemmanalo",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/antholemmanalo/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "mailto:antholemlemmanalo@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/95 py-12 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
              Let&rsquo;s collaborate
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Building purposeful digital experiences
            </h2>
            <p className="text-sm text-muted-foreground">
              From idea to launch, I craft performant, accessible interfaces that align design and engineering to solve meaningful problems.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">
                Explore
              </p>
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="transition hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">
                Connect
              </p>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary/60 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Antholem Manalo. All rights reserved.</p>
          <p className="text-xs">
            Available for freelance and product collaborations. <a className="font-medium text-foreground transition hover:text-primary" href="mailto:antholemlemmanalo@gmail.com">Let&rsquo;s talk.</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
