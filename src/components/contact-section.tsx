import ContactForm from "@/components/contact-form";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-muted/30 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Let’s Connect
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Partner with a developer focused on clarity, collaboration, and delivery
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Ready to discuss a new initiative or enhance an existing product? Share a few details below and I’ll follow up with
            thoughtful next steps tailored to your goals.
          </p>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
