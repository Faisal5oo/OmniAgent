"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Filter,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import TierBadge from "@/components/TierBadge";
import {
  LEADS,
  TIER,
  TIER_META,
  formatCurrency,
  formatRelativeDate,
  getLeadStats,
} from "@/lib/leads";
import { SPRING_TRANSITION } from "@/lib/constants";

const FILTERS = [
  { id: "all", label: "All" },
  { id: TIER.HIGH, label: "High" },
  { id: TIER.MEDIUM, label: "Medium" },
  { id: TIER.LOW, label: "Low" },
  { id: "qualified", label: "Qualified" },
];

function StatCard({ label, value, hint, accent, delay }) {
  return (
    <motion.div
      className="surface-sm interactive-card p-3.5 sm:p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay }}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
    >
      <p className="meta mb-1.5">{label}</p>
      <motion.p
        className="font-display text-xl font-semibold tracking-tight tabular-nums sm:text-2xl"
        style={accent ? { color: accent } : undefined}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...SPRING_TRANSITION, delay: delay + 0.08 }}
      >
        {value}
      </motion.p>
      {hint && <p className="mt-1 text-[11px] text-mist">{hint}</p>}
    </motion.div>
  );
}

function LeadRow({ lead, index }) {
  const meta = TIER_META[lead.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ ...SPRING_TRANSITION, delay: 0.04 + index * 0.04 }}
      whileHover={{ y: -3, scale: 1.008 }}
      whileTap={{ scale: 0.992 }}
      layout
    >
      <Link
        href={`/leads/${lead.id}`}
        className="group surface-sm interactive-card relative flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
      >
        <span
          className="absolute bottom-3 left-0 top-3 w-[2px] origin-center scale-y-0 rounded-full opacity-0 transition duration-300 group-hover:scale-y-100 group-hover:opacity-100 sm:bottom-4 sm:top-4"
          style={{ background: meta.color }}
        />

        <div className="flex min-w-0 flex-1 items-start gap-3 pr-6 sm:pr-0">
          <motion.div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-semibold"
            style={{
              background: meta.bg,
              color: meta.color,
              boxShadow: `0 0 0 1px ${meta.border}`,
            }}
            whileHover={{ rotate: -6, scale: 1.08 }}
            transition={SPRING_TRANSITION}
          >
            {lead.company.slice(0, 2).toUpperCase()}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-[15px] font-semibold tracking-tight text-[#eef2f7] transition group-hover:text-white">
                {lead.company}
              </h3>
              <TierBadge tier={lead.tier} size="sm" />
            </div>
            <p className="mt-0.5 truncate text-xs text-mist">
              {lead.industry} · {lead.segment} · {lead.hq}
            </p>
            <p className="mt-1.5 hidden text-[11px] text-mist sm:line-clamp-1 sm:block">
              {lead.rationale.summary}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-t border-white/[0.05] pt-3 sm:flex sm:w-auto sm:shrink-0 sm:items-center sm:gap-5 sm:border-0 sm:pl-2 sm:pt-0">
          <div className="min-w-0 sm:w-[72px] sm:text-right">
            <p className="meta mb-0.5">Score</p>
            <p
              className="font-mono text-sm font-semibold tabular-nums"
              style={{ color: meta.color }}
            >
              {lead.score}
            </p>
          </div>
          <div className="min-w-0 sm:w-[88px] sm:text-right">
            <p className="meta mb-0.5">Budget</p>
            <p className="font-mono text-sm tabular-nums text-[#eef2f7]">
              {formatCurrency(lead.budget)}
            </p>
          </div>
          <div className="min-w-0 sm:w-[76px] sm:text-right">
            <p className="meta mb-0.5">Updated</p>
            <p className="text-xs text-mist">
              {formatRelativeDate(lead.lastActivity)}
            </p>
          </div>
        </div>

        <motion.span
          className="absolute right-3.5 top-3.5 text-mist opacity-40 sm:static sm:opacity-50"
          whileHover={{ x: 2, y: -2, opacity: 1, color: "#3dffa8" }}
          transition={SPRING_TRANSITION}
        >
          <ArrowUpRight className="h-4 w-4 group-hover:text-signal group-hover:opacity-100" />
        </motion.span>
      </Link>
    </motion.div>
  );
}

