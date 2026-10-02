import type { AuditEvent } from "../db/schema";

/**
 * Telegram notifier. Fire-and-forget; failures are swallowed by the caller.
 * Only safe operational fields are transmitted — never secrets, tokens,
 * IPs, request bodies, or raw personal data.
 */
export async function sendTelegram(event: AuditEvent): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const lines = [
    `*LurkStack ${event.severity.toUpperCase()}*`,
    `Action: ${event.action}`,
    `Result: ${event.result}`,
    event.reasonCode ? `Reason: ${event.reasonCode}` : null,
    event.actorName ? `Actor: ${event.actorName}` : null,
    event.targetName ? `Target: ${event.targetName}` : null,
    event.summary ? `Summary: ${event.summary}` : null,
    event.repeatCount > 1 ? `Repeated events: ${event.repeatCount}` : null,
    `Event: ${event.id}`,
    `Time: ${new Date(event.createdAt).toISOString()}`,
  ].filter(Boolean);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          parse_mode: "Markdown",
        }),
        signal: controller.signal,
      },
    );
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
