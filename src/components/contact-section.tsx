import { Mail, MapPin, Phone } from "lucide-react";

import ContactForm from "@/components/contact-form";

const CONTACT_METHODS = [
  {
    label: "Email",
    value: "hello@yourdomain.com",
    href: "mailto:hello@yourdomain.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
    icon: Phone,
  },
  {
    label: "Location",
    value: "San Francisco, CA",
    href: "https://maps.app.goo.gl/",
    icon: MapPin,
  },
] as const;

export default function ContactSection() {
  return (
    <section id="contact" className="bg-muted/20 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:items-start">
          <div className="space-y-10">
            <div className="space-y-4 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
                Get in touch
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Let&rsquo;s collaborate on what&rsquo;s next for your product or team
              </h2>
              <p className="text-base text-muted-foreground">
                Share a few details about your goals, timelines, and the challenges you&rsquo;re solving. I&rsquo;ll respond within two business days to explore how we can create an impactful partnership.
              </p>
            </div>

            <div className="space-y-6 rounded-2xl border border-border/60 bg-background/80 p-8 shadow-sm backdrop-blur">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                  Contact information
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-foreground">Let&rsquo;s connect directly</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  Reach out using the details below or submit the form and I&rsquo;ll follow up shortly.
                </p>
              </div>

              <ul className="space-y-4">
                {CONTACT_METHODS.map(({ label, value, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="group flex items-center gap-4 rounded-xl border border-border/60 bg-muted/30 px-5 py-4 text-left transition hover:border-primary/60 hover:bg-primary/5"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/15">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span>
                        <span className="text-sm font-medium text-muted-foreground">{label}</span>
                        <span className="mt-1 block text-base font-semibold text-foreground">{value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
