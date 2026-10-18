import * as React from "react";

import { cn } from "@/lib/utils";

function PreviewFrame({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-49 flex-col overflow-hidden rounded-t-[10px] border border-b-0 border-input bg-card",
        className,
      )}
      {...props}
    />
  );
}

export { PreviewFrame };
