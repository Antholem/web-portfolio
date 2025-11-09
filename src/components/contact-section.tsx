import ContactForm from "@/components/contact-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Contact
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Let’s collaborate on your next project
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Share your goals or technical needs. I’ll respond within two business
            days to discuss how we can work together.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Card className="mx-auto w-full max-w-xl self-start">
            <CardHeader className="space-y-3">
              <CardTitle className="text-xl text-foreground">
                Contact Details
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                Reach out directly or use the form to start a conversation about
                projects, collaborations, or consultations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <dl className="space-y-5 text-left">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Phone
                    </dt>
                    <dd className="mt-1 text-base font-medium text-foreground">
                      +63 977 333 6944
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Email
                    </dt>
                    <dd className="mt-1 text-base font-medium text-foreground">
                      <a
                        className="hover:text-primary"
                        href="mailto:antholemlemmanalo@gmail.com"
                      >
                        antholemlemmanalo@gmail.com
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                      Location
                    </dt>
                    <dd className="mt-1 text-base font-medium text-foreground">
                      Mabalacat, Pampanga, Philippines
                    </dd>
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
  