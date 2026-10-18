import { StatusDot } from "@/components/shared/status-dot";
import { cn } from "@/lib/utils";

const navItems = [
  "Overview",
  "Transactions",
  "Reconcile",
  "Reports",
  "Settings",
];

const stats = [
  { label: "Settled today", value: "$1.24M" },
  { label: "Pending", value: "318" },
  { label: "Unmatched", value: "12" },
];

const rows = [
  { source: "Stripe payout", status: "Matched", amount: "48,210.00" },
  { source: "Invoice INV-2291", status: "Pending", amount: "3,940.50" },
  { source: "Bank feed · BPI", status: "Matched", amount: "12,005.00" },
];

const chartLine =
  "0,70 20,64 40,66 60,55 80,58 100,47 120,50 140,40 160,44 180,33 200,36 220,26 240,30 260,19 280,22 300,12";
const chartArea =
  "M0 70 L20 64 L40 66 L60 55 L80 58 L100 47 L120 50 L140 40 L160 44 L180 33 L200 36 L220 26 L240 30 L260 19 L280 22 L300 12 L300 84 L0 84 Z";

const rowClass =
  "grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 px-0.5 py-1.75";

function LedgerlinePreview() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-input bg-card shadow-elevated">
      <div className="flex h-8.5 items-center gap-1.5 border-b border-border bg-surface px-3">
        <span className="size-2 rounded-full bg-input" />
        <span className="size-2 rounded-full bg-input" />
        <span className="size-2 rounded-full bg-input" />
        <span className="ml-2.5 rounded-md bg-muted px-2.5 py-0.75 font-mono text-[10.5px] text-subtle-foreground">
          ledgerline.app/overview
        </span>
      </div>

      <div className="grid min-h-82.5 grid-cols-1 sm:grid-cols-[118px_minmax(0,1fr)]">
        <div className="hidden flex-col gap-1 border-r border-border px-2.5 py-3.5 text-[11px] text-muted-foreground sm:flex">
          <div className="flex items-center gap-1.5 px-1.5 pt-1 pb-3 text-[11.5px] font-semibold text-foreground">
            <span className="size-3.5 rounded bg-foreground" />
            Ledgerline
          </div>
          {navItems.map((item, i) => (
            <div
              key={item}
              className={cn(
                "px-2 py-1.5",
                i === 0 && "rounded-md bg-muted text-foreground",
              )}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="flex min-w-0 flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold">Overview</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.75 font-mono text-[10px] text-muted-foreground">
              <StatusDot className="size-1.5" />
              LIVE
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 rounded-lg border border-border p-2.5"
              >
                <span className="text-[9.5px] text-subtle-foreground">
                  {stat.label}
                </span>
                <span className="text-[15px] font-semibold tracking-[-0.02em]">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border px-2.5 pt-2.5 pb-1 text-foreground">
            <div className="mb-1.5 flex justify-between text-[9.5px] text-subtle-foreground">
              <span>Volume · 30 days</span>
              <span className="font-mono">USD</span>
            </div>
            <svg
              viewBox="0 0 300 84"
              preserveAspectRatio="none"
              className="block h-21 w-full"
            >
              <line
                x1="0"
                y1="21"
                x2="300"
                y2="21"
                stroke="currentColor"
                strokeOpacity="0.08"
              />
              <line
                x1="0"
                y1="42"
                x2="300"
                y2="42"
                stroke="currentColor"
                strokeOpacity="0.08"
              />
              <line
                x1="0"
                y1="63"
                x2="300"
                y2="63"
                stroke="currentColor"
                strokeOpacity="0.08"
              />
              <path d={chartArea} fill="currentColor" fillOpacity="0.07" />
              <polyline
                points={chartLine}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="flex flex-col text-[10.5px]">
            <div
              className={cn(
                rowClass,
                "border-b border-border text-subtle-foreground",
              )}
            >
              <span>Source</span>
              <span>Status</span>
              <span className="text-right">Amount</span>
            </div>
            {rows.map((row, i) => (
              <div
                key={row.source}
                className={cn(
                  rowClass,
                  i < rows.length - 1 && "border-b border-border",
                )}
              >
                <span>{row.source}</span>
                <span className="text-muted-foreground">{row.status}</span>
                <span className="text-right font-mono">{row.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { LedgerlinePreview };
