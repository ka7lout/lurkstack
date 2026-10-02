"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth's client defaults to a relative `/api/auth`, which is exactly
 * right for an app served from the same origin as its own API. An explicit
 * baseURL only helps when the API lives somewhere else — and hurts when a
 * localhost value set during development gets baked into a production bundle.
 *
 * `NEXT_PUBLIC_*` values are inlined at build time, so a stale one cannot be
 * corrected by changing environment variables later; the running origin is the
 * only trustworthy source at runtime.
 */
function resolveClientBaseURL(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (!configured) return undefined;

  if (typeof window !== "undefined") {
    const configuredIsLocal = /localhost|127\.0\.0\.1/.test(configured);
    const weAreLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname);
    // A localhost API address is meaningless on a real deployment.
    if (configuredIsLocal && !weAreLocal) return undefined;
  }

  return configured;
}

const baseURL = resolveClientBaseURL();

export const authClient = createAuthClient(baseURL ? { baseURL } : {});

export const { signIn, signUp, signOut, useSession } = authClient;
