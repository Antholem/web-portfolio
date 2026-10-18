import { PreviewFrame } from "./preview-frame";

function ForgePreview() {
  return (
    <PreviewFrame className="gap-3 p-3.5">
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md bg-foreground px-2.5 py-1.5 text-[9.5px] text-background">
          Primary
        </span>
        <span className="rounded-md border border-input px-2.5 py-1.5 text-[9.5px]">
          Outline
        </span>
        <span className="rounded-md px-2.5 py-1.5 text-[9.5px] text-muted-foreground">
          Ghost
        </span>
      </div>
      <div className="flex flex-col gap-1.25">
        <span className="text-[9px] font-medium">Email</span>
        <span className="flex h-6 items-center rounded-md border border-input px-2 text-[9px] text-subtle-foreground">
          you@company.com
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[9.5px]">
          <span className="relative inline-block h-3.75 w-6.5 rounded-full bg-foreground">
            <span className="absolute top-0.5 right-0.5 size-2.75 rounded-full bg-background" />
          </span>
          Dark mode
        </div>
        <div className="flex gap-1">
          <span className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[8.5px]">
            v2.4
          </span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[8.5px]">
            a11y
          </span>
        </div>
      </div>
      <div className="relative h-1 rounded-full bg-muted">
        <span className="absolute inset-y-0 left-0 w-[62%] rounded-full bg-foreground" />
      </div>
    </PreviewFrame>
  );
}

export { ForgePreview };
