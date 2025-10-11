import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const navigationLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
  { label: "Resume", href: "https://drive.google.com/file/d/1QSNQg-F1NDT6vKrrfE0YvixflVpG1kAA/view" },
  { label: "Blog", href: "https://medium.com/@antholemmanalo" },
] as const;

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/antholem",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/antholem-manalo/",
    icon: Linkedin,
  },
  {
    label: "Email",
    href: "mailto:antholemlemmanalo@gmail.com",
    icon: Mail,
  },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md space-y-4">
            <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
              Antholem Manalo
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Product-focused software engineer crafting resilient digital experiences that align craft, code, and measurable
              outcomes for teams that care about meaningful impact.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </Link>
              ))}
            </div>
          </div>

          <nav className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Explore
              </p>
              <ul className="space-y-2 text-foreground/90">
                {navigationLinks.slice(0, 2).map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="transition hover:text-primary"
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Beyond the work
              </p>
              <ul className="space-y-2 text-foreground/90">
                {navigationLinks.slice(2).map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="transition hover:text-primary"
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} Antholem Manalo. All rights reserved.
          </p>
          <p>
            Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
