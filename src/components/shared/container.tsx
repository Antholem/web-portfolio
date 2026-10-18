import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & { asChild?: boolean };

/** 1200px max width, 24px gutters (20px on phones). */
function Container({ className, asChild = false, ...props }: ContainerProps) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      className={cn("mx-auto w-full max-w-300 px-5 sm:px-6", className)}
      {...props}
    />
  );
}

export { Container };
