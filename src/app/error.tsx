"use client";

import { ErrorState } from "@/components/shared/error-state";
import { siteConfig } from "@/constants/site";
import { errorPage } from "@/lib/data";

// Error boundaries are client components, so no `metadata` export: React 19
// hoists this <title> into <head>.
export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <>
      <title>{`${errorPage.title} · ${siteConfig.name}`}</title>
      <ErrorState error={error} retry={retry} />
    </>
  );
}
