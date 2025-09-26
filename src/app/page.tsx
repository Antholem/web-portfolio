import ProjectsSection from "@/components/projects-section";
import ContactForm from "@/components/contact-form";

export default function Home() {
  return (
    <main className="space-y-24 pb-24">
      <ProjectsSection />
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Let's build something together</h2>
          <p className="mt-3 text-base text-muted-foreground">
            Ready to collaborate on a new product or iterate on an existing one? Share a few details about what you have
            in mind and I’ll be in touch soon.
          </p>
        </div>
        <div className="mt-10">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
