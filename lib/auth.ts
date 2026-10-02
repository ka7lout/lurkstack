import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";
import * as schema from "./db/schema";

/** Positive number from env, or the fallback when unset/invalid. */
function positiveEnvInt(raw: string | undefined, fallback: number): number {
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

// Credential-endpoint throttle: N attempts per window (seconds), per IP.
const rateLimitWindow = positiveEnvInt(process.env.AUTH_RATE_LIMIT_WINDOW, 300);
const rateLimitMax = positiveEnvInt(process.env.AUTH_RATE_LIMIT_MAX, 60);

const isLocalhost = (value: string): boolean => /localhost|127\.0\.0\.1/.test(value);

/**
 * The origin Better Auth trusts for cookies and callbacks.
 *
 * A localhost value that has been copied into a real deployment is worse than
 * no value at all: it makes every session cookie and redirect point at the
 * developer's machine, so signing in appears to succeed and then does nothing.
 * In production such a value is ignored in favour of the platform's own URL,
 * which Netlify publishes as URL / DEPLOY_PRIME_URL.
 */
function resolveBaseURL(): string | undefined {
  const explicit = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (explicit && !(process.env.NODE_ENV === "production" && isLocalhost(explicit))) {
    return explicit;
  }
  return process.env.URL ?? process.env.DEPLOY_PRIME_URL ?? undefined;
}

const baseURL = resolveBaseURL();

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  // Netlify serves the same build from the production domain and from
  // per-deploy preview hosts, so both have to be trusted or every mutation
  // from a preview URL is rejected as cross-origin.
  trustedOrigins: [
    ...(baseURL ? [baseURL] : []),
    "http://localhost:3000",
    "https://*.netlify.app",
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
  // Real, per-IP rate limiting. Two tiers on purpose:
  //
  //  - Credential endpoints (/sign-in/email, /sign-up/email) get the tight
  //    throttle: it blunts credential stuffing and signup floods, while still
  //    leaving room for a reviewer creating a few accounts from one network.
  //  - Everything else, in particular the read-only /get-session endpoint the
  //    UI calls on every page load, gets a much higher ceiling. Throttling
  //    session reads would make signed-in users silently fall back to the
  //    guest view, which is a correctness bug, not a security win.
  //
  // Override the credential tier with AUTH_RATE_LIMIT_WINDOW / AUTH_RATE_LIMIT_MAX.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 600,
    customRules: {
      "/sign-in/email": { window: rateLimitWindow, max: rateLimitMax },
      "/sign-up/email": { window: rateLimitWindow, max: rateLimitMax },
      "/get-session": { window: 60, max: 600 },
    },
  },
  advanced: {
    cookiePrefix: "lurkstack",
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
