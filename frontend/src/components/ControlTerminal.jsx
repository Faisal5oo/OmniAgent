"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Mic, Paperclip, Sparkles, Wand2, Command } from "lucide-react";
import LiveWaveform from "./LiveWaveform";
import { SPRING_TRANSITION, EASE_OUT } from "@/lib/constants";

const SAMPLE_INTENTS = [
  "Qualify Enterprise Corp for outbound campaign — budget threshold $45k",
  "Draft personalized outreach for high-value SaaS lead with CRM context",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function ControlTerminal({ onSubmit, isStreaming, threadId }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit(query);
  };

  const alive = isStreaming || focused;

  return (
    <motion.div
      className="surface flex h-full min-h-0 flex-col p-4 sm:p-5 lg:p-7"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
    >
      <div className="mb-4 shrink-0 sm:mb-6">
        <motion.p
          className="meta mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {getGreeting()}
        </motion.p>
        <h1 className="font-display text-[1.5rem] font-semibold leading-[1.15] tracking-tight text-[#eef2f7] sm:text-[1.75rem] lg:text-[2rem]">
          Deploy your{" "}
          <span className="gradient-text">agent fleet</span>
        </h1>
        <p className="body-muted mt-2 max-w-none sm:mt-2.5 sm:max-w-[300px]">
          Describe a business intent — the mesh executes in parallel.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative shrink-0">
        {/* Animated border aura */}
        <motion.div
          className="absolute -inset-[1px] rounded-[20px]"
          animate={{
            opacity: alive ? 1 : 0,
            background: isStreaming
              ? [
                  "conic-gradient(from 0deg, #3dffa8, #7dd3fc, #e8b86d, #3dffa8)",
                  "conic-gradient(from 360deg, #3dffa8, #7dd3fc, #e8b86d, #3dffa8)",
                ]
              : "conic-gradient(from 0deg, #3dffa8, #5eead4, #3dffa8)",
          }}
          transition={
            isStreaming
              ? { duration: 3, repeat: Infinity, ease: "linear" }
              : { duration: 0.35 }
          }
          style={{ filter: "blur(0px)" }}
        />
        <motion.div
          className="pointer-events-none absolute -inset-[1px] rounded-[20px]"
          animate={{ rotate: alive ? 360 : 0, opacity: alive ? 0.55 : 0 }}
          transition={
            alive
              ? {
                  rotate: {
                    duration: isStreaming ? 2.8 : 10,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  opacity: { duration: 0.3 },
                }
              : { duration: 0.3 }
          }
          style={{
            background:
              "conic-gradient(from 0deg, transparent 40%, rgba(61,255,168,0.7), transparent 60%, rgba(232,184,109,0.4), transparent 80%)",
          }}
        />

        <div
          className="relative overflow-hidden rounded-[19px] p-4 backdrop-blur-xl"
          style={{
            background: "rgba(8, 10, 12, 0.88)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {alive && <div className="shimmer-overlay opacity-40" />}

          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Provide complex business intent to orchestrate…"
            disabled={isStreaming}
            className="relative w-full resize-none border-none bg-transparent text-[14px] leading-relaxed text-[#eef2f7] placeholder:text-mist-dim focus:outline-none focus:ring-0 disabled:opacity-50 sm:min-h-[96px] sm:text-[15px]"
          />

          <div className="relative mt-3 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
            <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
              <button type="button" className="btn-ghost flex items-center gap-1.5 !px-2 !py-1.5 sm:!px-3 sm:!py-2">
                <Wand2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prompts</span>
              </button>
              <button
                type="button"
                className="rounded-xl p-2 text-mist-dim transition hover:bg-ink-700/50 hover:text-mist-bright"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <div className="hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-ink-950/50 px-2.5 py-1.5 sm:flex">
                <Mic className="h-3.5 w-3.5 text-mist-dim" />
                <span className="text-[11px] text-mist-dim">Mic</span>
                <div className="relative h-4 w-7 rounded-full bg-ink-700">
                  <motion.div
                    className="absolute top-0.5 h-3 w-3 rounded-full bg-mist"
                    animate={{ left: 2 }}
                  />
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isStreaming || !query.trim()}
              className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full disabled:opacity-35"
              style={{
                background:
                  "linear-gradient(145deg, #3dffa8 0%, #1a9e6a 100%)",
                boxShadow:
                  "0 0 0 1px rgba(61,255,168,0.4), 0 8px 24px rgba(61,255,168,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
                color: "#04120c",
              }}
              whileHover={{ scale: 1.1, rotate: 8 }}
              whileTap={{ scale: 0.88, rotate: -6 }}
              animate={
                !isStreaming && query.trim()
                  ? {
                      boxShadow: [
                        "0 0 0 1px rgba(61,255,168,0.4), 0 8px 24px rgba(61,255,168,0.25)",
                        "0 0 0 1px rgba(61,255,168,0.55), 0 10px 32px rgba(61,255,168,0.45)",
                        "0 0 0 1px rgba(61,255,168,0.4), 0 8px 24px rgba(61,255,168,0.25)",
                      ],
                    }
                  : {}
              }
              transition={
                !isStreaming && query.trim()
                  ? { duration: 2.2, repeat: Infinity }
                  : SPRING_TRANSITION
              }
            >
              {isStreaming ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.span>
              ) : (
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
              )}
            </motion.button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {isStreaming && (
          <motion.div
            className="mt-4 shrink-0 overflow-hidden rounded-2xl px-4 py-3"
            style={{
              background: "rgba(61,255,168,0.04)",
              boxShadow: "0 0 0 1px rgba(61,255,168,0.15)",
            }}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="signal-dot" />
                <span className="meta text-signal/80">Processing intent</span>
              </div>
              <span className="font-mono text-[10px] text-mist-dim">
                {threadId?.slice(0, 12)}
              </span>
            </div>
            <LiveWaveform active color="#3dffa8" height={28} bars={24} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto flex flex-1 flex-col justify-end pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Command className="h-3 w-3 text-mist-dim" />
          <p className="meta">Suggested intents</p>
        </div>
        <div className="flex flex-col gap-2">
          {SAMPLE_INTENTS.map((intent, i) => (
            <motion.button
              key={intent}
              type="button"
              disabled={isStreaming}
              onClick={() => setQuery(intent)}
              className="group surface-sm interactive-card relative overflow-hidden px-3.5 py-3 text-left text-xs leading-relaxed text-mist-bright disabled:opacity-40"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING_TRANSITION, delay: 0.2 + i * 0.06 }}
              whileHover={{ x: 5, scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
            >
              <motion.span
                className="absolute left-0 top-1/2 w-0.5 -translate-y-1/2 rounded-full bg-signal"
                initial={{ height: 0 }}
                whileHover={{ height: "55%" }}
                transition={SPRING_TRANSITION}
              />
              <span className="relative transition-colors group-hover:text-[#eef2f7]">
                {intent}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
