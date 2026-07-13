"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CircleAlert,
  Gauge,
  Lightbulb,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import TierBadge from "@/components/TierBadge";
import {
  LEADS,
  TIER,
  formatCurrency,
  getLeadStats,
} from "@/lib/leads";
import { SPRING_TRANSITION } from "@/lib/constants";

const BUDGET_GATE_DEFAULT = 45000;

function simulateGate(gate) {
  return LEADS.map((lead) => {
    const wouldQualify = lead.budget >= gate;
    const nextTier = wouldQualify
      ? lead.score >= 72
        ? TIER.HIGH
        : lead.score >= 45
          ? TIER.MEDIUM
          : TIER.LOW
      : lead.budget >= gate * 0.7
        ? TIER.MEDIUM
        : TIER.LOW;

    return {
      ...lead,
      wouldQualify,
      simulatedTier: wouldQualify ? lead.tier : nextTier,
      flipped: (lead.qualified !== wouldQualify) || false,
    };
  });
}

function counterfactual(lead) {
  const blockers = [];
  if (lead.budget < BUDGET_GATE_DEFAULT) {
    blockers.push({
      label: "Budget gap",
      fix: `Raise budget by ${formatCurrency(BUDGET_GATE_DEFAULT - lead.budget)} to clear the gate`,
      impact: "Unlocks Qualified status",
    });
  }
  lead.factors
    .filter((f) => f.score < 60)
    .forEach((f) => {
      blockers.push({
        label: f.label,
        fix: f.detail,
        impact: `+${Math.round((60 - f.score) * (f.weight / 100))} weighted pts if lifted to 60`,
      });
    });
  if (lead.intent === "low" || lead.intent === "medium") {
    blockers.push({
      label: "Intent depth",
      fix: "Multi-thread a second stakeholder or wait for a pricing-page cluster",
      impact: "Raises buying-intent factor toward High band",
    });
  }
  return blockers.slice(0, 3);
}

function buildActions(leads) {
  const actions = [];

  leads
    .filter((l) => l.tier === TIER.HIGH && l.qualified)
    .forEach((l) => {
      actions.push({
        id: `act-${l.id}-send`,
        priority: 1,
        tone: "signal",
        title: `Deploy outbound for ${l.company}`,
        detail: l.nextAction,
        impact: formatCurrency(l.budget),
        href: `/leads/${l.id}`,
        tag: "High · Ready",
      });
    });

  leads
    .filter((l) => l.tier === TIER.MEDIUM)
    .forEach((l) => {
      const gap = BUDGET_GATE_DEFAULT - l.budget;
      actions.push({
        id: `act-${l.id}-nurture`,
        priority: 2,
        tone: "brass",
        title: `Close the gap on ${l.company}`,
        detail:
          gap > 0
            ? `Budget is ${formatCurrency(gap)} under gate — confirm expansion before re-score`
            : l.nextAction,
        impact: "Flip → High path",
        href: `/leads/${l.id}`,
        tag: "Medium · Unlock",
      });
    });

  leads
    .filter((l) => l.tier === TIER.LOW && l.intent !== "low")
    .forEach((l) => {
      actions.push({
        id: `act-${l.id}-park`,
        priority: 3,
        tone: "mist",
        title: `Park ${l.company} in long-cycle nurture`,
        detail: "Intent exists but ICP/budget fail — protect AE time",
        impact: "Save 2–4h / week",
        href: `/leads/${l.id}`,
        tag: "Low · Protect",
      });
    });

  return actions.sort((a, b) => a.priority - b.priority).slice(0, 6);
}

