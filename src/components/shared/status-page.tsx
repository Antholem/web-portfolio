import type { CSSProperties, ReactNode } from "react";

import { Container } from "@/components/shared/container";

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

type StatusPageProps = {
  code: string;
  eyebrow: string;
  heading: string;
  body: ReactNode;
  actions: ReactNode;
  children?: ReactNode;
};

function StatusPage({
  code,
  eyebrow,
  heading,
  body,
  actions,
  children,
}: StatusPageProps) {
  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-backdrop"
      />
      <Container className="relative flex min-h-[calc(100svh-4.25rem)] flex-col items-center justify-center gap-8 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none enter-fade season-wordmark text-[clamp(120px,26vw,260px)] leading-[0.8] font-semibold tracking-[-0.065em] text-outline select-none"
        >
          {code}
        </div>

        <div className="flex max-w-[52ch] flex-col items-center gap-4">
          <p
            style={delay(80)}
            className="enter font-mono text-[12px] tracking-[0.08em] text-subtle-foreground uppercase"
          >
            {eyebrow}
          </p>
          <h1
            style={delay(140)}
            className="enter text-[clamp(30px,4.4vw,48px)] leading-[1.05] font-semibold tracking-tighter text-balance"
          >
            {heading}
          </h1>
          <div
            style={delay(200)}
            className="enter text-[16px] leading-[1.6] text-pretty text-muted-foreground"
          >
            {body}
          </div>
        </div>

        <div
          style={delay(260)}
          className="flex enter flex-wrap justify-center gap-3"
        >
          {actions}
        </div>

        {children ? (
          <div style={delay(320)} className="enter">
            {children}
          </div>
        ) : null}
      </Container>
    </main>
  );
}

export { StatusPage };
