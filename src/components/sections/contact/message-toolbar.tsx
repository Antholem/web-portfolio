"use client";

import { Bold, Italic, List, ListOrdered, type LucideIcon } from "lucide-react";
import { Toolbar } from "radix-ui";

import { buttonVariants } from "@/components/ui/button";
import type { FormatAction } from "@/hooks/use-text-formatting";
import { cn } from "@/lib/utils";

type ToolbarAction = {
  action: FormatAction;
  label: string;
  icon: LucideIcon;
  shortcut?: string;
};

const GROUPS: ToolbarAction[][] = [
  [
    { action: "bold", label: "Bold", icon: Bold, shortcut: "B" },
    { action: "italic", label: "Italic", icon: Italic, shortcut: "I" },
  ],
  [
    { action: "bullet", label: "Bulleted list", icon: List },
    { action: "ordered", label: "Numbered list", icon: ListOrdered },
  ],
];

type MessageToolbarProps = {
  controls: string;
  disabled?: boolean;
  onAction: (action: FormatAction) => void;
};

function MessageToolbar({ controls, disabled, onAction }: MessageToolbarProps) {
  return (
    <Toolbar.Root
      aria-label="Text formatting"
      aria-controls={controls}
      className="flex items-center gap-0.5 border-b border-border px-1.5 py-1"
    >
      {GROUPS.map((group, index) => (
        <div key={index} className="contents">
          {index > 0 ? (
            <Toolbar.Separator className="mx-1 h-4 w-px bg-border" />
          ) : null}
          {group.map(({ action, label, icon: Icon, shortcut }) => (
            <Toolbar.Button
              key={action}
              type="button"
              aria-label={label}
              aria-keyshortcuts={
                shortcut ? `Control+${shortcut} Meta+${shortcut}` : undefined
              }
              title={shortcut ? `${label} (Ctrl/⌘+${shortcut})` : label}
              disabled={disabled}
              // Keep focus (and the selection) in the textarea on mouse use.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onAction(action)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "size-8 rounded-md",
              )}
            >
              <Icon aria-hidden />
            </Toolbar.Button>
          ))}
        </div>
      ))}
    </Toolbar.Root>
  );
}

export { MessageToolbar };
