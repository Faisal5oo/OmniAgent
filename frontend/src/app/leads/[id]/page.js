"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  Sparkles,
  User,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import TierBadge from "@/components/TierBadge";
import ScoreBar from "@/components/ScoreBar";
import {
  TIER_META,
  formatAbsoluteDate,
  formatCurrency,
  formatRelativeDate,
  getLeadById,
} from "@/lib/leads";
import { SPRING_TRANSITION } from "@/lib/constants";

function Metric({ label, value, sub }) {
  return (
    <div className="surface-sm p-3.5">
      <p className="meta mb-1">{label}</p>
      <p className="font-display text-base font-semibold tracking-tight text-[#eef2f7] sm:text-lg">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[11px] text-mist-dim">{sub}</p>}
    </div>
  );
}

function TimelineItem({ item, isLast }) {
  const tint =
    item.type === "signal"
      ? "#3dffa8"
      : item.type === "engagement"
        ? "#e8b86d"
        : "#8b9cb3";

  return (
    <div className="relative flex gap-3 pb-5 last:pb-0">
      {!isLast && (
        <span className="absolute left-[5px] top-3 bottom-0 w-px bg-white/[0.06]" />
      )}
      <span
        className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: tint, boxShadow: `0 0 8px ${tint}66` }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[#eef2f7]">{item.event}</p>
        <p className="mt-0.5 font-mono text-[10px] text-mist-dim">
          {formatAbsoluteDate(item.at)} · {item.type}
        </p>
      </div>
    </div>
  );
}

function LeadNotFound() {
  return (
    <AppShell>
      <div className="surface flex flex-col items-center justify-center px-6 py-24 text-center">
        <ShieldAlert className="mb-4 h-10 w-10 text-brass" />
        <h1 className="font-display text-xl font-semibold">Lead not found</h1>
        <p className="mt-2 text-sm text-mist">
          This account ID is not in the current portfolio.
        </p>
        <Link
          href="/leads"
          className="btn-ghost mt-6 inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to leads
        </Link>
      </div>
    </AppShell>
  );
}

