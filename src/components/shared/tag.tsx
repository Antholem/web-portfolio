import * as React from "react";

import { cn } from "@/lib/utils";

function Tag({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex h-6.5 items-center rounded-full border border-border bg-surface px-2.5 font-mono text-[12px] whitespace-nowrap text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function TagList({
  tags,
  className,
}: {
  tags: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <li key={tag} className="flex">
          <Tag>{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}

export { Tag, TagList };
