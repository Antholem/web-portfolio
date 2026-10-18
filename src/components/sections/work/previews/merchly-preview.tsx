import { cn } from "@/lib/utils";

import { PreviewFrame } from "./preview-frame";

const products = [
  {
    name: "Field Cap",
    price: "$28",
    shape: "aspect-square w-[42%] rounded-full",
  },
  { name: "Canvas Tote", price: "$38", shape: "h-[52%] w-[40%] rounded-sm" },
  {
    name: "Steel Bottle",
    price: "$24",
    shape: "h-[56%] w-[30%] rounded-[10px_10px_4px_4px]",
  },
];

function MerchlyPreview() {
  return (
    <PreviewFrame className="gap-2.5 p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[-0.01em]">
          merchly
        </span>
        <div className="flex items-center gap-1.5">
          <span className="h-4.5 w-16 rounded-[5px] bg-muted" />
          <span className="rounded-full bg-foreground px-1.75 py-0.75 font-mono text-[9px] text-background">
            Cart · 2
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {products.map((product) => (
          <div key={product.name} className="flex flex-col gap-1.25">
            <div className="flex aspect-square items-center justify-center rounded-md bg-muted">
              <span
                className={cn("border-[1.5px] border-input", product.shape)}
              />
            </div>
            <span className="text-[9px]">{product.name}</span>
            <span className="font-mono text-[8.5px] text-subtle-foreground">
              {product.price}
            </span>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

export { MerchlyPreview };
