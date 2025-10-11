import ContactForm from "@/components/contact-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

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
            Share a few details about your goals, timelines, and the challenges you&rsquo;re solving. I&rsquo;ll respond within
            two business days to explore how we can create an impactful partnership.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card className="mx-auto w-full max-w-xl">
            <CardHeader className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">Contact Details</p>
              <CardTitle>Let&rsquo;s connect</CardTitle>
              <CardDescription className="leading-relaxed">
                I&rsquo;m available to answer questions, explore opportunities, and discuss potential collaborations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <dl className="space-y-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/80">
                      Phone
                    </dt>
                    <dd className="mt-1 text-base font-medium text-foreground">+63 977 333 6944</dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/80">
                      Email
                    </dt>
                    <dd className="mt-1 text-base font-medium text-foreground">
                      <a className="transition-colors hover:text-primary" href="mailto:artcherolemernaldo@gmail.com">
                        artcherolemernaldo@gmail.com
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/80">
                      Location
                    </dt>
                    <dd className="mt-1 text-base font-medium text-foreground">Mabalacat, Pampanga, Philippines</dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="mx-auto w-full max-w-4xl lg:max-w-full">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
