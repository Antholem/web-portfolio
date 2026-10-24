import { IconBox } from "@/components/shared/icon-box";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import {
  HighlightedText,
  Lead,
  SectionTitle,
} from "@/components/shared/typography";
import { Card } from "@/components/ui/card";
import { SECTIONS } from "@/constants/navigation";
import { about } from "@/lib/data";

function AboutSection() {
  const { id, index, eyebrow } = SECTIONS.about;

  return (
    <Section id={id}>
      <SectionHeader index={index} label={eyebrow} />
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-18">
        <div className="reveal flex flex-col gap-5">
          <SectionTitle>{about.title}</SectionTitle>
          <Lead>{about.lead}</Lead>
        </div>

        <div className="flex flex-col gap-10">
          <div className="reveal flex flex-col gap-4.5 text-[18px] leading-[1.7] text-pretty text-muted-foreground">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>
                <HighlightedText text={paragraph} />
              </p>
            ))}
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {about.focusAreas.map((area) => (
              <Card
                key={area.title}
                asChild
                interactive
                className="reveal flex flex-col gap-4 p-6"
              >
                <li>
                  <IconBox icon={area.icon} />
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[16px] font-semibold tracking-[-0.01em]">
                      {area.title}
                    </h3>
                    <p className="text-[14px] leading-[1.6] text-muted-foreground">
                      {area.description}
                    </p>
                  </div>
                </li>
              </Card>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export { AboutSection };
