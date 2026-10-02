"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, RotateCw, User as UserIcon } from "lucide-react";
import { ConnectionStrip } from "@/components/states/ConnectionStrip";
import { UserMenu } from "@/components/navigation/UserMenu";
import { useSession, useSessionStatus } from "@/lib/client-auth";
import { cn } from "@/lib/utils";

function Wordmark() {
  return (
    <Link href="/" aria-label="LurkStack — go to the feed" className="inline-flex items-center gap-2.5">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-oxide" fill="none">
        <rect x="1" y="1" width="22" height="22" rx="3" fill="currentColor" />
        <path d="M5.5 8.5h13M5.5 12h9M5.5 15.5h6" stroke="#FAF8F3" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="17.5" cy="15.5" r="2" fill="#FAF8F3" />
      </svg>
      <span className="hidden font-display text-[22px] leading-none tracking-[-0.01em] text-ink sm:inline">
        LurkStack
      </span>
    </Link>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-card px-1.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors sm:px-2 sm:text-[11px] sm:tracking-[0.14em]",
        active ? "text-press" : "text-muted hover:text-ink",
      )}
    >
      <Icon className="hidden h-3.5 w-3.5 sm:block" strokeWidth={2.25} />
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "ml-0.5 hidden h-1.5 w-1.5 rounded-full transition-colors sm:block",
          active ? "bg-oxide" : "bg-transparent",
        )}
      />
    </Link>
  );
}

export function AppHeader() {
  const path = usePathname();
  const session = useSession();
  const { failed, retry } = useSessionStatus();
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
  const profileHref = session ? `/u/${session.user.id}` : "/login";

  return (
    <header className="sticky top-0 z-40">
      <ConnectionStrip />
      {failed ? (
        <div className="border-b border-amber/40 bg-amber-soft px-4 py-2 sm:px-6">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-[13px] leading-snug text-amber">
              <span className="font-semibold">We couldn&apos;t confirm your session. </span>
              You may be signed in — this view just can&apos;t tell yet.
            </p>
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-1.5 rounded-card border border-amber/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber hover:bg-amber/10"
            >
              <RotateCw className="h-3 w-3" strokeWidth={2.5} />
              Retry
            </button>
          </div>
        </div>
      ) : null}
      <div className="bg-press text-paper">
        <div className="mx-auto flex h-8 max-w-[1180px] items-center justify-between gap-3 px-4 sm:px-6">
          <span className="label-xs truncate text-paper/75">LurkStack · the shared feed</span>
          <span className="label-xs hidden text-paper/60 sm:block tabular">{today}</span>
        </div>
      </div>
      <div className="border-b border-rule bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-1.5 px-4 sm:gap-4 sm:px-6">
          <Wordmark />
          <span aria-hidden="true" className="hidden h-6 w-px bg-rule sm:block" />
          <nav aria-label="Primary" className="flex items-center gap-0.5 sm:gap-1">
            <NavLink href="/" label="Feed" icon={Home} active={path === "/"} />
            {/* Signed out this would only point at /login, duplicating the
                button beside it — and on a 320px screen the two collide. */}
            {session ? (
              <NavLink
                href={profileHref}
                label="Profile"
                icon={UserIcon}
                active={path.startsWith("/u/")}
              />
            ) : null}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            {session ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-card px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted hover:bg-paper-2 hover:text-ink sm:px-3 sm:text-[11px] sm:tracking-[0.14em]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-card bg-press px-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-paper hover:bg-press-2 sm:px-3 sm:text-[11px] sm:tracking-[0.14em]"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
