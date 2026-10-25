"use client";

import { CircleCheck, Info, LoaderCircle, TriangleAlert } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme === "light" ? "light" : "dark"}
      position="bottom-right"
      gap={10}
      icons={{
        success: <CircleCheck size={18} className="text-success" />,
        error: <TriangleAlert size={18} className="text-destructive" />,
        info: <Info size={18} />,
        loading: <LoaderCircle size={18} className="animate-spin" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-start gap-3 rounded-xl border border-input bg-card px-4 py-3.5 text-foreground shadow-elevated sm:w-90",
          icon: "mt-px shrink-0",
          content: "flex min-w-0 flex-col gap-1",
          title: "text-[14px] leading-snug font-semibold",
          description: "text-[13.5px] leading-[1.55] text-muted-foreground",
          error: "[&_[data-title]]:text-destructive",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
