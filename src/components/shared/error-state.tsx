"use client";

import { useEffect } from "react";
import { ArrowLeft, Mail, RotateCcw } from "lucide-react";

import { StatusPage } from "@/components/shared/status-page";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { errorPage } from "@/lib/data";

type ErrorStateProps = {
  error: unknown;
  retry: () => void;
};

/** Server errors reach the client as a generic Error plus a `digest` that matches the server log. */
const digestOf = (error: unknown) =>
  error instanceof Error &&
  "digest" in error &&
  typeof error.digest === "string"
    ? error.digest
    : undefined;

/** Shared by `error.tsx` (inside the site chrome) and `global-error.tsx` (replacing it). */
function ErrorState({ error, retry }: ErrorStateProps) {
  const digest = digestOf(error);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const subject = encodeURIComponent(
    `Portfolio error${digest ? ` (${digest})` : ""}`,
  );

  return (
    <StatusPage
      code={errorPage.code}
      eyebrow={errorPage.eyebrow}
      heading={errorPage.heading}
      body={
        <>
          <p>{errorPage.body}</p>
          {digest ? (
            <p className="mt-3 font-mono text-[12px] text-subtle-foreground">
              {errorPage.reference}: {digest}
            </p>
          ) : null}
        </>
      }
      actions={
        <>
          <Button size="lg" onClick={() => retry()}>
            <RotateCcw aria-hidden />
            {errorPage.retry}
          </Button>
          <Button asChild variant="outline" size="lg">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full load, since the app shell may be what failed. */}
            <a href="/">
              <ArrowLeft aria-hidden className="nudge-x-back" />
              {errorPage.home}
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a href={`mailto:${siteConfig.email}?subject=${subject}`}>
              <Mail aria-hidden />
              {errorPage.email}
            </a>
          </Button>
        </>
      }
    />
  );
}

export { ErrorState };