function LeadsContent() {
  const stats = getLeadStats();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const tier = searchParams.get("tier");
    if (tier && Object.values(TIER).includes(tier)) {
      setFilter(tier);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LEADS.filter((lead) => {
      if (filter === "qualified" && !lead.qualified) return false;
      if (filter !== "all" && filter !== "qualified" && lead.tier !== filter) {
        return false;
      }
      if (!q) return true;
      return (
        lead.company.toLowerCase().includes(q) ||
        lead.industry.toLowerCase().includes(q) ||
        lead.contact.name.toLowerCase().includes(q) ||
        lead.tags.some((t) => t.toLowerCase().includes(q))
      );
    }).sort((a, b) => b.score - a.score);
  }, [query, filter]);

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-signal/80" strokeWidth={1.75} />
            <span className="meta">Intelligence desk</span>
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#eef2f7] sm:text-3xl">
            Lead portfolio
          </h1>
          <p className="body-muted mt-1.5 max-w-xl">
            Scored accounts with full qualification rationale — click any lead
            for factor breakdown, risk, and recommended next action.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className="rounded-lg px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-mist"
            style={{ boxShadow: "0 0 0 1px rgba(139,156,179,0.15)" }}
          >
            Gate $45k
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <StatCard
          label="Pipeline value"
          value={formatCurrency(stats.pipelineValue)}
          hint={`${stats.qualified} qualified accounts`}
          accent="#3dffa8"
          delay={0.02}
        />
        <StatCard
          label="High tier"
          value={stats.high}
          hint="Priority outbound"
          accent={TIER_META.high.color}
          delay={0.05}
        />
        <StatCard
          label="Medium tier"
          value={stats.medium}
          hint="Nurture track"
          accent={TIER_META.medium.color}
          delay={0.08}
        />
        <StatCard
          label="Low tier"
          value={stats.low}
          hint="Deprioritized"
          accent={TIER_META.low.color}
          delay={0.11}
        />
      </div>

      <div className="surface flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-dim" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company, contact, industry, tags…"
            className="w-full rounded-xl border-none bg-ink-950/60 py-2.5 pl-10 pr-3 text-sm text-[#eef2f7] placeholder:text-mist-dim focus:outline-none focus:ring-1 focus:ring-signal/30"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Filter className="mr-0.5 hidden h-3.5 w-3.5 shrink-0 text-mist sm:block" />
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <motion.button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`relative shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                  active ? "text-signal" : "text-mist hover:text-mist-bright"
                }`}
                style={
                  !active
                    ? { boxShadow: "0 0 0 1px rgba(184,198,216,0.12)" }
                    : undefined
                }
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.94 }}
                transition={SPRING_TRANSITION}
              >
                {active && (
                  <motion.span
                    layoutId="lead-filter-pill"
                    className="absolute inset-0 rounded-lg bg-signal/15"
                    style={{ boxShadow: "0 0 0 1px rgba(61,255,168,0.28)" }}
                    transition={SPRING_TRANSITION}
                  />
                )}
                <span className="relative">{f.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="meta">
          {filtered.length} account{filtered.length === 1 ? "" : "s"}
        </p>
        <div className="flex items-center gap-1.5 text-mist-dim">
          <TrendingUp className="h-3.5 w-3.5" />
          <span className="hidden text-[11px] sm:inline">
            Sorted by composite score
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div className="surface flex flex-col items-center justify-center px-6 py-16 text-center">
            <Building2 className="mb-3 h-8 w-8 text-mist-dim" />
            <p className="font-display text-sm font-medium text-mist">
              No leads match this filter
            </p>
            <p className="mt-1 text-xs text-mist-dim">
              Clear search or switch tier to broaden results
            </p>
          </div>
        ) : (
          filtered.map((lead, i) => (
            <LeadRow key={lead.id} lead={lead} index={i} />
          ))
        )}
      </div>
    </>
  );
}

export default function LeadsPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="surface flex min-h-[240px] items-center justify-center">
            <p className="meta">Loading portfolio…</p>
          </div>
        }
      >
        <LeadsContent />
      </Suspense>
    </AppShell>
  );
}
