"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectionStrip } from "@/components/states/ConnectionStrip";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <ConnectionStrip />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[640px] px-3 pb-16 pt-6 focus:outline-none sm:px-6 sm:pt-10"
      >
        <figure className="relative h-44 overflow-hidden rounded-card border border-rule bg-press sm:h-64">
          <Image
            src="/error-wire.jpg"
            alt="Two frayed ends of a copper cable lying apart on cream paper"
            fill
            sizes="(min-width: 640px) 640px, 100vw"
            className="object-cover object-center"
          />
        </figure>

        <section className="mt-4 overflow-hidden rounded-card border border-oxide/35 bg-oxide-soft px-5 py-7 sm:px-8 sm:py-9">
          <p className="label-xs text-oxide">Something went wrong</p>
          <h1 className="mt-3 break-words font-display text-[30px] leading-tight text-ink sm:text-[38px]">
            The page didn&apos;t finish loading
          </h1>
          <p className="mt-2.5 max-w-[54ch] text-[15px] leading-relaxed text-muted">
            We couldn&apos;t complete that request. It&apos;s usually temporary — try again.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
              Try again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="h-3.5 w-3.5" strokeWidth={2.5} />
                Back to the feed
              </Link>
            </Button>
          </div>
        </section>

        <p className="label-xs mt-4 text-center text-faint">
          Your drafts and reactions are kept — nothing was lost.
        </p>
      </main>
    </div>
  );
}
