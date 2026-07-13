"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Loader2,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  FileText,
} from "lucide-react";
import { SPRING_TRANSITION, EASE_OUT } from "@/lib/constants";

function ApprovalActionDeck({
  isSubmitting,
  draftText,
  onApprove,
  onEnterEditMode,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [actionError, setActionError] = useState(null);

  const handleRejectToEdit = () => {
    setActionError(null);
    setIsEditing(true);
    onEnterEditMode?.();
  };

  const handleApprove = async () => {
    setActionError(null);
    try {
      await onApprove(draftText);
    } catch (err) {
      setActionError(err.message || "Approval failed.");
    }
  };

  return (
    <motion.div
      className="border-t border-white/[0.06] px-4 py-4 sm:px-6 sm:py-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
    >
      <div className="mb-3 flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-brass" />
        <p className="meta text-brass">Authorization required</p>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-mist-bright">
        {isEditing
          ? "Revise the draft below, then approve to dispatch."
          : "Review the draft above. Reject to edit, or approve to send as-is."}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <AnimatePresence mode="wait" initial={false}>
          {!isEditing ? (
            <motion.button
              key="reject"
              type="button"
              disabled={isSubmitting}
              onClick={handleRejectToEdit}
              className="relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition disabled:opacity-50"
              style={{
                background: "rgba(127,29,29,0.12)",
                boxShadow: "0 0 0 1px rgba(248,113,113,0.2)",
              }}
              initial={{ opacity: 0, x: -8, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -12, scale: 0.92 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={SPRING_TRANSITION}
            >
              <XCircle className="h-4 w-4" />
              Reject
            </motion.button>
          ) : (
            <motion.button
              key="edit"
              type="button"
              disabled
              className="relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium text-brass"
              style={{
                background: "rgba(232,184,109,0.12)",
                boxShadow: "0 0 0 1px rgba(232,184,109,0.35)",
              }}
              initial={{ opacity: 0, x: 12, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.96 }}
              transition={SPRING_TRANSITION}
            >
              <Pencil className="relative h-4 w-4" />
              <span className="relative">Editing</span>
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          disabled={isSubmitting || !draftText?.trim()}
          onClick={handleApprove}
          className="btn-primary flex-1"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          Approve
        </motion.button>
      </div>

      {actionError && (
        <p className="mt-3 text-sm text-red-400">{actionError}</p>
      )}
    </motion.div>
  );
}

export default function StreamingOutput({
  text,
  onDraftChange,
  isStreaming,
  completion,
  requiresApproval = false,
  isApproving = false,
  onApprove,
}) {
  const textareaRef = useRef(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  useEffect(() => {
    if (!requiresApproval) {
      setIsEditingDraft(false);
    }
  }, [requiresApproval]);

  const draftReadOnly = isStreaming || (requiresApproval && !isEditingDraft);

  const statusLabel = completion?.requires_approval
    ? "Pending authorization"
    : completion?.lead_data?.qualified
      ? "Qualified"
      : completion?.lead_data
        ? "Pending"
        : null;

  return (
    <motion.section
      className="surface flex min-h-[280px] flex-1 flex-col sm:min-h-[320px]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_TRANSITION, delay: 0.12 }}
    >
      <div className="border-b border-white/[0.06] px-4 py-3.5 sm:px-6 sm:py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "rgba(61,255,168,0.08)",
                boxShadow: "0 0 0 1px rgba(61,255,168,0.15)",
              }}
            >
              <FileText className="h-4 w-4 text-signal" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="meta mb-0.5">Output stream</p>
              <h2 className="font-display text-base font-semibold tracking-tight text-[#eef2f7] sm:text-lg">
                Email draft
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap shrink-0 items-center gap-2">
            {statusLabel && (
              <span
                className="rounded-lg px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider"
                style={
                  requiresApproval
                    ? {
                        background: "rgba(232,184,109,0.1)",
                        color: "#e8b86d",
                        boxShadow: "0 0 0 1px rgba(232,184,109,0.2)",
                      }
                    : {
                        background: "rgba(139,156,179,0.08)",
                        color: "#8b9cb3",
                        boxShadow: "0 0 0 1px rgba(139,156,179,0.15)",
                      }
                }
              >
                {statusLabel}
              </span>
            )}
            {isStreaming && (
              <motion.span
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-signal"
                style={{
                  background: "rgba(61,255,168,0.1)",
                  boxShadow: "0 0 0 1px rgba(61,255,168,0.2)",
                }}
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="signal-dot" />
                Streaming
              </motion.span>
            )}
            {isEditingDraft && (
              <span
                className="rounded-lg px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-brass"
                style={{
                  background: "rgba(232,184,109,0.1)",
                  boxShadow: "0 0 0 1px rgba(232,184,109,0.2)",
                }}
              >
                Edit mode
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5">
        {!text && !isStreaming ? (
          <motion.div
            className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-2xl sm:min-h-[200px]"
            style={{
              background: "rgba(5,6,7,0.35)",
              boxShadow: "inset 0 0 0 1px rgba(139,156,179,0.1)",
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(139,156,179,0.03) 8px, rgba(139,156,179,0.03) 9px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ boxShadow: "0 0 0 1px rgba(139,156,179,0.15)" }}
            >
              <FileText className="h-4 w-4 text-mist-dim" />
            </div>
            <p className="font-display text-sm font-medium text-mist-bright">
              Awaiting draft output
            </p>
            <p className="mt-1 text-xs text-mist">
              Execute an intent to generate content
            </p>
          </motion.div>
        ) : (
          <motion.div
            className={`draft-editor-shell relative overflow-hidden rounded-2xl border transition-all duration-300 ${
              isEditingDraft
                ? "border-brass/40"
                : "border-white/[0.06]"
            }`}
            style={
              isEditingDraft
                ? { boxShadow: "0 0 24px rgba(232,184,109,0.1)" }
                : {}
            }
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            {isStreaming && <div className="shimmer-overlay" />}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => onDraftChange?.(e.target.value)}
              readOnly={draftReadOnly}
              placeholder="Email draft will appear here…"
              rows={10}
              className={`draft-editor min-h-[220px] rounded-2xl ${
                draftReadOnly ? "cursor-default text-[#c8d4e4]" : ""
              }`}
              spellCheck
            />
          </motion.div>
        )}
      </div>

      {completion?.lead_data && (
        <motion.div
          className="grid grid-cols-1 gap-2.5 border-t border-white/[0.06] p-3 sm:grid-cols-3 sm:gap-3 sm:p-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_TRANSITION}
        >
          {[
            { label: "Company", value: completion.lead_data.company || "—" },
            {
              label: "Budget",
              value: completion.lead_data.budget
                ? `$${completion.lead_data.budget.toLocaleString()}`
                : "—",
            },
            {
              label: "Status",
              value: completion.requires_approval
                ? "Pending"
                : completion.lead_data.qualified
                  ? "Qualified"
                  : "Pending",
            },
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              className="surface-sm px-3 py-2.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING_TRANSITION, delay: i * 0.05 }}
            >
              <p className="meta">{label}</p>
              <p className="title mt-1 text-sm">{value}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {requiresApproval && onApprove && (
        <ApprovalActionDeck
          isSubmitting={isApproving}
          draftText={text}
          onApprove={onApprove}
          onEnterEditMode={() => {
            setIsEditingDraft(true);
            requestAnimationFrame(() => textareaRef.current?.focus());
          }}
        />
      )}
    </motion.section>
  );
}
