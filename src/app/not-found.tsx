import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { StatusPage } from "@/components/shared/status-page";
import { Button } from "@/components/ui/button";
import { homeSection, NAV_ITEMS, SECTIONS } from "@/constants/navigation";
import { notFound } from "@/lib/data";

// Next adds `noindex` to not-found responses itself.
export const metadata: Metadata = { title: notFound.title };

export default function NotFound() {
  return (
    <StatusPage
      code={notFound.code}
      eyebrow={notFound.eyebrow}
      heading={notFound.heading}
      body={<p>{notFound.body}</p>}
      actions={
        <>
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
        </>
      }
    >
      <nav
        aria-label={notFound.jumpTo}
        className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-[14px]"
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
    </StatusPage>
  );
}
