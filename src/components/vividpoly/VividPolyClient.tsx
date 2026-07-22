"use client";

import dynamic from "next/dynamic";
import VividPolyResponsiveShell from "@/components/vividpoly/VividPolyResponsiveShell";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";

const VividPolyView = dynamic(
  () => import("@/components/vividpoly/VividPolyView"),
  {
    // Keep SSR so phone/tablet see real markup instead of an endless spinner
    // when the client chunk is slow or blocked inside device frames.
    loading: () => (
      <div className="vp-app-loading" role="status" aria-live="polite">
        <div className="vp-app-loading-spinner" aria-hidden="true" />
        <p>Loading VIVIDPOLY…</p>
      </div>
    ),
  },
);

export default function VividPolyClient() {
  return (
    <LocaleProvider>
      <VividPolyResponsiveShell>
        <VividPolyView />
      </VividPolyResponsiveShell>
    </LocaleProvider>
  );
}
