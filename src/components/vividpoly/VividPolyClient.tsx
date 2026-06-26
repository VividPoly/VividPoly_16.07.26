"use client";

import dynamic from "next/dynamic";
import VividPolyResponsiveShell from "@/components/vividpoly/VividPolyResponsiveShell";

const VividPolyView = dynamic(
  () => import("@/components/vividpoly/VividPolyView"),
  {
    ssr: false,
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
    <VividPolyResponsiveShell>
      <VividPolyView />
    </VividPolyResponsiveShell>
  );
}
