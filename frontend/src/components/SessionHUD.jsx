"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Zap } from "lucide-react";
import LiveWaveform from "./LiveWaveform";
import {
  NODE_STATUS,
  PIPELINE_NODES,
  SPRING_TRANSITION,
  EASE_OUT,
} from "@/lib/constants";
import { LEADS } from "@/lib/leads";

function ProgressRing({ value, color, size = 64 }) {
  const r = (size / 2) - 8;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const mid = size / 2;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={mid}
        cy={mid}
        r={r}
        fill="none"
        stroke="rgba(139,156,179,0.12)"
        strokeWidth="3.5"
      />
      <motion.circle
        cx={mid}
        cy={mid}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.1, ease: EASE_OUT }}
        style={{ filter: `drop-shadow(0 0 5px ${color}99)` }}
      />
    </svg>
  );
}

const CARD =
  "surface-sm flex h-[108px] flex-col justify-between p-3.5 sm:h-[116px] sm:p-4";

export default function SessionHUD({ nodeStates, isStreaming, completion }) {
  const completed = PIPELINE_NODES.filter(
    (n) => nodeStates[n.id] === NODE_STATUS.COMPLETE
  ).length;
  const progress = Math.round((completed / PIPELINE_NODES.length) * 100);
  const activeCount = PIPELINE_NODES.filter(
    (n) => nodeStates[n.id] === NODE_STATUS.ACTIVE
  ).length;

  const matchedLead = completion?.lead_data?.company
    ? LEADS.find(
        (l) =>
          l.company.toLowerCase() ===
          String(completion.lead_data.company).toLowerCase()
      )
    : null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3.5">
      <motion.div
        className={`${CARD} flex-row items-center gap-3.5 !justify-start`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.04 }}
        whileHover={{ y: -2 }}
      >
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <ProgressRing value={progress} color="#3dffa8" size={64} />
          <span className="absolute font-display text-sm font-semibold tabular-nums text-[#eef2f7]">
            {progress}
            <span className="text-[10px] text-mist">%</span>
          </span>
        </div>
        <div className="min-w-0">
          <p className="meta mb-1">Pipeline</p>
          <p className="title text-lg tabular-nums leading-none">
            {completed}
            <span className="text-mist">/4</span>
            <span className="ml-1.5 text-sm font-normal text-mist">nodes</span>
          </p>
          <p className="mt-1.5 truncate text-xs text-mist">
            {activeCount > 0
              ? `${activeCount} processing`
              : "Awaiting execution"}
          </p>
        </div>
      </motion.div>

      <motion.div
        className={CARD}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.09 }}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-signal/70" strokeWidth={1.75} />
            <p className="meta">Execution</p>
          </div>
          {isStreaming ? (
            <span className="signal-dot" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-mist-dim/50" />
          )}
        </div>
        <LiveWaveform
          active={isStreaming}
          color="#3dffa8"
          height={36}
          bars={24}
        />
      </motion.div>

      <motion.div
        className={CARD}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_TRANSITION, delay: 0.14 }}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-brass/80" strokeWidth={1.75} />
          <p className="meta">Lead intel</p>
        </div>
        {completion?.lead_data ? (
          <motion.div
            className="min-w-0 space-y-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {matchedLead ? (
              <Link
                href={`/leads/${matchedLead.id}`}
                className="title block truncate text-lg transition hover:text-signal"
              >
                {completion.lead_data.company}
              </Link>
            ) : (
              <p className="title truncate text-lg">
                {completion.lead_data.company}
              </p>
            )}
            <p className="font-mono text-xs text-signal">
              ${completion.lead_data.budget?.toLocaleString()}
              <span className="mx-1.5 text-mist-dim">·</span>
              {completion.lead_data.qualified ? "Qualified" : "Unqualified"}
            </p>
          </motion.div>
        ) : (
          <Link
            href="/leads"
            className="flex items-center gap-2.5 text-mist transition hover:text-mist-bright"
          >
            <div className="h-8 w-8 shrink-0 rounded-lg border border-dashed border-mist/20 bg-ink-950/40" />
            <span className="text-sm">View lead portfolio</span>
          </Link>
        )}
      </motion.div>
    </div>
  );
}
