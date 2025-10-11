import ContactForm from "@/components/contact-form";
import { Mail, MapPin, Phone } from "lucide-react";

const contactDetails = [
  {
    label: "Contact",
    value: "+63 977 333 6914",
    icon: Phone,
    href: "tel:+639773336914",
  },
  {
    label: "Email",
    value: "artchelorfernando@gmail.com",
    icon: Mail,
    href: "mailto:artchelorfernando@gmail.com",
  },
  {
    label: "Location",
    value: "Mabalacat, Pampanga, Philippines",
    icon: MapPin,
  },
] as const;

export default function ContactSection() {
  return (
    <section id="contact" className="bg-muted/20 py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-start lg:px-8">
        <div className="flex flex-col gap-8 rounded-3xl bg-background/80 p-8 shadow-sm ring-1 ring-border/60 backdrop-blur">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">Get in touch</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              I&rsquo;m available to answer any questions or discuss potential collaborations
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Whether you have a project in mind or just want to connect, feel free to reach out using the information
              below or send a message with the form. I&rsquo;ll respond as soon as possible.
            </p>
          </div>

          <dl className="space-y-6">
            {contactDetails.map(({ label, value, icon: Icon, href }) => (
              <div key={label} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">{label}</dt>
                  {href ? (
                    <dd className="mt-1 text-base font-semibold text-foreground">
                      <a href={href} className="hover:text-primary/80 focus-visible:text-primary/80 focus-visible:outline-none">
                        {value}
                      </a>
                    </dd>
                  ) : (
                    <dd className="mt-1 text-base font-semibold text-foreground">{value}</dd>
                  )}
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="w-full">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
