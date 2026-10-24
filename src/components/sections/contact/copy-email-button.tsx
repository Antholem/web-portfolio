"use client";

import { Check, CircleAlert, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

function CopyEmailButton({ email }: { email: string }) {
  const { copied, failed, copy } = useCopyToClipboard();

  const label = copied
    ? "Email copied"
    : failed
      ? "Couldn’t copy email address"
      : "Copy email address";

  // Feedback is a snackbar (announced by Sonner's live region); the icon
  // and label mirror it briefly on the button itself.
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={async () => {
        if (await copy(email)) toast.success("Email copied to clipboard");
        else
          toast.error("Couldn’t copy email address", {
            description: "Select the address and copy it instead.",
          });
      }}
    >
      {copied ? (
        <Check strokeWidth={2} aria-hidden />
      ) : failed ? (
        <CircleAlert className="text-destructive" aria-hidden />
      ) : (
        <Copy aria-hidden />
      )}
    </Button>
  );
}

export { CopyEmailButton };
