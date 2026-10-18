import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full rounded-[10px] border border-input bg-background px-3.5 text-[15px] leading-[1.2] text-foreground transition-[border-color,box-shadow] duration-150 ease-[ease] placeholder:text-subtle-foreground",
        "focus:border-ring focus:ring-3 focus:ring-focus-halo focus:outline-none",
        "aria-invalid:border-destructive",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
