import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

type CardProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
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
          "transition-[border-color,translate] duration-200 ease-[ease] hover:-translate-y-0.5 hover:border-input motion-reduce:hover:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
