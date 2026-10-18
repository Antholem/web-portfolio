import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

function CheckList({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col text-[14px]", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <Check
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            strokeWidth={2}
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export { CheckList };