export default function LeadDetailPage() {
  const params = useParams();
  const lead = getLeadById(params.id);

  if (!lead) return <LeadNotFound />;

  const meta = TIER_META[lead.tier];
  const weightedScore = Math.round(
    lead.factors.reduce((sum, f) => sum + (f.score * f.weight) / 100, 0)
  );

  return (
    <AppShell>
      {/* Breadcrumb / back */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Link
          href="/leads"
          className="inline-flex items-center gap-1.5 text-mist transition hover:text-mist-bright"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Leads
        </Link>
        <span className="text-mist-dim">/</span>
        <span className="truncate font-medium text-[#eef2f7]">
          {lead.company}
        </span>
      </div>

      {/* Hero header */}
      <motion.section
        className="surface overflow-hidden p-4 sm:p-6 lg:p-7"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_TRANSITION}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(ellipse 70% 80% at 0% 0%, ${meta.bg}, transparent 55%)`,
          }}
        />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-semibold sm:h-16 sm:w-16 sm:text-xl"
              style={{
                background: meta.bg,
                color: meta.color,
                boxShadow: `0 0 0 1px ${meta.border}`,
              }}
            >
              {lead.company.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <TierBadge tier={lead.tier} />
                <span
                  className="rounded-lg px-2 py-1 font-mono text-[10px] uppercase tracking-wider"
                  style={{
                    color: lead.qualified ? "#3dffa8" : "#f87171",
                    background: lead.qualified
                      ? "rgba(61,255,168,0.1)"
                      : "rgba(248,113,113,0.1)",
                    boxShadow: lead.qualified
                      ? "0 0 0 1px rgba(61,255,168,0.25)"
                      : "0 0 0 1px rgba(248,113,113,0.22)",
                  }}
                >
                  {lead.qualified ? "Qualified" : "Unqualified"}
                </span>
                <span className="rounded-lg px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-mist"
                  style={{ boxShadow: "0 0 0 1px rgba(139,156,179,0.15)" }}
                >
                  {lead.stage}
                </span>
              </div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-[#eef2f7] sm:text-3xl">
                {lead.company}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mist">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {lead.industry}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {lead.hq}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {lead.domain}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 self-start rounded-2xl px-4 py-3 sm:gap-5"
            style={{
              background: "rgba(5,6,7,0.45)",
              boxShadow: `0 0 0 1px ${meta.border}`,
            }}
          >
            <div>
              <p className="meta mb-0.5">Composite score</p>
              <p
                className="font-display text-3xl font-semibold tabular-nums sm:text-4xl"
                style={{ color: meta.color }}
              >
                {lead.score}
              </p>
            </div>
            <div className="h-12 w-px bg-white/[0.08]" />
            <div>
              <p className="meta mb-0.5">Tier</p>
              <p className="font-display text-lg font-semibold" style={{ color: meta.color }}>
                {meta.label}
              </p>
              <p className="mt-0.5 max-w-[140px] text-[10px] leading-snug text-mist-dim">
                {meta.description}
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        <Metric label="Budget" value={formatCurrency(lead.budget)} sub={`Gate $45k · ${lead.budget >= 45000 ? "Above" : "Below"}`} />
        <Metric label="Historical value" value={formatCurrency(lead.historicalValue)} sub="CRM baseline" />
        <Metric label="Risk" value={lead.risk.charAt(0).toUpperCase() + lead.risk.slice(1)} sub={`Intent: ${lead.intent}`} />
        <Metric label="Owner" value={lead.owner} sub={`Updated ${formatRelativeDate(lead.lastActivity)}`} />
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4">
        {/* Scoring rationale */}
        <div className="flex flex-col gap-3.5 lg:gap-4">
          <motion.section
            className="surface p-4 sm:p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.06 }}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="meta mb-1">Why this tier</p>
                <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                  Qualification rationale
                </h2>
              </div>
              <Sparkles className="h-4 w-4 shrink-0 text-brass/70" />
            </div>

            <p className="text-sm leading-relaxed text-mist-bright">
              {lead.rationale.summary}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="meta mb-2.5 flex items-center gap-1.5 text-signal">
                  <CheckCircle2 className="h-3 w-3" />
                  Supporting signals
                </p>
                <ul className="space-y-2">
                  {lead.rationale.positives.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-xs leading-relaxed text-mist"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="meta mb-2.5 flex items-center gap-1.5 text-brass">
                  <AlertTriangle className="h-3 w-3" />
                  Watch-outs
                </p>
                <ul className="space-y-2">
                  {lead.rationale.concerns.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2 text-xs leading-relaxed text-mist"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brass" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className="mt-5 rounded-xl px-3.5 py-3"
              style={{
                background: "rgba(61,255,168,0.05)",
                boxShadow: "0 0 0 1px rgba(61,255,168,0.15)",
              }}
            >
              <p className="meta mb-1 text-signal/80">Recommended action</p>
              <p className="text-sm leading-relaxed text-[#eef2f7]">
                {lead.rationale.recommendation}
              </p>
            </div>
          </motion.section>

          <motion.section
            className="surface p-4 sm:p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.1 }}
          >
            <div className="mb-1 flex items-center justify-between gap-3">
              <div>
                <p className="meta mb-1">Factor model</p>
                <h2 className="font-display text-lg font-semibold tracking-tight sm:text-xl">
                  Score breakdown
                </h2>
              </div>
              <div className="text-right">
                <p className="meta">Weighted</p>
                <p className="font-mono text-sm font-semibold tabular-nums text-signal">
                  {weightedScore}
                </p>
              </div>
            </div>
            <p className="mb-5 text-xs text-mist-dim">
              Composite = Σ (factor score × weight). High ≥ 72 · Medium ≥ 45 · Low &lt; 45
            </p>
            <div className="space-y-4">
              {lead.factors.map((factor, i) => (
                <ScoreBar key={factor.id} factor={factor} delay={0.12 + i * 0.05} />
              ))}
            </div>
          </motion.section>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3.5 lg:gap-4">
          <motion.section
            className="surface p-4 sm:p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.08 }}
          >
            <p className="meta mb-3">Primary contact</p>
            <div className="flex items-start gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(139,156,179,0.08)",
                  boxShadow: "0 0 0 1px rgba(139,156,179,0.15)",
                }}
              >
                <User className="h-4 w-4 text-mist" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-base font-semibold tracking-tight">
                  {lead.contact.name}
                </p>
                <p className="text-xs text-mist">{lead.contact.title}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              <a
                href={`mailto:${lead.contact.email}`}
                className="flex items-center gap-2 text-xs text-mist transition hover:text-signal"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{lead.contact.email}</span>
              </a>
              <a
                href={`tel:${lead.contact.phone}`}
                className="flex items-center gap-2 text-xs text-mist transition hover:text-signal"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {lead.contact.phone}
              </a>
              <p className="flex items-center gap-2 text-xs text-mist-dim">
                <Globe className="h-3.5 w-3.5 shrink-0" />
                {lead.contact.linkedin}
              </p>
            </div>
          </motion.section>

          <motion.section
            className="surface p-4 sm:p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.12 }}
          >
            <p className="meta mb-3">Firmographics</p>
            <dl className="space-y-3">
              {[
                ["Employees", lead.employees],
                ["Segment", lead.segment],
                ["Region", lead.region],
                ["Revenue", lead.firmographics.revenue],
                ["Funding", lead.firmographics.funding],
                ["Growth", lead.firmographics.growth],
                ["Source", lead.source],
                ["Next action", lead.nextAction],
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-3">
                  <dt className="shrink-0 text-xs text-mist-dim">{k}</dt>
                  <dd className="text-right text-xs font-medium text-[#eef2f7]">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <p className="meta mb-2">Tech stack</p>
              <div className="flex flex-wrap gap-1.5">
                {lead.firmographics.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md px-2 py-1 font-mono text-[10px] text-mist"
                    style={{ boxShadow: "0 0 0 1px rgba(139,156,179,0.12)" }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="meta mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md px-2 py-1 text-[10px] font-medium text-signal"
                    style={{
                      background: "rgba(61,255,168,0.08)",
                      boxShadow: "0 0 0 1px rgba(61,255,168,0.15)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            className="surface p-4 sm:p-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_TRANSITION, delay: 0.14 }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-mist" />
              <p className="meta">Activity timeline</p>
            </div>
            <div>
              {lead.timeline.map((item, i) => (
                <TimelineItem
                  key={`${item.at}-${i}`}
                  item={item}
                  isLast={i === lead.timeline.length - 1}
                />
              ))}
            </div>
          </motion.section>

          <motion.div
            className="surface-sm flex items-start gap-3 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            style={{
              background: lead.qualified
                ? "rgba(61,255,168,0.06)"
                : "rgba(248,113,113,0.06)",
              boxShadow: lead.qualified
                ? "0 0 0 1px rgba(61,255,168,0.18)"
                : "0 0 0 1px rgba(248,113,113,0.18)",
            }}
          >
            {lead.qualified ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            )}
            <div>
              <p className="text-sm font-medium text-[#eef2f7]">
                {lead.qualified
                  ? "Clears automated qualification gate"
                  : "Fails automated qualification gate"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-mist">
                Budget {formatCurrency(lead.budget)} vs $45,000 threshold · Risk{" "}
                {lead.risk} · Intent {lead.intent}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
