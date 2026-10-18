import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Clock, Download, Mail, MapPin } from "lucide-react";

import { GitHubIcon, LinkedInIcon } from "@/components/icons/brand-icons";
import { Container } from "@/components/shared/container";
import { StatusDot } from "@/components/shared/status-dot";
import { HighlightedText, Lead } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { SECTIONS } from "@/constants/navigation";
import { siteConfig } from "@/constants/site";
import { hero } from "@/lib/data";

import { HeroPortrait } from "./hero-portrait";

function MetaItem({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <p className="flex items-center gap-2 text-[14px] text-muted-foreground">
      <Icon size={16} aria-hidden />
      {children}
    </p>
  );
}

const ctaClass = "flex-[1_1_100%] sm:flex-initial";

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-backdrop"
      />

      <Container className="relative grid grid-cols-1 items-center gap-12 pt-22 pb-24 md:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] md:gap-18">
        <div className="flex flex-col gap-7">
          <p className="inline-flex h-8 items-center gap-2.5 self-start rounded-full border border-border bg-card pr-3.5 pl-3 text-[13px] text-muted-foreground">
            <StatusDot pulse />
            {hero.availability}
          </p>

          <div className="flex flex-col gap-5">
            <h1 className="text-[clamp(46px,6.2vw,86px)] leading-[0.96] font-semibold tracking-tighter">
              <span className="block">{hero.nameLines[0]}</span>{" "}
              <span className="block text-muted-foreground">
                {hero.nameLines[1]}
              </span>
            </h1>
            <p className="max-w-[34ch] text-[clamp(19px,1.7vw,23px)] leading-[1.45] tracking-[-0.015em] text-pretty text-muted-foreground">
              <HighlightedText text={hero.tagline} />
            </p>
            <Lead className="max-w-[50ch]">{hero.summary}</Lead>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className={ctaClass}>
              <a href={`#${SECTIONS.work.id}`}>
                View projects
                <ArrowRight aria-hidden />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className={ctaClass}>
              <a href={siteConfig.links.resume}>
                <Download aria-hidden />
                Download résumé
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-5 border-t border-border pt-6">
            <MetaItem icon={MapPin}>{siteConfig.location.short}</MetaItem>
            <MetaItem icon={Clock}>{siteConfig.location.timezone}</MetaItem>
            <div className="ml-auto flex items-center gap-1">
              <Button asChild variant="ghost" size="icon">
                <a href={siteConfig.links.github} aria-label="GitHub">
                  <GitHubIcon />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a href={siteConfig.links.linkedin} aria-label="LinkedIn">
                  <LinkedInIcon />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a href={`mailto:${siteConfig.email}`} aria-label="Email">
                  <Mail aria-hidden />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <HeroPortrait />
      </Container>
    </section>
  );
}

export { HeroSection };
