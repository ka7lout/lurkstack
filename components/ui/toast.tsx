"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (input: { title: string; description?: string; variant?: ToastVariant }) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastSequence = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback<ToastContextValue["toast"]>(
    (input) => {
      toastSequence += 1;
      const id = `t_${toastSequence}`;
      const item: ToastItem = {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant ?? "default",
      };
      setItems((prev) => [...prev.slice(-2), item]);
      const duration = item.variant === "error" ? 7000 : 4500;
      const timer = window.setTimeout(() => dismiss(id), duration);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const active = timers.current;
    return () => {
      active.forEach((timer) => window.clearTimeout(timer));
      active.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}

function Toaster({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-3 top-3 z-[70] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-5 sm:top-5 sm:w-[360px]"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role={item.variant === "error" ? "alert" : "status"}
          className={cn(
            "animate-toast pointer-events-auto flex items-start gap-3 rounded-card border px-3.5 py-3",
            "shadow-[0_18px_44px_-24px_rgba(20,20,20,0.5)]",
            item.variant === "error"
              ? "border-oxide/35 bg-oxide-soft"
              : item.variant === "success"
                ? "border-press/30 bg-press-soft"
                : "border-rule bg-card",
          )}
        >
          <span className="mt-0.5 shrink-0">
            {item.variant === "error" ? (
              <AlertTriangle className="h-4 w-4 text-oxide" strokeWidth={2} />
            ) : item.variant === "success" ? (
              <Check className="h-4 w-4 text-press" strokeWidth={2.5} />
            ) : null}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-[13px] font-semibold",
                item.variant === "error" ? "text-oxide" : "text-ink",
              )}
            >
              {item.title}
            </p>
            {item.description ? (
              <p className="mt-0.5 text-[13px] leading-snug text-muted">{item.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(item.id)}
            aria-label={`Dismiss notification: ${item.title}`}
            className="-mr-1 shrink-0 rounded-[4px] p-1 text-muted transition-colors hover:bg-white/70 hover:text-ink"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
}
