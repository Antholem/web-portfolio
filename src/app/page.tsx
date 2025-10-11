import ContactSection from "@/components/contact-section";
import ProjectsSection from "@/components/projects-section";

export default function Home() {
  return (
    <main className="space-y-2">
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
