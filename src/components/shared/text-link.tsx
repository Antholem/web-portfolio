import * as React from "react";

import { cn } from "@/lib/utils";

/** Underlined inline link; the underline darkens to the foreground on hover. */
function TextLink({ className, ...props }: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "text-foreground underline decoration-input underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { TextLink };
