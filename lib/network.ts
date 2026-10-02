"use client";

import { useEffect, useState } from "react";

export type ConnectionPhase = "online" | "offline" | "reconnecting" | "restored" | "slow";

/**
 * Real connection status derived from the browser's online/offline events.
 * offline → reconnecting → restored → online, so the status strip tells the
 * truth without any demo toggles.
 */
export function useConnection(): { phase: ConnectionPhase; online: boolean } {
  const [online, setOnline] = useState(true);
  const [phase, setPhase] = useState<ConnectionPhase>("online");

  useEffect(() => {
    setOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    if (!online) {
      setPhase("offline");
      return;
    }
    setPhase((prev) => (prev === "offline" ? "reconnecting" : "online"));
  }, [online]);

  useEffect(() => {
    if (phase !== "reconnecting") return undefined;
    const timer = window.setTimeout(() => setPhase("restored"), 1200);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "restored") return undefined;
    const timer = window.setTimeout(() => setPhase("online"), 3000);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return { phase, online };
}

/** True once a pending action has run longer than `ms` — drives "still working" copy. */
export function useDelayedFlag(active: boolean, ms = 2500): boolean {
  const [delayed, setDelayed] = useState(false);
  useEffect(() => {
    if (!active) {
      setDelayed(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setDelayed(true), ms);
    return () => window.clearTimeout(timer);
  }, [active, ms]);
  return delayed;
}
