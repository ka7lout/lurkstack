"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession as useBetterSession } from "@/lib/auth-client";
import { handleFor } from "@/lib/format";
import type { SessionUserView } from "@/lib/view-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ClientSession {
  user: SessionUserView;
}

/** Maps the Better Auth session to the presentation session shape. */
export function useSession(): ClientSession | null {
  const { data } = useBetterSession();
  if (!data?.user) return null;
  const u = data.user;
  return {
    user: {
      id: u.id,
      name: u.name,
      email: u.email,
      handle: handleFor(u.name, u.id),
    },
  };
}

/**
 * Like {@link useSession}, but also reports whether the session read is still
 * in flight or actually failed.
 *
 * The distinction matters: a failed session read must never be presented as
 * "signed out". A signed-in user who briefly sees the guest view would think
 * they had been logged out.
 */
export function useSessionStatus(): {
  session: ClientSession | null;
  pending: boolean;
  failed: boolean;
  retry: () => void;
} {
  const { data, isPending, error, refetch } = useBetterSession();
  const session = useSession();
  return {
    session,
    pending: isPending,
    failed: !isPending && !session && Boolean(error),
    retry: () => void refetch(),
  };
}

export function useSessionPending(): boolean {
  const { isPending } = useBetterSession();
  return isPending;
}

/* ------------------------------------------------------------------ */
/* Authentication gate for guest actions                               */
/* ------------------------------------------------------------------ */

interface AuthGateValue {
  open: (reason?: string) => void;
}

const AuthGateContext = React.createContext<AuthGateValue | null>(null);

export function useAuthGate(): AuthGateValue {
  const ctx = React.useContext(AuthGateContext);
  if (!ctx) throw new Error("useAuthGate must be used within AuthGateProvider");
  return ctx;
}

const DEFAULT_REASON =
  "Create an account or sign in to react, reply and post your own updates.";

export function AuthGateProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState(DEFAULT_REASON);
  const pathname = usePathname();
  const next = encodeURIComponent(pathname || "/");

  const value = React.useMemo<AuthGateValue>(
    () => ({
      open: (r?: string) => {
        setReason(r ?? DEFAULT_REASON);
        setOpen(true);
      },
    }),
    [],
  );

  return (
    <AuthGateContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>{reason}</DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col gap-2">
            <Link
              href={`/login?next=${next}`}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-full items-center justify-center rounded-card bg-press px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper hover:bg-press-2"
            >
              Sign in
            </Link>
            <Link
              href={`/signup?next=${next}`}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-full items-center justify-center rounded-card border border-rule-2 bg-card px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink hover:border-ink hover:bg-paper"
            >
              Create account
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </AuthGateContext.Provider>
  );
}
