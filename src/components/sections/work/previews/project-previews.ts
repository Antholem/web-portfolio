import type { ComponentType } from "react";

import type { ProjectPreviewKey } from "@/types/content";

import { ForgePreview } from "./forge-preview";
import { LedgerlinePreview } from "./ledgerline-preview";
import { MerchlyPreview } from "./merchly-preview";
import { RelayPreview } from "./relay-preview";

/** Maps a project's slug (from `lib/data.ts`) to its illustrative UI preview. */
export const PROJECT_PREVIEWS: Record<ProjectPreviewKey, ComponentType> = {
  ledgerline: LedgerlinePreview,
  merchly: MerchlyPreview,
  relay: RelayPreview,
  forge: ForgePreview,
};
