"use client";

import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import AgentNode from "./AgentNode";
import CoreOrb from "./CoreOrb";
import {
  NODE_STATUS,
  PIPELINE_NODES,
  ACCENT_MAP,
  SPRING_TRANSITION,
} from "@/lib/constants";

/** Stable slot order for a 2×2 diamond around the core. */
const SLOT_ORDER = ["qualifier", "retriever", "drafter", "sender"];

function nodeById(id) {
  return PIPELINE_NODES.find((n) => n.id === id);
}

function ConnectorLines({ nodeStates, isStreaming }) {
  const slots = [
    { id: "qualifier", x1: 50, y1: 50, x2: 22, y2: 22 },
    { id: "retriever", x1: 50, y1: 50, x2: 78, y2: 22 },
    { id: "drafter", x1: 50, y1: 50, x2: 22, y2: 78 },
    { id: "sender", x1: 50, y1: 50, x2: 78, y2: 78 },
  ];

  return (
    <svg
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      {[28, 40].map((r) => (
        <motion.circle
          key={r}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="rgba(139,156,179,0.1)"
          strokeWidth="0.35"
          strokeDasharray="1.5 2"
          vectorEffect="non-scaling-stroke"
          animate={
            isStreaming
              ? { opacity: [0.12, 0.32, 0.12] }
              : { opacity: 0.18 }
          }
          transition={
            isStreaming ? { duration: 3, repeat: Infinity } : { duration: 0.4 }
          }
        />
      ))}

      {slots.map(({ id, x1, y1, x2, y2 }) => {
        const node = nodeById(id);
        const status = nodeStates[id] || NODE_STATUS.IDLE;
        const accent = ACCENT_MAP[node?.accent] || ACCENT_MAP.indigo;
        const isActive = status === NODE_STATUS.ACTIVE;
        const isComplete = status === NODE_STATUS.COMPLETE;
        const lit = isActive || isComplete;

        return (
          <g key={id}>
            <motion.line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={lit ? accent.line : "rgba(139,156,179,0.2)"}
              strokeWidth={lit ? 1.25 : 0.9}
              strokeDasharray={isActive ? "3 2" : "none"}
              vectorEffect="non-scaling-stroke"
              animate={{
                opacity: lit ? (isActive ? 0.9 : 0.5) : 0.22,
                strokeDashoffset: isActive ? [0, -12] : 0,
              }}
              transition={
                isActive
                  ? {
                      strokeDashoffset: {
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      opacity: { duration: 0.35 },
                    }
                  : { duration: 0.45 }
              }
              style={{
                filter: lit ? `drop-shadow(0 0 3px ${accent.line}88)` : "none",
              }}
            />
            {lit && (
              <motion.circle
                cx={x2}
                cy={y2}
                r="1.4"
                fill={isComplete ? "#3dffa8" : accent.line}
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                style={{ filter: `drop-shadow(0 0 4px ${accent.line})` }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TopologyGrid({ nodeStates, isStreaming, activeCount }) {
  const ordered = SLOT_ORDER.map(nodeById).filter(Boolean);

  const corners = [
    { id: ordered[0]?.id, className: "left-0 top-0 origin-top-left" },
    { id: ordered[1]?.id, className: "right-0 top-0 origin-top-right" },
    { id: ordered[2]?.id, className: "bottom-0 left-0 origin-bottom-left" },
    { id: ordered[3]?.id, className: "bottom-0 right-0 origin-bottom-right" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="relative aspect-square w-full">
        <ConnectorLines nodeStates={nodeStates} isStreaming={isStreaming} />

        {corners.map(({ id, className }, i) => {
          const node = ordered[i];
          if (!node) return null;
          return (
            <motion.div
              key={id}
              className={`absolute z-20 w-[42%] max-w-[190px] ${className}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...SPRING_TRANSITION, delay: 0.08 + i * 0.05 }}
            >
              <AgentNode
                node={node}
                status={nodeStates[node.id] || NODE_STATUS.IDLE}
                compact
                fullWidth
              />
            </motion.div>
          );
        })}

        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="scale-[0.78] sm:scale-90 lg:scale-100">
            <CoreOrb isStreaming={isStreaming} activeCount={activeCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NodeExecutionMap({ nodeStates, isStreaming }) {
  const activeCount = PIPELINE_NODES.filter(
    (n) => nodeStates[n.id] === NODE_STATUS.ACTIVE
  ).length;

  return (
    <motion.section
      className="surface relative flex min-h-0 flex-col p-4 sm:p-5 lg:p-6"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...SPRING_TRANSITION, delay: 0.08 }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(61,255,168,0.06), transparent 65%)",
        }}
      />

      <header className="relative mb-3 flex items-start justify-between gap-3 sm:mb-4">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 sm:mb-1.5">
            <GitBranch
              className="h-3.5 w-3.5 shrink-0 text-signal/80"
              strokeWidth={1.75}
            />
            <span className="meta">Execution Mesh</span>
          </div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[#eef2f7] sm:text-2xl">
            Agent Topology
          </h2>
        </div>
        <motion.div
          className="flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1.5 sm:px-3"
          style={{
            background: "rgba(5,6,7,0.45)",
            boxShadow: isStreaming
              ? "0 0 0 1px rgba(61,255,168,0.35), 0 0 20px rgba(61,255,168,0.12)"
              : "0 0 0 1px rgba(139,156,179,0.12)",
          }}
          animate={isStreaming ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isStreaming ? (
            <span className="signal-dot" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-mist-dim/50" />
          )}
          <span className="meta text-[10px]">
            {isStreaming ? "Live" : "Standby"}
          </span>
        </motion.div>
      </header>

      <TopologyGrid
        nodeStates={nodeStates}
        isStreaming={isStreaming}
        activeCount={activeCount}
      />
    </motion.section>
  );
}
