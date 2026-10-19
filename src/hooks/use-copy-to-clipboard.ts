"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

export function useCopyToClipboard(resetAfterMs = 1600) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(timeout.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      let ok = true;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        ok = false;
      }
      // The write can settle after unmount; scheduling a reset then would leak.
      if (!mounted.current) return ok;

      setStatus(ok ? "copied" : "failed");
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setStatus("idle"), resetAfterMs);
      return ok;
    },
    [resetAfterMs],
  );

  return { copied: status === "copied", failed: status === "failed", copy };
}
