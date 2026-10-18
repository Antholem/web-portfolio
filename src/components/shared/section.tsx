import * as React from "react";

import { cn } from "@/lib/utils";

import { Container } from "./container";

function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("py-20 render-when-visible sm:py-30", className)}
      {...props}
    >
      <Container>{children}</Container>
    </section>
  );
}

export { Section };
