"use client";

import { Check, Clock, RefreshCw, WifiOff } from "lucide-react";
import { useConnection } from "@/lib/network";
import { cn } from "@/lib/utils";

const COPY: Record<string, { label: string; className: string }> = {
  offline: { label: "You're offline. Some features may not work.", className: "bg-ink text-paper" },
  reconnecting: { label: "Reconnecting…", className: "bg-press text-paper" },
  restored: { label: "Connection restored", className: "bg-press-soft text-press" },
  slow: { label: "Slow connection — this may take longer than usual.", className: "bg-amber-soft text-amber" },
  online: { label: "", className: "bg-transparent" },
};

/** Global connection status strip. Sits above the masthead; never blocks the page. */
export function ConnectionStrip() {
  const { phase } = useConnection();
  if (phase === "online") return null;
  const copy = COPY[phase] ?? COPY.online;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("w-full px-4 py-2 transition-colors duration-200", copy.className)}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-center gap-2 text-center">
        {phase === "offline" ? (
          <WifiOff className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
        ) : phase === "reconnecting" ? (
          <RefreshCw className="h-3.5 w-3.5 shrink-0 animate-spin" strokeWidth={2.25} />
        ) : phase === "restored" ? (
          <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
        ) : (
          <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
        )}
        <span className="label-xs">{copy.label}</span>
      </div>
    </div>
  );
}
