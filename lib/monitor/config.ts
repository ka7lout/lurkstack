/**
 * Monitoring configuration & shared types.
 * The core app NEVER depends on Telegram/Puter being configured.
 */

export type Severity = "info" | "notice" | "warning" | "critical";
export type Result = "allowed" | "blocked" | "failure";

export interface AuditInput {
  action: string;
  result: Result;
  severity?: Severity;
  reasonCode?: string;
  requestId?: string;
  actorId?: string | null;
  actorName?: string | null;
  targetUserId?: string | null;
  targetName?: string | null;
  summary?: string;
  meta?: Record<string, unknown>;
}

export const monitorConfig = {
  telegramEnabled: Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
  ),
  puterEnabled: Boolean(process.env.PUTER_AUTH_TOKEN),
  // Alerts are sent for these severities only.
  alertSeverities: new Set<Severity>(["warning", "critical"]),
  // Dedup window: identical fingerprints within this window collapse into one alert.
  dedupWindowMs: 5 * 60 * 1000,
};
