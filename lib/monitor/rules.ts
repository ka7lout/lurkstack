import type { AuditInput, Severity } from "./config";

/**
 * Deterministic severity assignment. Facts come from the application,
 * never from AI. This decides how loud an event is.
 */
export function classify(input: AuditInput): Severity {
  if (input.severity) return input.severity;

  switch (input.result) {
    case "failure":
      // Infrastructure / unexpected failures are always notable.
      return input.action.includes("db") || input.action === "server_error"
        ? "critical"
        : "warning";
    case "blocked":
      // A guest attempting a mutation is a real authorization event.
      return "warning";
    case "allowed":
    default:
      return "info";
  }
}

/**
 * Stable fingerprint for deduplication of repeated identical failures.
 * Intentionally excludes volatile fields (ids, timestamps, free text).
 */
export function fingerprint(input: AuditInput): string {
  return [input.action, input.result, input.reasonCode ?? "none"].join(":");
}

/** Cross-user edit/delete is explicitly allowed and must not be flagged. */
export function isSecurityViolation(input: AuditInput): boolean {
  return input.result === "blocked" || input.result === "failure";
}
