"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  AlertTriangle,
  Target,
  Database,
  PenLine,
  Send,
} from "lucide-react";
import OrbitalLoader from "./OrbitalLoader";
import { NODE_STATUS, ACCENT_MAP, SPRING_TRANSITION } from "@/lib/constants";

const ICONS = {
  qualifier: Target,
  retriever: Database,
  drafter: PenLine,
  sender: Send,
};

function StatusBadge({ status }) {
  if (status === NODE_STATUS.COMPLETE) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={SPRING_TRANSITION}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
        style={{
          background: "rgba(61,255,168,0.15)",
          boxShadow: "0 0 0 1px rgba(61,255,168,0.4)",
        }}
      >
        <Check className="h-3 w-3 text-signal" strokeWidth={3} />
      </motion.div>
    );
  }
  if (status === NODE_STATUS.ACTIVE) {
    return <span className="signal-dot shrink-0" />;
  }
  if (status === NODE_STATUS.ERROR) {
    return <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-400" />;
  }
  return (
    <span className="h-2 w-2 shrink-0 rounded-full border border-mist/30" />
  );
}

export default function AgentNode({
  node,
  status,
  compact = false,
  fullWidth = false,
}) {
  const isActive = status === NODE_STATUS.ACTIVE;
  const isComplete = status === NODE_STATUS.COMPLETE;
  const accent = ACCENT_MAP[node.accent] || ACCENT_MAP.indigo;
  const Icon = ICONS[node.id] || Target;

  return (
    <motion.div
      className={`relative ${fullWidth ? "w-full" : ""}`}
      animate={{ y: isActive ? [0, -4, 0] : 0 }}
      transition={{
        duration: 2.8,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      <AnimatePresence>
        {isActive && (
          <OrbitalLoader accent={node.accent} size={compact ? 92 : 108} />
        )}
      </AnimatePresence>

      <motion.div
        className={`relative z-10 ${fullWidth ? "w-full" : "w-[168px]"}`}
        animate={
          isActive
            ? {
                boxShadow: [
                  `0 0 0 1px ${accent.glow}, 0 0 20px ${accent.glow}`,
                  `0 0 0 1px ${accent.glow}, 0 0 36px ${accent.glow}`,
                  `0 0 0 1px ${accent.glow}, 0 0 20px ${accent.glow}`,
                ],
              }
            : isComplete
              ? {
                  boxShadow:
                    "0 0 16px rgba(61,255,168,0.15), 0 0 0 1px rgba(61,255,168,0.28)",
                }
              : { boxShadow: "0 0 0 1px rgba(139,156,179,0.1)" }
        }
        transition={
          isActive ? { duration: 2.2, repeat: Infinity } : SPRING_TRANSITION
        }
        whileHover={{ scale: 1.02 }}
      >
        <div
          className={`surface-sm flex h-[76px] flex-col justify-center px-3 py-2.5 transition-colors sm:h-[84px] ${
            isActive ? `bg-gradient-to-br ${accent.bg}` : ""
          }`}
        >
          {isActive && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${accent.glow}, transparent 70%)`,
              }}
              animate={{ opacity: [0.12, 0.3, 0.12] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}

          <div className="relative flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${accent.text}`}
                  style={{
                    background: "rgba(5,6,7,0.55)",
                    boxShadow: "0 0 0 1px rgba(139,156,179,0.15)",
                  }}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                </div>
                <span className={`meta shrink-0 text-[9px] ${accent.text}`}>
                  {node.shortLabel}
                </span>
              </div>
              <StatusBadge status={status} />
            </div>

            <h3 className="font-display truncate text-[12px] font-semibold leading-tight tracking-tight text-[#eef2f7] sm:text-[13px]">
              {node.label}
            </h3>

            {!compact && (
              <p className="text-[10px] leading-snug text-mist-dim">
                {node.description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
