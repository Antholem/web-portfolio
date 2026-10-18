import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Borderless by design: it sits inside a bordered box that also holds the
 * character count and actions, and that box owns the focus treatment.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "block min-h-24 w-full resize-y border-0 bg-transparent px-3.5 py-3 text-[15px] leading-[1.55] text-foreground placeholder:text-subtle-foreground focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
