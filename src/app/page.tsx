import ContactSection from "@/components/contact-section";
import HeroSection from "@/components/hero-section";
import ProjectsSection from "@/components/projects-section";
import ServicesSection from "@/components/services-section";
import SkillsSection from "@/components/skills-section";

export default function Home() {
  return (
    <main className="space-y-2">
      <HeroSection />
      <ServicesSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </main>
  );
}
