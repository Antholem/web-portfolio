import Link from "next/link";

const footerLinks = [
  {
    title: "Navigation",
    items: [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Skills", href: "#skills" },
      { label: "Projects", href: "#projects" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Connect",
    items: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/antholem",
        external: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/antholem",
        external: true,
      },
      { label: "Email", href: "mailto:antholemlemmanalo@gmail.com" },
    ],
  },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-md space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
            Sam Antholem Manalo
          </p>
          <p className="text-base text-muted-foreground">
            Building human-centered experiences with thoughtful engineering and delightful design.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/80">
                {group.title}
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="transition hover:text-primary"
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer noopener" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/80">
              Based In
            </p>
            <p className="text-sm text-muted-foreground">
              Clark, Pampanga, Philippines
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {currentYear} Sam Antholem Manalo. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="#services" className="transition hover:text-primary">
              Services
            </Link>
            <Link href="/" className="transition hover:text-primary">
              Style Guide
            </Link>
            <Link href="#contact" className="transition hover:text-primary">
              Let&apos;s Collaborate
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
