import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { TagList } from "@/components/shared/tag";
import { SectionTitle } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { SECTIONS } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { experience } from "@/lib/data";

function ExperienceSection() {
  const { id, index, eyebrow } = SECTIONS.experience;

  return (
    <Section id={id} className="border-y border-border bg-card">
      <SectionHeader index={index} label={eyebrow} />
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <SectionTitle className="max-w-[16ch]">{experience.title}</SectionTitle>
        <Button asChild variant="outline">
          <a href={siteConfig.links.resume}>
            Full résumé
            <ArrowUpRight aria-hidden />
          </a>
        </Button>
      </div>

      <ol>
        {experience.items.map((item) => (
          <li
            key={`${item.role}-${item.period}`}
            className="grid grid-cols-1 gap-3 border-t border-border py-8 last:border-b md:grid-cols-[200px_minmax(0,1fr)_minmax(0,1.3fr)] md:gap-10"
          >
            <p className="pt-1 font-mono text-[13px] text-subtle-foreground">
              {item.period}
            </p>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[20px] font-semibold tracking-[-0.02em]">
                {item.role}
              </h3>
              <p className="text-[15px] text-muted-foreground">
                {[item.organization, ...item.details].join(" · ")}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-[15px] leading-[1.65] text-muted-foreground">
                {item.summary}
              </p>
              <TagList tags={item.tags} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export { ExperienceSection };
