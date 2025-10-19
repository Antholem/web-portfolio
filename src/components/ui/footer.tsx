import Link from "next/link";

const footerLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold text-foreground">Sam Antholem Manalo</p>
          <p className="mt-1">Building thoughtful digital experiences, one project at a time.</p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-4">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col items-start gap-1 text-xs sm:text-sm">
          <span>© {new Date().getFullYear()} Antholem. All rights reserved.</span>
          <Link
            href="mailto:antholemlemmanalo@gmail.com"
            className="transition-colors hover:text-foreground"
          >
            antholemlemmanalo@gmail.com
          </Link>
        </div>
      </div>
    </footer>
  );
}
