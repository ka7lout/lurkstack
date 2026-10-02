import "server-only";
import { headers } from "next/headers";
import { auth } from "./auth";

/** Resolve the authenticated user from the server-side session, or null. */
export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Authentication required");
  }
  return user;
}

export class AuthError extends Error {
  code = "UNAUTHENTICATED" as const;
}
