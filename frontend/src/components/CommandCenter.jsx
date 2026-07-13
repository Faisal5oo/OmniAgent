"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import AppShell from "./AppShell";
import ControlTerminal from "./ControlTerminal";
import NodeExecutionMap from "./NodeExecutionMap";
import StreamingOutput from "./StreamingOutput";
import SessionHUD from "./SessionHUD";
import { useAgentStream } from "@/hooks/useAgentStream";
import { SPRING_TRANSITION } from "@/lib/constants";

export default function CommandCenter() {
  const {
    nodeStates,
    emailDraft,
    setEmailDraft,
    isProcessing,
    isApproving,
    error,
    completion,
    showApproval,
    threadId,
    executeQuery,
    resolveApproval,
  } = useAgentStream();

  return (
    <AppShell isStreaming={isProcessing}>
      <SessionHUD
        nodeStates={nodeStates}
        isStreaming={isProcessing}
        completion={completion}
      />

      <div className="grid flex-1 grid-cols-1 items-start gap-3 sm:gap-4 xl:grid-cols-[minmax(300px,380px)_minmax(0,1fr)] xl:items-stretch">
        <ControlTerminal
          onSubmit={executeQuery}
          isStreaming={isProcessing}
          threadId={threadId}
        />

        <div className="flex min-h-0 min-w-0 flex-col gap-3 sm:gap-4">
          <NodeExecutionMap
            nodeStates={nodeStates}
            isStreaming={isProcessing}
          />

          {error && (
            <motion.div
              className="surface-sm flex items-start gap-3 px-3.5 py-3 sm:px-4"
              style={{
                boxShadow: "0 0 0 1px rgba(248,113,113,0.2)",
                background: "rgba(127,29,29,0.15)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING_TRANSITION}
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          <StreamingOutput
            text={emailDraft}
            onDraftChange={setEmailDraft}
            isStreaming={isProcessing}
            completion={completion}
            requiresApproval={showApproval && completion?.requires_approval}
            isApproving={isApproving}
            onApprove={(draft) => resolveApproval(true, draft)}
          />
        </div>
      </div>
    </AppShell>
  );
}
