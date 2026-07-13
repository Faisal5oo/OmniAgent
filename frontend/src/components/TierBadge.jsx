"use client";

import { motion } from "framer-motion";
import { TIER_META } from "@/lib/leads";
import { SPRING_TRANSITION } from "@/lib/constants";

export default function TierBadge({ tier, size = "md" }) {
  const meta = TIER_META[tier] || TIER_META.medium;
  const pad = size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]";

  return (
    <motion.span
      className={`inline-flex items-center gap-1.5 rounded-lg font-mono font-semibold uppercase tracking-[0.12em] ${pad}`}
      style={{
        color: meta.color,
        background: meta.bg,
        boxShadow: `0 0 0 1px ${meta.border}`,
      }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.06 }}
      transition={SPRING_TRANSITION}
    >
      <motion.span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: meta.color }}
        animate={{ scale: [1, 1.35, 1], opacity: [1, 0.65, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {meta.label}
    </motion.span>
  );
}
