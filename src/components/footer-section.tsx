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
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl space-y-2">
            <p className="text-base font-semibold tracking-tight text-foreground">Antholem Manalo</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Front-end developer crafting intuitive, accessible digital experiences through thoughtful design and clean
              code.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary"
                aria-label={name}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Antholem Manalo. All rights reserved.
          </p>
          <p>
            Built with Next.js, Tailwind CSS, and a passion for delightful user experiences.
          </p>
        </div>
      </div>
    </footer>
  );
}
