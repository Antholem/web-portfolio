import ContactForm from "@/components/contact-form";
import ProjectsSection from "@/components/projects-section";

export default function Home() {
  return (
    <main className="space-y-24">
      <ProjectsSection />
      <ContactForm />
    </main>
  );
}
