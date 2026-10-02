"use client";

import { ToastProvider } from "@/components/ui/toast";
import { AuthGateProvider } from "@/lib/client-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthGateProvider>{children}</AuthGateProvider>
    </ToastProvider>
  );
}
