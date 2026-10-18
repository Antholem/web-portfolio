import * as React from "react";

import { cn } from "@/lib/utils";

/** Geist Mono 12px, uppercase, +0.08em — e.g. `01 / About`. */
function Eyebrow({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-mono text-[12px] tracking-[0.08em] text-subtle-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}

/** H2 · Section — clamp(32–52) / 1.06 / −0.035em / 600. */
function SectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-[clamp(32px,4.1vw,52px)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance",
        className,
      )}
      {...props}
    />
  );
}

/** Lead paragraph — 17px / 1.65, muted. */
function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-[17px] leading-[1.65] text-pretty text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Renders `**phrase**` in the foreground colour; the rest inherits. */
function HighlightedText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-foreground">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export { Eyebrow, HighlightedText, Lead, SectionTitle };
