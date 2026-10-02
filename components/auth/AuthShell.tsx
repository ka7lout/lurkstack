"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Home } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ConnectionStrip } from "@/components/states/ConnectionStrip";
import { useSession } from "@/lib/client-auth";

export function AuthShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <ConnectionStrip />
      <div className="grid flex-1 lg:grid-cols-[1.05fr_1fr]">
        <aside className="relative h-44 overflow-hidden bg-press sm:h-56 lg:h-auto">
          <Image
            src="/auth-desk.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-press/95 via-press/45 to-press/15"
          />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-10">
            <p className="label-xs text-paper/70">LurkStack · the shared feed</p>
            <p className="mt-2 max-w-[22ch] font-display text-[24px] leading-[1.15] text-paper sm:text-[30px] lg:text-[38px]">
              Everything everyone has to say.
            </p>
          </div>
        </aside>

        <main
          id="main"
          tabIndex={-1}
          className="flex items-center justify-center px-4 py-9 focus:outline-none sm:px-8 sm:py-12"
        >
          <div className="w-full max-w-[430px]">
            <Link href="/" className="mb-7 flex items-center gap-2.5" aria-label="LurkStack — go to the feed">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-oxide" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="22" height="22" rx="3" fill="currentColor" />
                <path
                  d="M5.5 8.5h13M5.5 12h9M5.5 15.5h6"
                  stroke="#FAF8F3"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="17.5" cy="15.5" r="2" fill="#FAF8F3" />
              </svg>
              <span className="font-display text-[21px] leading-none text-ink">LurkStack</span>
            </Link>

            <p className="label-xs text-oxide">{eyebrow}</p>
            <h1 className="mt-3 break-words font-display text-[32px] leading-[1.05] text-ink sm:text-[38px]">
              {title}
            </h1>
            <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{lede}</p>

            <div className="mt-7">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

/** Shown when an already signed-in visitor opens /login or /signup. */
export function SignedInNotice() {
  const session = useSession();
  if (!session) return null;

  return (
    <div className="rounded-card border border-press/30 bg-press-soft px-5 py-6">
      <p className="flex items-center gap-2 text-[15px] font-semibold text-press">
        <Check className="h-4 w-4" strokeWidth={2.5} />
        You&apos;re signed in as {session.user.name}
      </p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-press/80">
        Head back to the feed to read and post, or sign out from the account menu first.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">
          <Home className="h-3.5 w-3.5" strokeWidth={2.5} />
          Go to the feed
        </Link>
      </Button>
    </div>
  );
}
