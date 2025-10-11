import ContactSection from "@/components/contact-section";
import ProjectsSection from "@/components/projects-section";

export default function Home() {
  return (
    <main className="space-y-12 lg:space-y-16">
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
