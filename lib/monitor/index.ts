import { randomUUID } from "crypto";
import { and, eq, gte, desc } from "drizzle-orm";
import { db } from "../db";
import { auditEvent, type AuditEvent } from "../db/schema";
import { monitorConfig, type AuditInput } from "./config";
import { classify, fingerprint } from "./rules";
import { sendTelegram } from "./telegram";
import { summarize } from "./puter";

/**
 * Record an audit event. Completely non-blocking and failure-isolated:
 * callers should invoke as `void record(...)`. Nothing here may throw into
 * the request path, and the core app never waits on Telegram/Puter.
 */
export async function record(input: AuditInput): Promise<void> {
  try {
    const severity = classify(input);
    const fp = fingerprint(input);
    const now = new Date();
    const windowStart = new Date(now.getTime() - monitorConfig.dedupWindowMs);

    // Dedup: collapse identical fingerprints inside the window.
    const [recent] = await db
      .select()
      .from(auditEvent)
      .where(
        and(eq(auditEvent.fingerprint, fp), gte(auditEvent.createdAt, windowStart)),
      )
      .orderBy(desc(auditEvent.createdAt))
      .limit(1);

    let event: AuditEvent;
    if (recent) {
      [event] = await db
        .update(auditEvent)
        .set({ repeatCount: recent.repeatCount + 1 })
        .where(eq(auditEvent.id, recent.id))
        .returning();
    } else {
      [event] = await db
        .insert(auditEvent)
        .values({
          id: randomUUID(),
          requestId: input.requestId ?? randomUUID(),
          action: input.action,
          result: input.result,
          severity,
          reasonCode: input.reasonCode,
          actorId: input.actorId ?? null,
          actorName: input.actorName ?? null,
          targetUserId: input.targetUserId ?? null,
          targetName: input.targetName ?? null,
          summary: input.summary,
          meta: input.meta ?? null,
          fingerprint: fp,
          repeatCount: 1,
          alertState: "pending",
        })
        .returning();
    }

    // Structured server log (safe fields only).
    console.info(
      JSON.stringify({
        eventId: event.id,
        requestId: event.requestId,
        action: event.action,
        result: event.result,
        severity: event.severity,
        reasonCode: event.reasonCode,
      }),
    );

    // Alert only for meaningful severities, and only once per fingerprint window.
    if (
      monitorConfig.alertSeverities.has(severity) &&
      (!recent || recent.alertState !== "sent")
    ) {
      void deliverAlert(event);
    }
  } catch (err) {
    // Monitoring must never break the application.
    console.error("audit.record failed:", (err as Error).message);
  }
}

async function deliverAlert(event: AuditEvent): Promise<void> {
  try {
    let enriched = event;
    if (monitorConfig.puterEnabled) {
      const summary = await summarize([event]);
      if (summary) enriched = { ...event, summary };
    }
    const ok = monitorConfig.telegramEnabled
      ? await sendTelegram(enriched)
      : false;
    await db
      .update(auditEvent)
      .set({ alertState: ok ? "sent" : monitorConfig.telegramEnabled ? "failed" : "skipped" })
      .where(eq(auditEvent.id, event.id));
  } catch (err) {
    console.error("audit.deliverAlert failed:", (err as Error).message);
  }
}
