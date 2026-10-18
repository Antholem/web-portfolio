import * as React from "react";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  );
}

function FieldError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  if (!children) return null;

  return (
    <p
      data-slot="field-error"
      className={cn(
        "flex items-center gap-1.5 text-[12.5px] text-destructive",
        className,
      )}
      {...props}
    >
      <CircleAlert className="size-3.5" strokeWidth={2} aria-hidden />
      {children}
    </p>
  );
}

export { Field, FieldError };
