import type { CSSProperties } from "react";
import Image from "next/image";

import { SeasonDecor } from "@/components/seasonal/season-decor";
import { siteConfig } from "@/constants/site";
import { hero } from "@/lib/data";

function HeroPortrait() {
  return (
    <div
      className="relative enter-fade"
      style={{ "--enter-delay": "150ms" } as CSSProperties}
    >
      <SeasonDecor />
      {/* overflow-clip, not hidden: the shifted photo overflows by a few px and
          a hidden-overflow box can still be scrolled (e.g. by scrollIntoView). */}
      <div className="relative aspect-4/5 overflow-clip rounded-3xl border season-frame shadow-elevated stage-backdrop">
        <Image
          src="/images/portrait-hero.png"
          alt={hero.portraitAlt}
          fill
          preload
          sizes="(min-width: 60rem) 480px, 100vw"
          // The subject's head sits at 45.3% of the photo's width; shift it to
          // the frame's centre. The cut-out background keeps the edge seamless.
          className="translate-x-[4.7%] object-cover object-[50%_6%]"
        />
        <div className="absolute inset-x-5 top-4.5 flex justify-between font-mono text-[11px] tracking-[0.06em] text-subtle-foreground">
          <span>{siteConfig.location.coordinates}</span>
          <span>{hero.portraitCaption}</span>
        </div>
      </div>
    </div>
  );
}

export { HeroPortrait };
