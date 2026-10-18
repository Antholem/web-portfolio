import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

type CardProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
  /** Strengthens the border on hover — the only hover treatment cards get. */
  interactive?: boolean;
};

function Card({
  className,
  asChild = false,
  interactive = false,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="card"
      className={cn(
        "rounded-2xl border border-border bg-card text-card-foreground",
        interactive &&
          "transition-[border-color] duration-200 ease-[ease] hover:border-input",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
