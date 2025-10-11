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
            Share a few details about your goals, timelines, and the challenges you&rsquo;re solving. I&rsquo;ll respond within two business days to explore how we can create an impactful partnership.
          </p>
          <address className="mt-6 space-y-2 text-sm not-italic text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Email:</span>{" "}
              <a
                href="mailto:hello@example.com"
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                hello@example.com
              </a>
            </p>
            <p>
              <span className="font-semibold text-foreground">Phone:</span>{" "}
              <a
                href="tel:+1234567890"
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                +1 (234) 567-890
              </a>
            </p>
          </address>

        </div>

        <div className="mx-auto w-full max-w-4xl">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
