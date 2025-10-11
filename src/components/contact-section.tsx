import ContactForm from "@/components/contact-form";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-muted/20 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Let's Connect
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Build momentum for your next initiative with a thoughtful partner
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Share a few details about your goals, timelines, and challenges. I'll follow up with a tailored response to explore how we can collaborate effectively.
          </p>
        </div>

        <div className="mx-auto w-full max-w-3xl">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
