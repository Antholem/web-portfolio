import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";
import FooterSection from "@/components/footer-section";
import HeroSection from "@/components/hero-section";
import ProjectsSection from "@/components/projects-section";
import ServicesSection from "@/components/services-section";
import SkillsSection from "@/components/skills-section";

export default function Home() {
  return (
    <main className="space-y-2">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
