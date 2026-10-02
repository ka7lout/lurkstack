import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errorCopy, type ApiErrorCode } from "@/lib/errors";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  code?: ApiErrorCode;
  title?: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  loading?: boolean;
  compact?: boolean;
  className?: string;
}

/** The designed failure block. Renders from an ApiErrorCode, never a raw message. */
export function ErrorState({
  code = "server",
  title,
  body,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  loading = false,
  compact = false,
  className,
}: ErrorStateProps) {
  const copy = errorCopy(code);
  const heading = title ?? copy.title;
  const message = body ?? copy.body;
  const button = actionLabel ?? copy.action;

  return (
    <section
      role="alert"
      className={cn(
        "rounded-card border border-oxide/35 bg-oxide-soft",
        compact ? "px-4 py-4" : "px-5 py-7 sm:px-7 sm:py-9",
        className,
      )}
    >
      <div className={cn("flex gap-4", compact ? "" : "sm:gap-5")}>
        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex shrink-0 items-center justify-center rounded-[4px] border border-oxide/30 bg-white",
            compact ? "h-8 w-8" : "h-10 w-10",
          )}
        >
          <AlertTriangle className={compact ? "h-4 w-4 text-oxide" : "h-5 w-5 text-oxide"} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            className={cn(
              "font-display text-ink",
              compact ? "text-[17px] leading-snug" : "text-[24px] leading-tight sm:text-[28px]",
            )}
          >
            {heading}
          </h2>
          <p className={cn("mt-1.5 max-w-[54ch] text-muted", compact ? "text-[13px]" : "text-[15px]")}>
            {message}
          </p>
          {onAction ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={onAction} aria-busy={loading || undefined} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
                    Retrying…
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.5} />
                    {button}
                  </>
                )}
              </Button>
              {onSecondary && secondaryLabel ? (
                <Button variant="outline" onClick={onSecondary}>
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
                  {secondaryLabel}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
