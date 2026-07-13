import { API_BASE } from "./constants";
import { feedSSEBuffer, parseSSEFrame } from "./sseParser";

/**
 * POST /api/agent/approve — resumes a paused LangGraph thread.
 * When approving, optionally sends the human-edited email_draft body.
 */
export async function submitApproval(threadId, approve, emailDraft = null) {
  let response;

  const payload = {
    thread_id: threadId,
    approve,
  };

  if (approve && emailDraft != null && emailDraft.trim()) {
    payload.email_draft = emailDraft.trim();
  }

  try {
    response = await fetch(`${API_BASE}/api/agent/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw new Error(
      err.message || "Unable to reach approval endpoint. Is the API server running?"
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const detail =
      typeof error.detail === "string"
        ? error.detail
        : Array.isArray(error.detail)
          ? error.detail.map((d) => d.msg || d).join(", ")
          : "Approval request failed.";
    throw new Error(detail);
  }

  return response.json();
}

/**
 * Consumes POST SSE from FastAPI via fetch + ReadableStream.
 * Native EventSource only supports GET — not compatible with our POST body.
 */
export async function consumeAgentStream({
  prompt,
  threadId,
  signal,
  onEvent,
}) {
  let response;

  try {
    response = await fetch(`${API_BASE}/api/agent/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      body: JSON.stringify({ prompt, thread_id: threadId }),
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new Error(
      err.message || "Unable to reach stream endpoint. Is the API server running?"
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const detail =
      typeof error.detail === "string"
        ? error.detail
        : `Stream connection failed (${response.status}).`;
    throw new Error(detail);
  }

  if (!response.body) {
    throw new Error("Stream response has no body.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // Flush any trailing partial frame
        if (buffer.trim()) {
          const parsed = parseSSEFrame(buffer);
          if (parsed) onEvent(parsed.event, parsed.data);
        }
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const { frames, remainder } = feedSSEBuffer(buffer, chunk);
      buffer = remainder;

      for (const frame of frames) {
        onEvent(frame.event, frame.data);
      }
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw err;
  } finally {
    try {
      await reader.cancel();
    } catch {
      // Reader may already be closed — safe to ignore
    }
  }
}
