import { PreviewFrame } from "./preview-frame";

function RelayPreview() {
  return (
    <PreviewFrame className="gap-2.25 p-3">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold">
        <span className="size-3.5 rounded border-[1.5px] border-foreground" />
        Relay
        <span className="font-mono text-[9px] font-normal text-subtle-foreground">
          · Ticket #4821
        </span>
      </div>
      <div className="max-w-[80%] self-start rounded-lg bg-muted px-2.25 py-1.75 text-[10px] leading-[1.45]">
        Can I switch plans in the middle of a billing cycle?
      </div>
      <div className="flex max-w-[86%] flex-col gap-1.5 self-end rounded-lg border border-input px-2.5 py-2 text-[10px] leading-[1.45]">
        <span className="flex items-center gap-1 font-mono text-[8.5px] text-subtle-foreground">
          ✦ DRAFT
        </span>
        Yes — upgrades apply right away and are prorated on your next invoice.
        <span className="flex gap-1">
          <span className="rounded bg-muted px-1.25 py-0.5 font-mono text-[8px]">
            billing.md
          </span>
          <span className="rounded bg-muted px-1.25 py-0.5 font-mono text-[8px]">
            #3907
          </span>
        </span>
      </div>
      <div className="flex justify-end gap-1.5">
        <span className="rounded-[5px] border border-border px-2 py-1 text-[9px]">
          Regenerate
        </span>
        <span className="rounded-[5px] bg-foreground px-2 py-1 text-[9px] text-background">
          Insert draft
        </span>
      </div>
    </PreviewFrame>
  );
}

export { RelayPreview };
