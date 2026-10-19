"use client";

import { Check, CircleAlert, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

function CopyEmailButton({ email }: { email: string }) {
  const { copied, failed, copy } = useCopyToClipboard();

  const label = copied
    ? "Email copied"
    : failed
      ? "Couldn’t copy email address"
      : "Copy email address";

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={label}
        onClick={() => copy(email)}
      >
        {copied ? (
          <Check strokeWidth={2} aria-hidden />
        ) : failed ? (
          <CircleAlert className="text-destructive" aria-hidden />
        ) : (
          <Copy aria-hidden />
        )}
      </Button>
      <span role="status" className="sr-only">
        {copied
          ? "Email copied to clipboard"
          : failed
            ? "Couldn’t copy — select the address instead"
            : ""}
      </span>
    </>
  );
}

export { CopyEmailButton };
