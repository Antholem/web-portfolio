import { IconBox } from "@/components/shared/icon-box";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { TagList } from "@/components/shared/tag";
import { Lead, SectionTitle } from "@/components/shared/typography";
import { Card } from "@/components/ui/card";
import { SECTIONS } from "@/constants/navigation";
import { stack } from "@/lib/data";
import { padIndex } from "@/lib/utils";

function StackSection() {
  const { id, index, eyebrow } = SECTIONS.stack;

  return (
    <Section id={id}>
      <SectionHeader index={index} label={eyebrow} />
      <div className="reveal mb-12 flex flex-wrap items-end justify-between gap-6">
        <SectionTitle className="max-w-[18ch]">{stack.title}</SectionTitle>
        <Lead className="max-w-[40ch]">{stack.lead}</Lead>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-4">
        {stack.groups.map((group) => (
          <Card
            key={group.title}
            asChild
            interactive
            className="reveal flex flex-col gap-6 p-7"
          >
            <li>
              <div className="flex items-center justify-between">
                <IconBox icon={group.icon} />
                <span className="font-mono text-[12px] text-subtle-foreground">
                  <span aria-hidden>{padIndex(group.tools.length)}</span>
                  <span className="sr-only">{group.tools.length} tools</span>
                </span>
              </div>
              <h3 className="text-[18px] font-semibold tracking-[-0.015em]">
                {group.title}
              </h3>
              <TagList tags={group.tools} />
            </li>
          </Card>
        ))}
      </ul>
    </Section>
  );
}

export { StackSection };
