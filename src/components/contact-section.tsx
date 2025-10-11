import ContactForm from "@/components/contact-form";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

type ContactDetail = {
  label: string;
  value: string;
  description?: string;
  href?: string;
  icon: LucideIcon;
};

const contactDetails: ContactDetail[] = [
  {
    label: "Email",
    value: "hello@janedoe.dev",
    description: "The fastest way to reach me for new collaborations and opportunities.",
    href: "mailto:hello@janedoe.dev",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+1 (415) 555-0134",
    description: "Available for quick chats during business hours or to schedule a call.",
    href: "tel:+14155550134",
    icon: Phone,
  },
  {
    label: "Location",
    value: "San Francisco, California",
    description: "Working with clients remotely across North America and Europe.",
    icon: MapPin,
  },
  {
    label: "Availability",
    value: "Monday – Friday, 9am – 5pm PT",
    description: "I do my best to respond to inquiries within one business day.",
    icon: Clock,
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

        <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <Card className="h-full border-muted/60 bg-background/70 p-6 shadow-sm backdrop-blur">
            <div className="space-y-6">
              {contactDetails.map(({ label, value, description, href, icon: Icon }) => (
                <div key={label} className="flex gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/70">
                      {label}
                    </p>

                    {href ? (
                      <a
                        href={href}
                        className="text-base font-medium text-foreground transition hover:text-primary"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-base font-medium text-foreground">{value}</p>
                    )}

                    {description ? (
                      <p className="text-sm text-muted-foreground">{description}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="w-full max-w-4xl lg:ml-auto">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
