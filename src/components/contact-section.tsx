import ContactForm from "@/components/contact-form";
import { Mail, MapPin, Phone } from "lucide-react";

const contactDetails = [
  {
    label: "Contact",
    value: "+63 977 333 684",
    href: "tel:+63977333684",
    icon: Phone,
  },
  {
    label: "Email",
    value: "artrodeliorremedios@gmail.com",
    href: "mailto:artrodeliorremedios@gmail.com",
    icon: Mail,
  },
  {
    label: "Location",
    value: "Mabalacat, Pampanga, Philippines",
    icon: MapPin,
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="bg-muted/20 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl lg:text-left">
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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-start lg:gap-12">
          <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-8 shadow-lg backdrop-blur">
            <div className="absolute inset-y-0 right-[-120px] w-[280px] rotate-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-70 blur-3xl" />
            <div className="relative">
              <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">Reach out</h3>
              <p className="mt-4 text-2xl font-semibold text-foreground">
                I&rsquo;m available to answer questions or discuss potential collaborations.
              </p>
            </div>

            <dl className="relative flex flex-col gap-6">
              {contactDetails.map(({ label, value, href, icon: Icon }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">{label}</dt>
                    <dd className="mt-2 text-base font-medium text-foreground">
                      {href ? (
                        <a href={href} className="transition-colors hover:text-primary">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="mx-auto w-full max-w-4xl lg:max-w-none">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
