import ContactForm from "@/components/contact-form";

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
          <dl className="mt-10 grid gap-6 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Email</dt>
              <dd className="mt-3 text-lg font-semibold text-foreground">
                <a
                  href="mailto:hello@yourdomain.com"
                  className="underline decoration-primary/40 decoration-2 underline-offset-4 transition hover:text-primary hover:decoration-primary"
                >
                  hello@yourdomain.com
                </a>
              </dd>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-sm">
              <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Phone</dt>
              <dd className="mt-3 text-lg font-semibold text-foreground">
                <a
                  href="tel:+1234567890"
                  className="underline decoration-primary/40 decoration-2 underline-offset-4 transition hover:text-primary hover:decoration-primary"
                >
                  +1 (234) 567-890
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="mx-auto w-full max-w-4xl">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
