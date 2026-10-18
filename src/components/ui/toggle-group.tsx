"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const toggleGroupVariants = cva("flex flex-wrap", {
  variants: {
    variant: {
      segmented: "gap-1 rounded-xl border border-border bg-muted p-1",
      chip: "gap-2",
    },
  },
  defaultVariants: { variant: "segmented" },
});

const toggleGroupItemVariants = cva(
  "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 px-3.5 text-[13px] leading-none font-medium text-muted-foreground transition-[background-color,border-color,color,box-shadow] duration-150 hover:not-data-[state=on]:text-foreground",
  {
    variants: {
      variant: {
        segmented:
          "rounded-lg border-0 bg-transparent data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:ring-1 data-[state=on]:ring-input",
        chip: "rounded-full border border-input bg-transparent data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background",
      },
    },
    defaultVariants: { variant: "segmented" },
  },
);

type ToggleGroupVariant = VariantProps<typeof toggleGroupVariants>["variant"];

const ToggleGroupContext = React.createContext<ToggleGroupVariant>("segmented");

function ToggleGroup({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleGroupVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(toggleGroupVariants({ variant }), className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={variant}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const variant = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(toggleGroupItemVariants({ variant }), className)}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
