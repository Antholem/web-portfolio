import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { StackSection } from "@/components/sections/stack-section";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { WorkSection } from "@/components/sections/work/work-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TechMarquee />
      <AboutSection />
      <ExperienceSection />
      <StackSection />
      <ServicesSection />
      <WorkSection />
      <ContactSection />
    </main>
  );
}
