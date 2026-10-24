import { GitHubIcon } from "@/components/icons/brand-icons";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { SectionTitle } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { SECTIONS } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { work } from "@/lib/data";

import { FeaturedProjectCard } from "./featured-project-card";

function WorkSection() {
  const { id, index, eyebrow } = SECTIONS.work;

  return (
    <Section id={id} className="border-y border-border bg-card">
      <SectionHeader index={index} label={eyebrow} />
      <SectionTitle className="reveal mb-10 max-w-[16ch]">
        {work.title}
      </SectionTitle>
      <div className="reveal">
        <FeaturedProjectCard project={work.project} />
      </div>
      <div className="mt-12 flex justify-center">
        <Button asChild variant="outline">
          <a href={siteConfig.links.github}>
            <GitHubIcon />
            More on GitHub
          </a>
        </Button>
      </div>
    </Section>
  );
}

export { WorkSection };
