import ContactForm from "@/components/contact-form";
import { Mail, MapPin, Phone, Send } from "lucide-react";

const contactDetails = [
  {
    label: "Email",
    value: "hello@alexdoe.dev",
    icon: Mail,
    href: "mailto:hello@alexdoe.dev",
  },
  {
    label: "Phone",
    value: "+1 (555) 123-4567",
    icon: Phone,
    href: "tel:+15551234567",
  },
  {
    label: "Location",
    value: "San Francisco, California (Pacific Time)",
    icon: MapPin,
  },
  {
    label: "Availability",
    value: "Currently partnering with product teams on design systems and platform initiatives.",
    icon: Send,
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

        <div className="mx-auto w-full max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
            <div className="rounded-3xl border border-border/70 bg-background/60 p-8 shadow-sm backdrop-blur">
              <h3 className="text-xl font-semibold text-foreground">Contact Information</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Prefer to reach out directly? Use the details below to start the conversation or
                share project context before submitting the form.
              </p>

              <dl className="mt-6 space-y-6">
                {contactDetails.map((detail) => (
                  <div key={detail.label} className="flex gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <detail.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">{detail.label}</dt>
                      {detail.href ? (
                        <dd className="text-base font-semibold text-foreground">
                          <a
                            href={detail.href}
                            className="hover:text-primary focus-visible:text-primary focus-visible:outline-none"
                          >
                            {detail.value}
                          </a>
                        </dd>
                      ) : (
                        <dd className="text-base font-semibold text-foreground">{detail.value}</dd>
                      )}
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm backdrop-blur">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
