export type ApiErrorCode =
  | "offline"
  | "timeout"
  | "server"
  | "not_found"
  | "invalid_credentials"
  | "conflict"
  | "validation"
  | "rate_limited"
  | "unauthorized"
  | "session_expired";

export interface ErrorCopy {
  title: string;
  body: string;
  action: string;
}

/** Map a server-action result code (or offline state) to a UI error code. */
export function fromActionCode(
  code: "UNAUTHENTICATED" | "VALIDATION" | "NOT_FOUND" | "SERVER",
): ApiErrorCode {
  if (typeof navigator !== "undefined" && !navigator.onLine) return "offline";
  switch (code) {
    case "UNAUTHENTICATED":
      return "session_expired";
    case "VALIDATION":
      return "validation";
    case "NOT_FOUND":
      return "not_found";
    case "SERVER":
    default:
      return "server";
  }
}

/** Human copy for every failure state. Never exposes technical detail. */
export function errorCopy(code: ApiErrorCode): ErrorCopy {
  switch (code) {
    case "offline":
      return {
        title: "You're offline",
        body: "Some features may not work. We'll sync again as soon as you're back.",
        action: "Try again",
      };
    case "timeout":
      return {
        title: "This is taking longer than usual",
        body: "The connection timed out before we heard back.",
        action: "Retry",
      };
    case "not_found":
      return {
        title: "Not found",
        body: "That page doesn't exist, or it was moved.",
        action: "Back to feed",
      };
    case "invalid_credentials":
      return {
        title: "We couldn't sign you in",
        body: "That email and password don't match an account.",
        action: "Try again",
      };
    case "conflict":
      return {
        title: "That email is already registered",
        body: "Sign in instead, or use a different address.",
        action: "Go to sign in",
      };
    case "session_expired":
      return {
        title: "Your session ended",
        body: "Sign in again to keep posting. Nothing you typed was lost.",
        action: "Sign in",
      };
    case "unauthorized":
      return {
        title: "Please sign in first",
        body: "You need to be signed in to do that.",
        action: "Sign in",
      };
    case "rate_limited":
      return {
        title: "Too many attempts",
        body: "We've paused sign-in attempts from this network for a moment. Wait a minute and try again.",
        action: "Try again",
      };
    case "validation":
      return {
        title: "Check the highlighted fields",
        body: "A couple of details need fixing before you continue.",
        action: "Fix and continue",
      };
    case "server":
    default:
      return {
        title: "Something went wrong",
        body: "We couldn't complete that. It's usually temporary — try again.",
        action: "Try again",
      };
  }
}