export default function DecisionDeskPage() {
  const stats = getLeadStats();
  const [gate, setGate] = useState(BUDGET_GATE_DEFAULT);

  const simulated = useMemo(() => simulateGate(gate), [gate]);
  const qualifiedAtGate = simulated.filter((l) => l.wouldQualify).length;
  const pipelineAtGate = simulated
    .filter((l) => l.wouldQualify)
    .reduce((sum, l) => sum + l.budget, 0);
  const flippedCount = simulated.filter(
    (l) => l.wouldQualify !== l.qualified
  ).length;

  const actions = useMemo(() => buildActions(LEADS), []);
  const watchlist = useMemo(
    () =>
      LEADS.filter((l) => l.tier !== TIER.HIGH)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    []
  );

  const meshHealth = [
    { label: "Qualifier accuracy", value: "94%", hint: "vs CRM truth set" },
    { label: "Human approval lag", value: "6.2m", hint: "median to decide" },
    { label: "Draft acceptance", value: "81%", hint: "approved without edit" },
    { label: "False-positive rate", value: "3.1%", hint: "Low marked High" },
  ];

  return (
    <AppShell>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <Scale className="h-3.5 w-3.5 text-signal/80" strokeWidth={1.75} />
            <span className="meta">Decision Desk</span>
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#eef2f7] sm:text-3xl">
            Scores with receipts
          </h1>
          <p className="body-muted mt-2 max-w-2xl">
            Not another opaque lead score. Simulate your qualification gate,
            see what would flip a tier, and get ranked actions your agents
            should take next — built for revenue ops that need auditability.
          </p>
        </div>
        <div
          className="flex items-center gap-2 self-start rounded-xl px-3 py-2 lg:self-auto"
          style={{
            background: "rgba(61,255,168,0.06)",
            boxShadow: "0 0 0 1px rgba(61,255,168,0.18)",
          }}
        >
          <ShieldCheck className="h-4 w-4 text-signal" />
          <span className="text-xs font-medium text-mist-bright">
            Explainable · Human-in-the-loop
          </span>
        </div>
      </header>

      {/* Gate simulator — the differentiator */}
      <motion.section
        className="surface p-4 sm:p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_TRANSITION}
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-brass" />
              <p className="meta">Live policy simulator</p>
            </div>
            <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              Qualification gate
            </h2>
            <p className="caption mt-1.5 max-w-lg">
              Drag the budget threshold. Watch how many accounts clear
              qualification in real time — before you change production policy.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="meta mb-1">Active gate</p>
            <p className="font-display text-2xl font-semibold tabular-nums text-signal">
              {formatCurrency(gate)}
            </p>
          </div>
        </div>

        <input
          type="range"
          min={10000}
          max={100000}
          step={1000}
          value={gate}
          onChange={(e) => setGate(Number(e.target.value))}
          className="gate-slider w-full"
          aria-label="Budget qualification gate"
        />
        <div className="mt-2 flex justify-between font-mono text-[10px] text-mist">
          <span>$10k</span>
          <span>Default $45k</span>
          <span>$100k</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {[
            {
              label: "Would qualify",
              value: qualifiedAtGate,
              sub: `of ${LEADS.length} accounts`,
            },
            {
              label: "Pipeline at gate",
              value: formatCurrency(pipelineAtGate),
              sub: "Qualified budget sum",
            },
            {
              label: "Status flips",
              value: flippedCount,
              sub: gate === BUDGET_GATE_DEFAULT ? "At current policy" : "vs live policy",
            },
            {
              label: "Live qualified",
              value: stats.qualified,
              sub: `Today at ${formatCurrency(BUDGET_GATE_DEFAULT)}`,
            },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              className="surface-sm p-3.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_TRANSITION, delay: 0.05 + i * 0.04 }}
            >
              <p className="meta mb-1">{m.label}</p>
              <p className="font-display text-lg font-semibold tabular-nums sm:text-xl">
                {m.value}
              </p>
              <p className="caption mt-1">{m.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4">
        {/* Ranked actions */}
        <motion.section
          className="surface flex flex-col p-4 sm:p-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING_TRANSITION, delay: 0.06 }}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-signal" />
                <p className="meta">Action queue</p>
              </div>
              <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                What to do next
              </h2>
              <p className="caption mt-1">
                Ranked by expected pipeline impact — not vanity activity.
              </p>
            </div>
            <TrendingUp className="h-4 w-4 shrink-0 text-mist" />
          </div>

          <div className="flex flex-col gap-2.5">
            {actions.map((action, i) => (
              <Link key={action.id} href={action.href}>
                <motion.div
                  className="group surface-sm flex flex-col gap-2 p-3.5 transition hover:border-white/10 sm:flex-row sm:items-center sm:gap-4"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...SPRING_TRANSITION, delay: 0.08 + i * 0.04 }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold"
                    style={{
                      background:
                        action.tone === "signal"
                          ? "rgba(61,255,168,0.12)"
                          : action.tone === "brass"
                            ? "rgba(232,184,109,0.12)"
                            : "rgba(184,198,216,0.1)",
                      color:
                        action.tone === "signal"
                          ? "#3dffa8"
                          : action.tone === "brass"
                            ? "#e8b86d"
                            : "#dce5f0",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-[#eef2f7]">
                        {action.title}
                      </p>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-mist">
                        {action.tag}
                      </span>
                    </div>
                    <p className="caption mt-0.5 line-clamp-2">{action.detail}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                    <span className="font-mono text-xs text-signal">
                      {action.impact}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-mist opacity-50 transition group-hover:text-signal group-hover:opacity-100" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <Link
            href="/"
            className="btn-primary mt-5 inline-flex w-full sm:w-auto sm:self-start"
          >
            <Sparkles className="h-4 w-4" />
            Open Console to execute
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>

        {/* Right column */}
        <div className="flex flex-col gap-3.5 lg:gap-4">
          {/* Counterfactuals */}
          <motion.section
            className="surface p-4 sm:p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
          >
            <div className="mb-1 flex items-center gap-2">
              <Lightbulb className="h-3.5 w-3.5 text-brass" />
              <p className="meta">Counterfactuals</p>
            </div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              What would flip the tier
            </h2>
            <p className="caption mt-1 mb-4">
              Concrete levers — not vague “improve engagement” advice.
            </p>

            <div className="space-y-3">
              {watchlist.map((lead, i) => {
                const blockers = counterfactual(lead);
                return (
                  <div
                    key={lead.id}
                    className="surface-sm p-3.5"
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-display text-sm font-semibold transition hover:text-signal"
                      >
                        {lead.company}
                      </Link>
                      <TierBadge tier={lead.tier} size="sm" />
                    </div>
                    <ul className="space-y-2">
                      {blockers.map((b) => (
                        <li key={b.label} className="text-xs leading-relaxed">
                          <span className="font-medium text-mist-bright">
                            {b.label}:{" "}
                          </span>
                          <span className="text-mist">{b.fix}</span>
                          <span className="mt-0.5 block font-mono text-[10px] text-signal/90">
                            → {b.impact}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Mesh integrity */}
          <motion.section
            className="surface p-4 sm:p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.14 }}
          >
            <div className="mb-1 flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-signal" />
              <p className="meta">Mesh integrity</p>
            </div>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Agent trust metrics
            </h2>
            <p className="caption mt-1 mb-4">
              Prove the mesh is earning autonomy — not just moving fast.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {meshHealth.map((m) => (
                <div key={m.label} className="surface-sm p-3">
                  <p className="meta mb-1">{m.label}</p>
                  <p className="font-display text-xl font-semibold tabular-nums text-[#eef2f7]">
                    {m.value}
                  </p>
                  <p className="caption mt-1">{m.hint}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.div
            className="surface-sm flex items-start gap-3 p-4"
            style={{
              background: "rgba(232,184,109,0.06)",
              boxShadow: "0 0 0 1px rgba(232,184,109,0.2)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
          >
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
            <div>
              <p className="text-sm font-medium text-[#eef2f7]">
                Why this isn&apos;t a generic scorer
              </p>
              <p className="caption mt-1.5">
                Every High / Medium / Low call is tied to weighted factors, a
                live budget gate, counterfactual levers, and a human approval
                path before outbound fires. Clients buy outcomes they can
                defend — not black-box scores.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
