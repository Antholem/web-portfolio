import * as React from "react";

import { cn } from "@/lib/utils";

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
