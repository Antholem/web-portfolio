import ContactSection from "@/components/contact-section";
import ProjectsSection from "@/components/projects-section";
import SkillsSection from "@/components/skills-section";

export default function Home() {
  return (
    <main className="space-y-2">
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
