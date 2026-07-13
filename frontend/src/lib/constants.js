export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export const PIPELINE_NODES = [
  {
    id: "qualifier",
    label: "Lead Qualifier",
    shortLabel: "Qualifier",
    accent: "emerald",
    description: "CRM extraction & lead scoring",
    angle: -135,
    radius: 148,
  },
  {
    id: "retriever",
    label: "Context Retriever",
    shortLabel: "Retriever",
    accent: "indigo",
    description: "Vector knowledge synthesis",
    angle: -45,
    radius: 148,
  },
  {
    id: "drafter",
    label: "Email Drafter",
    shortLabel: "Drafter",
    accent: "violet",
    description: "Outbound copy generation",
    angle: 135,
    radius: 148,
  },
  {
    id: "sender",
    label: "Outbound Gateway",
    shortLabel: "Gateway",
    accent: "cyan",
    description: "Campaign dispatch control",
    angle: 45,
    radius: 148,
  },
];

export const NODE_STATUS = {
  IDLE: "idle",
  ACTIVE: "active",
  COMPLETE: "complete",
  ERROR: "error",
};

export const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 320,
  damping: 28,
};

export const SPRING_GENTLE = {
  type: "spring",
  stiffness: 200,
  damping: 28,
};

export const EASE_OUT = [0.22, 1, 0.36, 1];

export const ACCENT_MAP = {
  emerald: {
    glow: "rgba(61,255,168,0.45)",
    line: "#3dffa8",
    text: "text-signal",
    bg: "from-signal/15 to-transparent",
  },
  indigo: {
    glow: "rgba(125,211,252,0.4)",
    line: "#7dd3fc",
    text: "text-sky-300",
    bg: "from-sky-400/15 to-transparent",
  },
  violet: {
    glow: "rgba(232,184,109,0.4)",
    line: "#e8b86d",
    text: "text-brass",
    bg: "from-brass/15 to-transparent",
  },
  cyan: {
    glow: "rgba(94,234,212,0.4)",
    line: "#5eead4",
    text: "text-teal-300",
    bg: "from-teal-400/15 to-transparent",
  },
};
