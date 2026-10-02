import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}

/** Designed empty state — a ruled plate, not a bare sentence. */
export function EmptyState({ icon: Icon, title, body, action, className }: EmptyStateProps) {
  return (
    <section
      className={cn(
        "rounded-card border border-dashed border-rule-2 bg-card px-5 py-9 text-center sm:px-8 sm:py-11",
        className,
      )}
    >
      {Icon ? (
        <span
          aria-hidden="true"
          className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-[4px] bg-press-soft text-press"
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </span>
      ) : null}
      <h2 className="font-display text-[21px] leading-tight text-ink sm:text-[24px]">{title}</h2>
      <p className="mx-auto mt-2 max-w-[46ch] text-[14px] leading-relaxed text-muted">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </section>
  );
}
