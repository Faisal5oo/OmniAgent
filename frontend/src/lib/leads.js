/**
 * CRM lead intelligence — scoring model used across console surfaces.
 * Tier thresholds mirror backend qualifier budget gate ($45k) with
 * richer multi-factor scoring for the ops UI.
 */

export const TIER = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

export const TIER_META = {
  [TIER.HIGH]: {
    label: "High",
    short: "H",
    description: "Priority outbound — strong fit, budget, and intent signals.",
    color: "#3dffa8",
    bg: "rgba(61,255,168,0.1)",
    border: "rgba(61,255,168,0.28)",
  },
  [TIER.MEDIUM]: {
    label: "Medium",
    short: "M",
    description: "Nurture track — viable fit with gaps in budget or engagement.",
    color: "#e8b86d",
    bg: "rgba(232,184,109,0.1)",
    border: "rgba(232,184,109,0.28)",
  },
  [TIER.LOW]: {
    label: "Low",
    short: "L",
    description: "Deprioritized — weak budget, fit, or readiness indicators.",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.25)",
  },
};

/** Score band → tier mapping used by the qualification engine UI. */
export function scoreToTier(score) {
  if (score >= 72) return TIER.HIGH;
  if (score >= 45) return TIER.MEDIUM;
  return TIER.LOW;
}

