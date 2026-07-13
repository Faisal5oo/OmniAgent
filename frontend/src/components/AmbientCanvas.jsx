"use client";

import { motion } from "framer-motion";

export default function AmbientCanvas({ isStreaming }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#050607]" />

      {/* Soft vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(61,255,168,0.06), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 100%, rgba(232,184,109,0.05), transparent 50%)",
        }}
      />

      {/* Aurora ribbons */}
      <motion.div
        className="absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(61,255,168,0.18) 0%, transparent 68%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, 40, -10, 0],
          y: [0, 24, 8, 0],
          scale: [1, 1.1, 0.96, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-44 -right-28 h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(232,184,109,0.14) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
        animate={{
          x: [0, -30, 12, 0],
          y: [0, -20, -6, 0],
          scale: [1, 1.08, 1.02, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-[28%] h-[380px] w-[380px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(125,211,252,0.1) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{
          opacity: isStreaming ? [0.35, 0.7, 0.35] : [0.15, 0.28, 0.15],
          scale: isStreaming ? [1, 1.12, 1] : [1, 1.04, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fine technical grid */}
      <div
        className="absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,212,228,0.9) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,212,228,0.9) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 35%, black, transparent)",
        }}
      />

      {/* Diagonal light streak */}
      <motion.div
        className="absolute -left-1/4 top-0 h-full w-[40%] skew-x-[-18deg]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.015), transparent)",
        }}
        animate={{ x: ["-10%", "180%"] }}
        transition={{
          duration: isStreaming ? 8 : 16,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Live scan when streaming */}
      {isStreaming && (
        <motion.div
          className="absolute inset-x-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(61,255,168,0.55), transparent)",
            boxShadow: "0 0 20px rgba(61,255,168,0.35)",
          }}
          initial={{ top: "0%" }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Edge fade */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 70%, rgba(5,6,7,0.85) 100%)",
        }}
      />
    </div>
  );
}
