import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";
import { AppHeader } from "@/components/navigation/AppHeader";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <AppHeader />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[640px] px-3 pb-20 pt-6 focus:outline-none sm:px-6 sm:pt-10"
      >
        <section className="overflow-hidden rounded-card border border-rule bg-card">
          <div className="border-b border-rule bg-oxide-soft px-5 py-8 sm:px-8 sm:py-10">
            <p className="label-xs text-oxide">Error 404 · no route</p>
            <h1 className="mt-3 break-words font-display text-[40px] leading-[0.95] text-ink sm:text-[58px]">
              Nothing filed
              <br />
              under this address
            </h1>
          </div>
          <div className="px-5 py-6 sm:px-8 sm:py-7">
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-muted">
              The page you asked for isn&apos;t part of LurkStack. It may have been renamed, or the
              link may be broken. The feed is still running.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/">
                  <Home className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Back to the feed
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
