/**
 * Parses a single SSE message frame (lines between `\n\n` boundaries).
 * Supports multi-line `data:` fields per the SSE spec.
 */
export function parseSSEFrame(raw) {
  if (!raw || !raw.trim()) return null;

  const lines = raw.split("\n");
  let eventName = "message";
  const dataLines = [];

  for (const line of lines) {
    if (line.startsWith(":")) continue; // comment / heartbeat
    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  if (dataLines.length === 0) return null;

  const dataPayload = dataLines.join("\n");

  try {
    return { event: eventName, data: JSON.parse(dataPayload) };
  } catch {
    return { event: eventName, data: { raw: dataPayload } };
  }
}

/**
 * Incrementally feeds decoded stream text into frames split on `\n\n`.
 * Returns parsed frames and retains any incomplete trailing buffer.
 */
export function feedSSEBuffer(buffer, chunk) {
  const normalized = (buffer + chunk).replace(/\r\n/g, "\n");
  const parts = normalized.split("\n\n");
  const remainder = parts.pop() || "";
  const frames = [];

  for (const part of parts) {
    const parsed = parseSSEFrame(part);
    if (parsed) frames.push(parsed);
  }

  return { frames, remainder };
}
