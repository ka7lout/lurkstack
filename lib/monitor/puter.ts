import type { AuditEvent } from "../db/schema";

/**
 * Puter / Claude analysis layer. Analysis ONLY — it summarizes and suggests
 * severity but never establishes facts or invents incidents. Entirely optional;
 * if unavailable the raw audit event is retained for later retry.
 */
export async function summarize(
  events: AuditEvent[],
): Promise<string | null> {
  const token = process.env.PUTER_AUTH_TOKEN;
  if (!token || events.length === 0) return null;

  const facts = events.map((e) => ({
    action: e.action,
    result: e.result,
    severity: e.severity,
    reasonCode: e.reasonCode,
    repeatCount: e.repeatCount,
  }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch("https://api.puter.com/drivers/call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        interface: "puter-chat-completion",
        driver: "claude",
        method: "complete",
        args: {
          messages: [
            {
              role: "user",
              content:
                "You are an observability assistant. Summarize these application audit events in one concise sentence. " +
                "Only use the facts provided; do not invent incidents or claim attacks without evidence. " +
                "Facts: " +
                JSON.stringify(facts),
            },
          ],
        },
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as unknown;
    // Best-effort extraction; shape varies by driver.
    const text =
      (data as { result?: { message?: { content?: string } } })?.result
        ?.message?.content ?? null;
    return typeof text === "string" ? text : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