export const LEADS = [
  {
    id: "ld-ent-001",
    company: "Enterprise Corp",
    domain: "enterprisecorp.io",
    industry: "FinTech",
    segment: "Enterprise",
    employees: "2,400–5,000",
    hq: "San Francisco, CA",
    region: "North America",
    contact: {
      name: "Sarah Chen",
      title: "VP of Revenue Operations",
      email: "s.chen@enterprisecorp.io",
      phone: "+1 (415) 555-0142",
      linkedin: "linkedin.com/in/sarahchen",
    },
    budget: 75000,
    historicalValue: 75000,
    score: 88,
    tier: TIER.HIGH,
    qualified: true,
    risk: "low",
    intent: "high",
    stage: "Qualified",
    owner: "Outbound Mesh",
    source: "CRM enrichment · Intent signal",
    lastActivity: "2026-07-10T14:22:00Z",
    createdAt: "2026-06-18T09:00:00Z",
    nextAction: "Approve personalized outreach draft",
    tags: ["Tier-1", "FinTech", "Budget-ready"],
    factors: [
      {
        id: "budget",
        label: "Budget capacity",
        weight: 30,
        score: 95,
        detail: "Historical contract value $75k exceeds $45k qualification gate by 67%.",
      },
      {
        id: "fit",
        label: "ICP fit",
        weight: 25,
        score: 92,
        detail: "FinTech enterprise segment matches primary ICP. Headcount and stack aligned.",
      },
      {
        id: "intent",
        label: "Buying intent",
        weight: 20,
        score: 85,
        detail: "Recent CRM activity shows outbound campaign interest and pricing page visits.",
      },
      {
        id: "engagement",
        label: "Engagement depth",
        weight: 15,
        score: 78,
        detail: "3 prior touchpoints with VP RevOps. Email open rate above cohort average.",
      },
      {
        id: "risk",
        label: "Risk profile",
        weight: 10,
        score: 90,
        detail: "CRM risk score: low. No payment disputes or churn flags on record.",
      },
    ],
    rationale: {
      summary:
        "Classified High because budget, ICP fit, and intent all clear internal thresholds. This account is ready for personalized outbound with human approval before dispatch.",
      positives: [
        "Budget baseline $75,000 ≥ $45,000 qualification threshold",
        "Low CRM risk profile with Tier-1 client history",
        "Decision-maker identified (VP Revenue Operations)",
        "Industry (FinTech) matches priority vertical",
      ],
      concerns: [
        "Procurement cycles at this size average 21–35 days",
        "Competitor evaluation possible — draft should differentiate clearly",
      ],
      recommendation:
        "Prioritize immediately. Route through Email Drafter → human approval → Outbound Gateway.",
    },
    timeline: [
      { at: "2026-07-10T14:22:00Z", event: "Intent signal spiked — pricing page cluster", type: "signal" },
      { at: "2026-07-08T11:05:00Z", event: "CRM enrichment refreshed from Salesforce", type: "system" },
      { at: "2026-06-28T16:40:00Z", event: "Intro email opened by S. Chen (2×)", type: "engagement" },
      { at: "2026-06-18T09:00:00Z", event: "Lead ingested into OmniAgent pipeline", type: "system" },
    ],
    firmographics: {
      revenue: "$180M–$250M ARR",
      techStack: ["Salesforce", "Segment", "Snowflake", "HubSpot"],
      funding: "Series D",
      growth: "+22% YoY headcount",
    },
  },
  {
    id: "ld-nxs-002",
    company: "Nexus Analytics",
    domain: "nexusanalytics.com",
    industry: "SaaS / Data",
    segment: "Mid-Market",
    employees: "250–500",
    hq: "Austin, TX",
    region: "North America",
    contact: {
      name: "Marcus Webb",
      title: "Director of Growth",
      email: "m.webb@nexusanalytics.com",
      phone: "+1 (512) 555-0198",
      linkedin: "linkedin.com/in/marcuswebb",
    },
    budget: 42000,
    historicalValue: 38000,
    score: 61,
    tier: TIER.MEDIUM,
    qualified: false,
    risk: "medium",
    intent: "medium",
    stage: "Nurture",
    owner: "SDR Desk",
    source: "Inbound demo request",
    lastActivity: "2026-07-09T18:10:00Z",
    createdAt: "2026-07-01T12:30:00Z",
    nextAction: "Confirm expanded budget before full qualification",
    tags: ["Mid-Market", "Inbound", "Budget-gap"],
    factors: [
      {
        id: "budget",
        label: "Budget capacity",
        weight: 30,
        score: 48,
        detail: "Stated budget $42k sits 7% below the $45k qualification gate.",
      },
      {
        id: "fit",
        label: "ICP fit",
        weight: 25,
        score: 74,
        detail: "Strong product-market adjacency; mid-market SaaS is secondary ICP.",
      },
      {
        id: "intent",
        label: "Buying intent",
        weight: 20,
        score: 70,
        detail: "Inbound demo request is a clear intent signal; no multi-threading yet.",
      },
      {
        id: "engagement",
        label: "Engagement depth",
        weight: 15,
        score: 55,
        detail: "Single champion engaged. No executive sponsor confirmed.",
      },
      {
        id: "risk",
        label: "Risk profile",
        weight: 10,
        score: 58,
        detail: "Medium CRM risk — shorter average contract tenure in segment.",
      },
    ],
    rationale: {
      summary:
        "Classified Medium because ICP and intent are solid, but budget is just under the qualification gate and multi-threading is incomplete.",
      positives: [
        "Inbound demo request indicates active evaluation",
        "Director-level champion identified",
        "Tech stack overlap with current wins",
      ],
      concerns: [
        "Budget $42k is below $45k automated qualification threshold",
        "No VP+ sponsor on thread yet",
        "Medium risk score on historical tenure",
      ],
      recommendation:
        "Nurture with value content. Re-qualify if budget expands ≥ $45k or executive joins evaluation.",
    },
    timeline: [
      { at: "2026-07-09T18:10:00Z", event: "Demo request form submitted", type: "signal" },
      { at: "2026-07-05T10:00:00Z", event: "Website pricing page session (4m 12s)", type: "engagement" },
      { at: "2026-07-01T12:30:00Z", event: "Lead created from inbound webhook", type: "system" },
    ],
    firmographics: {
      revenue: "$28M–$40M ARR",
      techStack: ["HubSpot", "Amplitude", "AWS"],
      funding: "Series B",
      growth: "+35% YoY revenue",
    },
  },
  {
    id: "ld-stl-003",
    company: "Startup LLC",
    domain: "startupllc.co",
    industry: "E-Commerce",
    segment: "SMB",
    employees: "25–50",
    hq: "Remote / Berlin",
    region: "EMEA",
    contact: {
      name: "Elena Vogt",
      title: "Founder & CEO",
      email: "elena@startupllc.co",
      phone: "+49 30 555 0177",
      linkedin: "linkedin.com/in/elenavogt",
    },
    budget: 12000,
    historicalValue: 12000,
    score: 28,
    tier: TIER.LOW,
    qualified: false,
    risk: "medium",
    intent: "low",
    stage: "Disqualified",
    owner: "Unassigned",
    source: "Cold list append",
    lastActivity: "2026-07-02T08:45:00Z",
    createdAt: "2026-06-22T15:00:00Z",
    nextAction: "Park in long-cycle nurture — do not prioritize outbound",
    tags: ["SMB", "Below-threshold", "E-Commerce"],
    factors: [
      {
        id: "budget",
        label: "Budget capacity",
        weight: 30,
        score: 18,
        detail: "Historical value $12k is 73% below the $45k qualification gate.",
      },
      {
        id: "fit",
        label: "ICP fit",
        weight: 25,
        score: 35,
        detail: "E-Commerce SMB sits outside primary enterprise ICP.",
      },
      {
        id: "intent",
        label: "Buying intent",
        weight: 20,
        score: 22,
        detail: "No recent product or pricing engagement detected.",
      },
      {
        id: "engagement",
        label: "Engagement depth",
        weight: 15,
        score: 30,
        detail: "Cold append with zero verified replies.",
      },
      {
        id: "risk",
        label: "Risk profile",
        weight: 10,
        score: 45,
        detail: "Medium risk — early-stage cash constraints common in cohort.",
      },
    ],
    rationale: {
      summary:
        "Classified Low because budget, ICP fit, and intent all fall well below operational thresholds. Automated qualification correctly marked this lead as unqualified.",
      positives: [
        "Founder-accessible (fast decisions if budget changes)",
        "Could become mid-market later if growth continues",
      ],
      concerns: [
        "Budget $12k far below $45k gate",
        "Outside primary ICP (enterprise FinTech / SaaS)",
        "No verified engagement or intent signals",
        "Cold list source has historically low conversion",
      ],
      recommendation:
        "Do not route to active outbound. Optionally enroll in quarterly nurture drip only.",
    },
    timeline: [
      { at: "2026-07-02T08:45:00Z", event: "Auto-scored Low by qualifier mesh", type: "system" },
      { at: "2026-06-22T15:00:00Z", event: "Imported from cold append list", type: "system" },
    ],
    firmographics: {
      revenue: "< $3M ARR",
      techStack: ["Shopify", "Klaviyo"],
      funding: "Seed",
      growth: "Early stage",
    },
  },
  {
    id: "ld-arc-004",
    company: "ArcLight Health",
    domain: "arclight.health",
    industry: "HealthTech",
    segment: "Enterprise",
    employees: "1,000–2,500",
    hq: "Boston, MA",
    region: "North America",
    contact: {
      name: "Dr. Priya Nair",
      title: "Chief Digital Officer",
      email: "p.nair@arclight.health",
      phone: "+1 (617) 555-0163",
      linkedin: "linkedin.com/in/priyanair",
    },
    budget: 92000,
    historicalValue: 88000,
    score: 91,
    tier: TIER.HIGH,
    qualified: true,
    risk: "low",
    intent: "high",
    stage: "Qualified",
    owner: "Enterprise AE",
    source: "Partner referral",
    lastActivity: "2026-07-11T07:30:00Z",
    createdAt: "2026-05-14T10:00:00Z",
    nextAction: "Schedule security review + draft exec brief",
    tags: ["Tier-1", "HealthTech", "Partner-sourced"],
    factors: [
      {
        id: "budget",
        label: "Budget capacity",
        weight: 30,
        score: 98,
        detail: "Approved budget envelope $92k — nearly 2× the qualification gate.",
      },
      {
        id: "fit",
        label: "ICP fit",
        weight: 25,
        score: 88,
        detail: "Enterprise HealthTech is strategic vertical for H2 pipeline.",
      },
      {
        id: "intent",
        label: "Buying intent",
        weight: 20,
        score: 90,
        detail: "Partner referral with active RFP timeline (Q3 close target).",
      },
      {
        id: "engagement",
        label: "Engagement depth",
        weight: 15,
        score: 86,
        detail: "CDO + IT security engaged. Multi-threaded evaluation.",
      },
      {
        id: "risk",
        label: "Risk profile",
        weight: 10,
        score: 88,
        detail: "Low risk. Compliance-heavy buyer but strong payment history.",
      },
    ],
    rationale: {
      summary:
        "Classified High due to oversized budget, strategic vertical fit, partner-sourced intent, and multi-threaded engagement at C-level.",
      positives: [
        "Budget $92k well above gate",
        "CDO as primary contact — executive authority",
        "Partner referral increases win probability",
        "Clear Q3 decision timeline",
      ],
      concerns: [
        "Security / HIPAA review may extend cycle by 2–3 weeks",
        "Requires custom compliance language in outreach",
      ],
      recommendation:
        "Treat as flagship opportunity. Pair outreach with security one-pager before approval send.",
    },
    timeline: [
      { at: "2026-07-11T07:30:00Z", event: "Partner shared RFP timeline update", type: "signal" },
      { at: "2026-07-03T13:00:00Z", event: "Security questionnaire received", type: "engagement" },
      { at: "2026-06-12T09:20:00Z", event: "Intro call completed with CDO", type: "engagement" },
      { at: "2026-05-14T10:00:00Z", event: "Partner referral ingested", type: "system" },
    ],
    firmographics: {
      revenue: "$95M–$140M ARR",
      techStack: ["Epic", "AWS", "Okta", "Salesforce"],
      funding: "Private equity backed",
      growth: "+18% YoY patient volume",
    },
  },
  {
    id: "ld-brv-005",
    company: "BraveCart Commerce",
    domain: "bravecart.com",
    industry: "Retail Tech",
    segment: "Mid-Market",
    employees: "120–200",
    hq: "Toronto, ON",
    region: "North America",
    contact: {
      name: "James Okoro",
      title: "Head of Marketing",
      email: "j.okoro@bravecart.com",
      phone: "+1 (416) 555-0119",
      linkedin: "linkedin.com/in/jamesokoro",
    },
    budget: 31000,
    historicalValue: 24000,
    score: 44,
    tier: TIER.LOW,
    qualified: false,
    risk: "medium",
    intent: "medium",
    stage: "Review",
    owner: "Marketing Ops",
    source: "Webinar attendee",
    lastActivity: "2026-07-07T20:15:00Z",
    createdAt: "2026-06-30T18:00:00Z",
    nextAction: "Validate budget expansion before re-score",
    tags: ["Retail", "Webinar", "Budget-short"],
    factors: [
      {
        id: "budget",
        label: "Budget capacity",
        weight: 30,
        score: 32,
        detail: "Budget $31k is 31% under the $45k gate — primary disqualifier.",
      },
      {
        id: "fit",
        label: "ICP fit",
        weight: 25,
        score: 52,
        detail: "Retail tech mid-market is tertiary ICP only.",
      },
      {
        id: "intent",
        label: "Buying intent",
        weight: 20,
        score: 60,
        detail: "Webinar attendance shows curiosity; no commercial conversation yet.",
      },
      {
        id: "engagement",
        label: "Engagement depth",
        weight: 15,
        score: 40,
        detail: "Marketing-level contact only — no revenue owner engaged.",
      },
      {
        id: "risk",
        label: "Risk profile",
        weight: 10,
        score: 50,
        detail: "Medium risk. Seasonal spend patterns in retail cohort.",
      },
    ],
    rationale: {
      summary:
        "Classified Low primarily on budget shortfall. Intent is moderate via webinar attendance, but ICP fit and decision-maker access are weak.",
      positives: [
        "Warm webinar engagement",
        "Marketing leader is reachable",
      ],
      concerns: [
        "Budget $31k below qualification threshold",
        "No revenue / ops stakeholder on thread",
        "Tertiary ICP — lower win rates historically",
      ],
      recommendation:
        "Hold from active pipeline. Re-score only if budget rises or RevOps joins evaluation.",
    },
    timeline: [
      { at: "2026-07-07T20:15:00Z", event: "Attended 'Outbound at Scale' webinar", type: "engagement" },
      { at: "2026-06-30T18:00:00Z", event: "Lead synced from webinar platform", type: "system" },
    ],
    firmographics: {
      revenue: "$12M–$18M ARR",
      techStack: ["Shopify Plus", "Klaviyo", "GA4"],
      funding: "Series A",
      growth: "+12% YoY GMV",
    },
  },
  {
    id: "ld-qnt-006",
    company: "QuantumForge Systems",
    domain: "quantumforge.ai",
    industry: "AI Infrastructure",
    segment: "Enterprise",
    employees: "800–1,200",
    hq: "Seattle, WA",
    region: "North America",
    contact: {
      name: "Alex Rivera",
      title: "VP Platform Engineering",
      email: "a.rivera@quantumforge.ai",
      phone: "+1 (206) 555-0184",
      linkedin: "linkedin.com/in/alexrivera",
    },
    budget: 58000,
    historicalValue: 52000,
    score: 76,
    tier: TIER.HIGH,
    qualified: true,
    risk: "low",
    intent: "medium",
    stage: "Qualified",
    owner: "Outbound Mesh",
    source: "Technographic match",
    lastActivity: "2026-07-10T09:50:00Z",
    createdAt: "2026-06-05T11:20:00Z",
    nextAction: "Draft technical outreach emphasizing integration depth",
    tags: ["Tier-1", "AI-Infra", "Technographic"],
    factors: [
      {
        id: "budget",
        label: "Budget capacity",
        weight: 30,
        score: 80,
        detail: "Budget $58k clears the $45k gate with healthy margin.",
      },
      {
        id: "fit",
        label: "ICP fit",
        weight: 25,
        score: 90,
        detail: "AI infrastructure enterprise is top-priority ICP for this quarter.",
      },
      {
        id: "intent",
        label: "Buying intent",
        weight: 20,
        score: 58,
        detail: "Technographic match only — no inbound request yet. Intent inferred.",
      },
      {
        id: "engagement",
        label: "Engagement depth",
        weight: 15,
        score: 65,
        detail: "VP Platform identified; one LinkedIn touch, no email reply yet.",
      },
      {
        id: "risk",
        label: "Risk profile",
        weight: 10,
        score: 85,
        detail: "Low risk. Strong balance sheet and prior vendor expansion pattern.",
      },
    ],
    rationale: {
      summary:
        "Classified High on budget + exceptional ICP fit. Intent is only medium (outbound-sourced), so messaging must earn the reply.",
      positives: [
        "Budget above gate ($58k)",
        "Perfect ICP match for AI infrastructure",
        "VP-level technical buyer identified",
        "Low commercial risk",
      ],
      concerns: [
        "No inbound intent — cold-start conversation",
        "Engineering buyers require higher technical specificity",
      ],
      recommendation:
        "Qualify for outbound with technical depth. Avoid generic sales language; emphasize integration and latency ROI.",
    },
    timeline: [
      { at: "2026-07-10T09:50:00Z", event: "Technographic refresh — Kubernetes + GPU cluster detected", type: "signal" },
      { at: "2026-06-20T15:00:00Z", event: "LinkedIn connection accepted by A. Rivera", type: "engagement" },
      { at: "2026-06-05T11:20:00Z", event: "Lead scored from technographic crawl", type: "system" },
    ],
    firmographics: {
      revenue: "$110M–$160M ARR",
      techStack: ["Kubernetes", "PyTorch", "GCP", "Datadog"],
      funding: "Series C",
      growth: "+40% YoY cloud spend",
    },
  },
];

export function getLeadById(id) {
  return LEADS.find((l) => l.id === id) || null;
}

export function getLeadStats() {
  const high = LEADS.filter((l) => l.tier === TIER.HIGH).length;
  const medium = LEADS.filter((l) => l.tier === TIER.MEDIUM).length;
  const low = LEADS.filter((l) => l.tier === TIER.LOW).length;
  const qualified = LEADS.filter((l) => l.qualified).length;
  const pipelineValue = LEADS.filter((l) => l.qualified).reduce(
    (sum, l) => sum + l.budget,
    0
  );
  return {
    total: LEADS.length,
    high,
    medium,
    low,
    qualified,
    pipelineValue,
  };
}

export function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatRelativeDate(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAbsoluteDate(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
