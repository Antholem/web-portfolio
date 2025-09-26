import ContactForm from "@/components/contact-form";
import ProjectsSection from "@/components/projects-section";

export default function Home() {
  return (
    <main className="space-y-20 py-12">
      <ProjectsSection />
      <div className="px-6">
        <ContactForm />
      </div>
    </main>
  );
}
