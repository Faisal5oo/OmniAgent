"use client";

import { motion } from "framer-motion";

export default function LiveWaveform({
  active,
  color = "#3dffa8",
  height = 48,
  bars = 32,
}) {
  return (
    <div className="flex h-full w-full items-end gap-[2.5px]" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => {
        const base = 0.12 + Math.sin(i * 0.55) * 0.22 + Math.cos(i * 0.3) * 0.12;
        const peak = active ? 0.32 + Math.abs(Math.sin(i * 1.7)) * 0.58 : base;

        return (
          <motion.div
            key={i}
            className="flex-1 rounded-full"
            style={{
              background: `linear-gradient(to top, ${color}55, ${color})`,
              boxShadow: active ? `0 0 6px ${color}44` : "none",
            }}
            animate={{
              height: active
                ? [`${base * 100}%`, `${peak * 100}%`, `${base * 100}%`]
                : `${Math.max(base * 100, 8)}%`,
              opacity: active ? [0.45, 1, 0.45] : 0.28,
            }}
            transition={{
              duration: active ? 0.7 + (i % 5) * 0.1 : 0.35,
              repeat: active ? Infinity : 0,
              delay: i * 0.025,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
