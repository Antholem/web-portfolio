import type { Metadata } from "next";

import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { StackSection } from "@/components/sections/stack-section";
import { TechMarquee } from "@/components/sections/tech-marquee";
import { WorkSection } from "@/components/sections/work/work-section";
import { baseOpenGraph } from "@/lib/metadata";
import { buildStructuredData, toJsonLd } from "@/lib/structured-data";

// Canonical lives here, not in the layout, so the 404 does not claim "/".
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, url: "/" },
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(buildStructuredData()) }}
      />
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
