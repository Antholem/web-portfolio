import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { homeSection, NAV_ITEMS, SECTIONS } from "@/constants/navigation";
import { notFound } from "@/lib/data";

// Next adds `noindex` to not-found responses itself.
export const metadata: Metadata = { title: notFound.title };

const delay = (ms: number) => ({ "--enter-delay": `${ms}ms` }) as CSSProperties;

export default function NotFound() {
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
          {notFound.code}
        </div>

        <div className="flex max-w-[52ch] flex-col items-center gap-4">
          <p
            style={delay(80)}
            className="enter font-mono text-[12px] tracking-[0.08em] text-subtle-foreground uppercase"
          >
            {notFound.eyebrow}
          </p>
          <h1
            style={delay(140)}
            className="enter text-[clamp(30px,4.4vw,48px)] leading-[1.05] font-semibold tracking-tighter text-balance"
          >
            {notFound.heading}
          </h1>
          <p
            style={delay(200)}
            className="enter text-[16px] leading-[1.6] text-pretty text-muted-foreground"
          >
            {notFound.body}
          </p>
        </div>

        <div
          style={delay(260)}
          className="flex enter flex-wrap justify-center gap-3"
        >
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft aria-hidden className="nudge-x-back" />
              {notFound.home}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={homeSection(SECTIONS.contact.id)}>
              <Mail aria-hidden />
              {notFound.contact}
            </a>
          </Button>
        </div>

        <nav
          aria-label={notFound.jumpTo}
          style={delay(320)}
          className="flex enter flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[14px]"
        >
          <span className="mr-2 text-subtle-foreground">{notFound.jumpTo}</span>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-border px-3 py-1 text-muted-foreground transition-colors hover:border-input hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </main>
  );
}
