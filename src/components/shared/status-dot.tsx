import { cn } from "@/lib/utils";

function StatusDot({
  pulse = false,
  className,
}: {
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative size-2 shrink-0 rounded-full bg-success",
        pulse &&
          "before:absolute before:inset-0 before:animate-status-pulse before:rounded-full before:bg-success motion-reduce:before:hidden",
        className,
      )}
    />
  );
}

export { StatusDot };
