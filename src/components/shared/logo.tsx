import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const SA_MONOGRAM_RATIO = 618 / 521;

type SaMonogramProps = {
  /** Rendered height in px — 56 hero · 40 footer · 30 nav · 20 min. */
  height: number;
  alt?: string;
  className?: string;
};

/** Personal SA monogram (black PNG), inverted in dark mode. */
function SaMonogram({ height, alt = "", className }: SaMonogramProps) {
  return (
    <Image
      src="/images/logo-sa.png"
      alt={alt}
      width={Math.round(height * SA_MONOGRAM_RATIO)}
      height={height}
      className={cn("block shrink-0 dark:invert", className)}
    />
  );
}

type AntholemMarkProps = React.ComponentProps<"svg"> & {
  /** Accessible name; omit when the mark sits next to visible text. */
  title?: string;
};

/**
 * The Antholem "A" drawn as the corner of a cube. One flat `currentColor`
 * shape, so it follows the foreground token in both themes. 16px minimum.
 */
function AntholemMark({ title, className, ...props }: AntholemMarkProps) {
  return (
    <svg
      viewBox="4 4 56 56"
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={cn("shrink-0", className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M4 60V20L30.5 4.86V16.86L15 25.71V60Z" />
      <path d="M60 60V20L33.5 4.86V16.86L49 25.71V60Z" />
      <path d="M15 40L30.5 31.14V40.14L15 49Z" />
      <path d="M49 40L33.5 31.14V40.14L49 49Z" />
    </svg>
  );
}

export { AntholemMark, SaMonogram };
