"use client";

import { motion } from "framer-motion";

export default function CoreOrb({ isStreaming, activeCount = 0 }) {
  const intensity = isStreaming ? 1 : 0.45;

  return (
    <div className="relative flex h-[120px] w-[120px] items-center justify-center">
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border"
          style={{
            width: 70 + ring * 16,
            height: 70 + ring * 16,
            borderColor: `rgba(61,255,168,${0.06 + ring * 0.03})`,
          }}
          animate={{
            opacity: isStreaming ? [0.15, 0.45, 0.15] : 0.12,
            scale: isStreaming ? [1, 1.04, 1] : 1,
            rotate: isStreaming ? [0, 180] : 0,
          }}
          transition={{
            duration: 3 + ring * 0.6,
            repeat: Infinity,
            delay: ring * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="absolute h-[84px] w-[84px] rounded-full opacity-50"
        style={{
          background:
            "conic-gradient(from 0deg, #3dffa8, #7dd3fc, #e8b86d, #3dffa8)",
          filter: "blur(10px)",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: isStreaming ? 5 : 16,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="relative z-10 h-[60px] w-[60px] overflow-hidden rounded-full"
        animate={{ scale: isStreaming ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 2.2, repeat: isStreaming ? Infinity : 0 }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, rgba(180,255,220,0.95), rgba(61,255,168,0.55) 38%, rgba(8,20,16,0.98) 100%)",
            boxShadow: `
              0 0 ${28 * intensity}px rgba(61,255,168,${0.45 * intensity}),
              inset 0 -10px 22px rgba(0,0,0,0.5),
              inset 0 4px 14px rgba(255,255,255,0.2)
            `,
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 200deg, transparent, rgba(232,184,109,0.35), transparent)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute left-[16%] top-[12%] h-3 w-5 rotate-[-28deg] rounded-full bg-white/35 blur-[2px]" />
      </motion.div>

      {activeCount > 0 && (
        <motion.span
          className="absolute bottom-1 font-mono text-[9px] font-medium tracking-wider text-signal/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {activeCount} LIVE
        </motion.span>
      )}
    </div>
  );
}
