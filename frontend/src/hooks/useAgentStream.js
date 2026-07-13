"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { consumeAgentStream, submitApproval } from "@/lib/api";
import { NODE_STATUS, PIPELINE_NODES } from "@/lib/constants";

function buildInitialNodeStates() {
  return PIPELINE_NODES.reduce((acc, node) => {
    acc[node.id] = NODE_STATUS.IDLE;
    return acc;
  }, {});
}

export function useAgentStream() {
  const [nodeStates, setNodeStates] = useState(buildInitialNodeStates);
  const [emailDraft, setEmailDraft] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [showApproval, setShowApproval] = useState(false);
  const [threadId, setThreadId] = useState("default_omni_session");
  const [activeNodes, setActiveNodes] = useState([]);

  const abortRef = useRef(null);
  const streamGenRef = useRef(0);
  const tokenBufferRef = useRef("");
  const rafFlushRef = useRef(null);
  const threadIdRef = useRef(threadId);
  const emailDraftRef = useRef("");

  threadIdRef.current = threadId;
  emailDraftRef.current = emailDraft;

  const cancelTokenFlush = useCallback(() => {
    if (rafFlushRef.current !== null) {
      cancelAnimationFrame(rafFlushRef.current);
      rafFlushRef.current = null;
    }
  }, []);

  const flushTokenBuffer = useCallback(() => {
    rafFlushRef.current = null;
    const pending = tokenBufferRef.current;
    if (!pending) return;
    tokenBufferRef.current = "";
    setEmailDraft((prev) => {
      const next = prev + pending;
      emailDraftRef.current = next;
      return next;
    });
  }, []);

  const scheduleTokenFlush = useCallback(() => {
    if (rafFlushRef.current !== null) return;
    rafFlushRef.current = requestAnimationFrame(flushTokenBuffer);
  }, [flushTokenBuffer]);

  const appendToken = useCallback(
    (text) => {
      if (!text) return;
      tokenBufferRef.current += text;
      scheduleTokenFlush();
    },
    [scheduleTokenFlush]
  );

  const updateEmailDraft = useCallback((value) => {
    emailDraftRef.current = value;
    setEmailDraft(value);
  }, []);

  const abortActiveStream = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    cancelTokenFlush();
    tokenBufferRef.current = "";
    streamGenRef.current += 1;
  }, [cancelTokenFlush]);

  const resetSession = useCallback(() => {
    setNodeStates(buildInitialNodeStates());
    setEmailDraft("");
    emailDraftRef.current = "";
    setError(null);
    setCompletion(null);
    setShowApproval(false);
    setActiveNodes([]);
    tokenBufferRef.current = "";
    cancelTokenFlush();
  }, [cancelTokenFlush]);

  const handleStreamEvent = useCallback(
    (generation, eventName, data) => {
      if (generation !== streamGenRef.current) return;

      switch (eventName) {
        case "node_start": {
          const nodeId = data?.node;
          if (!nodeId) break;
          setActiveNodes((prev) =>
            prev.includes(nodeId) ? prev : [...prev, nodeId]
          );
          setNodeStates((prev) =>
            prev[nodeId] === NODE_STATUS.ACTIVE
              ? prev
              : { ...prev, [nodeId]: NODE_STATUS.ACTIVE }
          );
          break;
        }

        case "node_end": {
          const nodeId = data?.node;
          if (!nodeId) break;
          setActiveNodes((prev) => prev.filter((id) => id !== nodeId));
          setNodeStates((prev) =>
            prev[nodeId] === NODE_STATUS.COMPLETE
              ? prev
              : { ...prev, [nodeId]: NODE_STATUS.COMPLETE }
          );
          break;
        }

        case "token":
          appendToken(data?.text || "");
          break;

        case "complete": {
          cancelTokenFlush();
          if (tokenBufferRef.current) {
            const tail = tokenBufferRef.current;
            tokenBufferRef.current = "";
            setEmailDraft((prev) => {
              const next = prev + tail;
              emailDraftRef.current = data?.email_draft || next;
              return data?.email_draft || next;
            });
          } else if (data?.email_draft) {
            emailDraftRef.current = data.email_draft;
            setEmailDraft(data.email_draft);
          }

          setCompletion(data);
          if (data?.requires_approval) {
            setShowApproval(true);
          }
          break;
        }

        case "error":
          setError(data?.detail || "Pipeline execution failure.");
          break;

        default:
          break;
      }
    },
    [appendToken, cancelTokenFlush]
  );

  const executeQuery = useCallback(
    async (prompt, sessionId) => {
      const trimmed = prompt?.trim();
      if (!trimmed) return;

      abortActiveStream();

      const controller = new AbortController();
      abortRef.current = controller;

      const generation = streamGenRef.current;
      const activeThread = sessionId || threadIdRef.current;

      setThreadId(activeThread);
      resetSession();
      setIsProcessing(true);

      try {
        await consumeAgentStream({
          prompt: trimmed,
          threadId: activeThread,
          signal: controller.signal,
          onEvent: (eventName, data) =>
            handleStreamEvent(generation, eventName, data),
        });
      } catch (err) {
        if (generation !== streamGenRef.current) return;
        if (err.name !== "AbortError") {
          setError(err.message || "Stream interrupted.");
        }
      } finally {
        if (generation === streamGenRef.current) {
          setIsProcessing(false);
          abortRef.current = null;
        }
      }
    },
    [abortActiveStream, handleStreamEvent, resetSession]
  );

  const dismissApproval = useCallback(() => {
    setShowApproval(false);
  }, []);

  const resolveApproval = useCallback(async (approve, draftOverride) => {
    setIsApproving(true);
    setError(null);

    try {
      const finalDraft = approve
        ? (draftOverride ?? emailDraftRef.current)
        : null;

      await submitApproval(threadIdRef.current, approve, finalDraft);

      setShowApproval(false);

      if (approve) {
        if (finalDraft) {
          updateEmailDraft(finalDraft);
        }
        setNodeStates((prev) => ({
          ...prev,
          sender: NODE_STATUS.COMPLETE,
        }));
      }

      return true;
    } catch (err) {
      setError(err.message || "Approval request failed.");
      throw err;
    } finally {
      setIsApproving(false);
    }
  }, [updateEmailDraft]);

  useEffect(() => {
    return () => {
      abortActiveStream();
    };
  }, [abortActiveStream]);

  return {
    nodeStates,
    activeNodes,
    emailDraft,
    streamedText: emailDraft,
    setEmailDraft: updateEmailDraft,
    isProcessing,
    isStreaming: isProcessing,
    isApproving,
    error,
    completion,
    showApproval,
    threadId,
    executeQuery,
    dismissApproval,
    resolveApproval,
    resetSession,
  };
}
