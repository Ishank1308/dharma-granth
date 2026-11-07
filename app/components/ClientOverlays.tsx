"use client";

import dynamic from "next/dynamic";
import { retryImport } from "@/lib/retry-import";

// Browser-only overlays. Next 15 allows `ssr: false` only inside Client Components,
// so the root layout imports them from here.
export const MananaSelectionBar = dynamic(
  () => retryImport(() => import("@/app/components/reader/MananaSelectionBar").then((m) => m.MananaSelectionBar)),
  { ssr: false }
);

