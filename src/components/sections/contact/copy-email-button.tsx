"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

function CopyEmailButton({ email }: { email: string }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={copied ? "Email copied" : "Copy email address"}
        onClick={() => copy(email)}
      >
        {copied ? <Check strokeWidth={2} aria-hidden /> : <Copy aria-hidden />}
      </Button>
      <span role="status" className="sr-only">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </>
  );
}

export { CopyEmailButton };
