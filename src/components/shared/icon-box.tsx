import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function IconBox({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-border bg-surface text-foreground",
        className,
      )}
    >
      <Icon size={18} aria-hidden />
    </span>
  );
}

export { IconBox };
