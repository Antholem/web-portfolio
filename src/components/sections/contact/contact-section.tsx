import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Mail, MapPin, Phone } from "lucide-react";

import { IconBox } from "@/components/shared/icon-box";
import { Section } from "@/components/shared/section";
import { SectionHeader } from "@/components/shared/section-header";
import { Eyebrow, Lead, SectionTitle } from "@/components/shared/typography";
import { Card } from "@/components/ui/card";
import { SECTIONS } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { contact } from "@/lib/data";

import { ContactForm } from "./contact-form";
import { CopyEmailButton } from "./copy-email-button";

type ContactRowProps = {
  icon: LucideIcon;
  label: string;
  action?: ReactNode;
  children: ReactNode;
};

function ContactRow({ icon, label, action, children }: ContactRowProps) {
  return (
    <li className="flex items-center gap-4 border-b border-border py-4.5">
      <IconBox icon={icon} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Eyebrow className="text-[11px]">{label}</Eyebrow>
        {children}
      </div>
      {action}
    </li>
  );
}

function ContactSection() {
  const { id, index, eyebrow } = SECTIONS.contact;

  return (
    <Section id={id}>
      <SectionHeader index={index} label={eyebrow} />
      <div className="grid grid-cols-1 items-stretch gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-18">
        <div className="reveal flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <SectionTitle>{contact.title}</SectionTitle>
            <Lead>{contact.lead}</Lead>
          </div>
          <ul className="flex flex-col border-t border-border">
            <ContactRow
              icon={Mail}
              label="Email"
              action={<CopyEmailButton email={siteConfig.email} />}
            >
              <a
                href={`mailto:${siteConfig.email}`}
                className="truncate text-[15px]"
              >
                {siteConfig.email}
              </a>
            </ContactRow>
            <ContactRow icon={Phone} label="Phone">
              <a href={siteConfig.phone.href} className="text-[15px]">
                {siteConfig.phone.display}
              </a>
            </ContactRow>
            <ContactRow icon={MapPin} label="Based in">
              <span className="text-[15px]">{siteConfig.location.full}</span>
            </ContactRow>
          </ul>
        </div>

        <Card className="reveal p-8 shadow-elevated">
          <ContactForm />
        </Card>
      </div>
    </Section>
  );
}

export { ContactSection };
