import { CheckList } from "@/components/shared/check-list";
import { IconBox } from "@/components/shared/icon-box";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { SectionTitle } from "@/components/shared/typography";
import { Card } from "@/components/ui/card";
import { SECTIONS } from "@/constants/navigation";
import { services } from "@/lib/data";
import { padIndex } from "@/lib/utils";

function ServicesSection() {
  const { id, index, eyebrow } = SECTIONS.services;

  return (
    <Section id={id} className="border-t border-border">
      <SectionHeader index={index} label={eyebrow} />
      <SectionTitle className="reveal mb-12 max-w-[20ch]">
        {services.title}
      </SectionTitle>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-4">
        {services.items.map((service, i) => (
          <Card
            key={service.title}
            asChild
            interactive
            className="reveal flex flex-col gap-7 p-8"
          >
            <article>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-subtle-foreground">
                  S—{padIndex(i + 1)}
                </span>
                <IconBox icon={service.icon} />
              </div>
              <div className="flex flex-col gap-2.5">
                <h3 className="text-[22px] font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-muted-foreground">
                  {service.description}
                </p>
              </div>
              <CheckList
                items={service.features}
                className="gap-3 border-t border-border pt-6 text-foreground"
              />
            </article>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export { ServicesSection };
