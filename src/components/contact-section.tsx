import ContactForm from "@/components/contact-form";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-muted/20 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:items-start">
          <div className="rounded-3xl border border-border/40 bg-background/80 p-8 shadow-lg shadow-primary/5 backdrop-blur">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
                Get in touch
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                I&rsquo;m available for new opportunities and collaborations
              </h2>
              <p className="text-base text-muted-foreground">
                Reach out through any of the channels below or drop a message using the contact form. I typically
                respond within two business days.
              </p>
            </div>

            <dl className="mt-10 space-y-6 text-base">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Contact
                  </dt>
                  <dd>
                    <a href="tel:+639779336944" className="font-medium text-foreground hover:underline">
                      +63 977 933 6944
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Email
                  </dt>
                  <dd>
                    <a
                      href="mailto:arbicelomerimando@gmail.com"
                      className="font-medium text-foreground hover:underline"
                    >
                      arbicelomerimando@gmail.com
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                    Location
                  </dt>
                  <dd className="font-medium text-foreground">
                    Mabalacat, Pampanga, Philippines
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="mx-auto w-full max-w-2xl rounded-3xl border border-border/40 bg-background/80 p-6 shadow-lg shadow-primary/5 backdrop-blur sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
