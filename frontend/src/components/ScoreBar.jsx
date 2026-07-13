"use client";

import { motion } from "framer-motion";
import { TIER_META } from "@/lib/leads";
import { SPRING_TRANSITION } from "@/lib/constants";

export default function ScoreBar({ factor, delay = 0 }) {
  const tint =
    factor.score >= 72
      ? TIER_META.high.color
      : factor.score >= 45
        ? TIER_META.medium.color
        : TIER_META.low.color;

  return (
    <motion.div
      className="space-y-1.5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#eef2f7]">{factor.label}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-mist">
            Weight {factor.weight}% · {factor.detail}
          </p>
        </div>
        <span
          className="shrink-0 font-mono text-sm font-semibold tabular-nums"
          style={{ color: tint }}
        >
          {factor.score}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: tint }}
          initial={{ width: 0 }}
          animate={{ width: `${factor.score}%` }}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}
