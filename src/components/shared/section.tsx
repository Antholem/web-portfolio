import * as React from "react";

import { cn } from "@/lib/utils";

import { Container } from "./container";

/** Page section: 120px vertical padding (80px on phones) around a container. */
function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("py-20 sm:py-30", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

export { Section };
