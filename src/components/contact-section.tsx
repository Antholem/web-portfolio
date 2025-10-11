import ContactForm from "@/components/contact-form";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-muted/20 py-20">
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

        <div className="mx-auto w-full max-w-4xl">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
