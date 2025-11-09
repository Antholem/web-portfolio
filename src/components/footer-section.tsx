import { Github, Linkedin, Mail } from "lucide-react";

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
];

export default function FooterSection() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
        {/* Top: Branding + Social */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg space-y-2">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              Sam Antholem Manalo
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Software engineer building scalable, accessible, and high-performance web
              applications. Focused on aligning design and engineering to deliver measurable results.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target={name === "Email" ? undefined : "_blank"}
                rel={name === "Email" ? undefined : "noopener noreferrer"}
                aria-label={name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Icon className="h-5 w-5" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sam Antholem Manalo. All rights reserved.</p>
          <p className="text-muted-foreground/80">
            Built with <span className="font-medium text-foreground">Next.js</span>,{" "}
            <span className="font-medium text-foreground">Tailwind CSS</span>, and{" "}
            <span className="font-medium text-foreground">ShadCN UI</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
