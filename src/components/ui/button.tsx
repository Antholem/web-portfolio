import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 border border-transparent leading-none font-medium tracking-[-0.005em] whitespace-nowrap transition-[background-color,border-color,color,translate] duration-150 ease-[ease] active:translate-y-px disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        outline: "border-input bg-transparent text-foreground hover:bg-accent",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
        link: "border-0 bg-transparent text-foreground underline decoration-input underline-offset-4 hover:decoration-foreground",
        destructive:
          "bg-destructive-solid text-white hover:bg-destructive-solid-hover",
      },
      size: {
        default: "h-11 rounded-[10px] px-4.5 text-[14px]",
        sm: "h-9 rounded-lg px-3.5 text-[13px]",
        lg: "h-13 rounded-xl px-6 text-[15px]",
        icon: "size-10 rounded-[10px] p-0",
        "icon-sm": "size-9 rounded-lg p-0",
      },
    },
    compoundVariants: [
      { variant: "link", className: "h-auto rounded-none p-0" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, type ButtonProps };
