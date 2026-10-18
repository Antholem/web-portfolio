import Image from "next/image";

import { Card } from "@/components/ui/card";
import { siteConfig } from "@/constants/site";
import { hero } from "@/lib/data";

const str = (value: string) => (
  <span className="text-foreground">{`"${value}"`}</span>
);

function CodeCard() {
  return (
    <Card
      aria-hidden
      className="relative mx-3.5 -mt-18 overflow-hidden rounded-[14px] font-mono shadow-elevated sm:absolute sm:bottom-4 sm:left-4 sm:mx-0 sm:mt-0 sm:w-76 lg:bottom-11 lg:-left-11"
    >
      <div className="flex h-8.5 items-center gap-1.5 border-b border-border bg-surface px-3">
        <span className="size-2.25 rounded-full bg-input" />
        <span className="size-2.25 rounded-full bg-input" />
        <span className="size-2.25 rounded-full bg-input" />
        <span className="ml-2 text-[11px] text-subtle-foreground">
          sam.config.ts
        </span>
      </div>
      <div className="px-4 py-3.5 text-[12.5px] leading-[1.75] text-muted-foreground">
        <div>
          <span className="text-subtle-foreground">export const</span>{" "}
          <span className="text-foreground">sam</span> = {"{"}
        </div>
        <div className="pl-4">role: {str("Software Engineer")},</div>
        <div className="pl-4">
          stack: [{str("Next.js")}, {str("Node")}, {str("Postgres")}],
        </div>
        <div className="pl-4">focus: {str("scale × UX")},</div>
        <div className="pl-4">
          shipping: <span className="text-foreground">true</span>,
        </div>
        <div>{"};"}</div>
      </div>
    </Card>
  );
}

function HeroPortrait() {
  return (
    <div className="relative">
      <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-border shadow-elevated stage-backdrop">
        <Image
          src="/images/portrait-hero.png"
          alt={hero.portraitAlt}
          fill
          preload
          sizes="(min-width: 60rem) 480px, 100vw"
          className="object-cover object-[50%_6%]"
        />
        <div className="absolute inset-x-5 top-4.5 flex justify-between font-mono text-[11px] tracking-[0.06em] text-subtle-foreground">
          <span>{siteConfig.location.coordinates}</span>
          <span>{hero.portraitCaption}</span>
        </div>
      </div>
      <CodeCard />
    </div>
  );
}

export { HeroPortrait };
