"use client";

import { TIER_META } from "@/lib/leads";

export default function TierBadge({ tier, size = "md" }) {
  const meta = TIER_META[tier] || TIER_META.medium;
  const pad = size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg font-mono font-semibold uppercase tracking-[0.12em] ${pad}`}
      style={{
        color: meta.color,
        background: meta.bg,
        boxShadow: `0 0 0 1px ${meta.border}`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  );
}
