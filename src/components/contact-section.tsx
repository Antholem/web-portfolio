import ContactForm from "@/components/contact-form";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@alexsmith.dev",
    href: "mailto:hello@alexsmith.dev",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 867-5309",
    href: "tel:+15558675309",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "San Francisco Bay Area, CA",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/alexsmith",
    href: "https://www.linkedin.com/in/alexsmith",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/alexsmith",
    href: "https://github.com/alexsmith",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="bg-muted/20 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Get in touch
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Let&rsquo;s collaborate on what&rsquo;s next for your product or team
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Share a few details about your goals, timelines, and the challenges you&rsquo;re solving. I&rsquo;ll respond within two business days to explore how we can create an impactful partnership.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/95 p-8 shadow-sm shadow-black/5 ring-1 ring-inset ring-border/40 backdrop-blur">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary/70" aria-hidden />

            <div className="relative space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
                Contact information
              </p>
              <h3 className="text-2xl font-bold text-foreground sm:text-3xl">Alex Smith</h3>
              <p className="text-base text-muted-foreground">
                Prefer a direct connection? Reach out using the details below and I&rsquo;ll get back to you within two
                business days.
              </p>
            </div>

            <div className="relative mt-8 space-y-6">
              {contactDetails.map(({ icon: Icon, label, value, href }) => {
                const isExternal = href?.startsWith("http");

                return (
                  <div key={label} className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
                        {label}
                      </p>
                      {href ? (
                        <a
                          className="mt-1 inline-flex text-base font-medium text-foreground transition hover:text-primary"
                          href={href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noreferrer" : undefined}
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-1 text-base text-foreground">{value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mx-auto w-full max-w-4xl lg:ml-auto">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
