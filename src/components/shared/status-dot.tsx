import { cn } from "@/lib/utils";

/** Green status dot — the only hue in the system, and the only animated status. */
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
        "size-2 shrink-0 rounded-full bg-success",
        pulse && "animate-status-pulse motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export { StatusDot };
