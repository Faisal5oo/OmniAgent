"use client";

import { motion } from "framer-motion";

const ACCENT_RING = {
  emerald: {
    border: "border-signal/40",
    glow: "shadow-[0_0_14px_rgba(61,255,168,0.35)]",
    dot: "bg-signal",
  },
  indigo: {
    border: "border-sky-400/40",
    glow: "shadow-[0_0_14px_rgba(125,211,252,0.35)]",
    dot: "bg-sky-300",
  },
  violet: {
    border: "border-brass/40",
    glow: "shadow-[0_0_14px_rgba(232,184,109,0.35)]",
    dot: "bg-brass",
  },
  cyan: {
    border: "border-teal-400/40",
    glow: "shadow-[0_0_14px_rgba(94,234,212,0.35)]",
    dot: "bg-teal-300",
  },
};

export default function OrbitalLoader({ accent = "indigo", size = 108 }) {
  const ring = ACCENT_RING[accent] || ACCENT_RING.indigo;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        className={`absolute rounded-full border border-dashed ${ring.border} ${ring.glow}`}
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className={`absolute rounded-full border ${ring.border} opacity-50`}
        style={{ width: size * 0.76, height: size * 0.76 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "linear" }}
      >
        <span
          className={`absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${ring.dot}`}
          style={{
            marginTop: -3,
            boxShadow: "0 0 10px rgba(255,255,255,0.6)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
