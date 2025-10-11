import ContactForm from "@/components/contact-form";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-muted/40 py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Let's Collaborate
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tell me about your next initiative and how I can help accelerate it
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Share a bit about your project vision, team goals, or product challenges.{" "}
            I'll follow up to explore how we can build something exceptional together.
          </p>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
