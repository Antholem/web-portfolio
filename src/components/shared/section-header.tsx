import { cn } from "@/lib/utils";

import { Eyebrow } from "./typography";

type SectionHeaderProps = {
  index: string;
  label: string;
  className?: string;
};

function SectionHeader({ index, label, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-14 flex items-center gap-4", className)}>
      <Eyebrow>
        {index} / {label}
      </Eyebrow>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
}

export { SectionHeader };
