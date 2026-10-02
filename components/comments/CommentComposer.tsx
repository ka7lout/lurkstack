"use client";

import { useState, type FormEvent } from "react";
import { AlertTriangle, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { errorCopy, type ApiErrorCode } from "@/lib/errors";
import { useSession, useAuthGate } from "@/lib/client-auth";
import { COMMENT_MAX_LENGTH, type CommentView } from "@/lib/view-types";
import { cn } from "@/lib/utils";

export interface CommentComposerProps {
  postId: string;
  submitting: boolean;
  error: ApiErrorCode | null;
  onSubmit: (content: string) => Promise<{ ok: boolean; error?: ApiErrorCode }>;
}

export function CommentComposer({ postId, submitting, error, onSubmit }: CommentComposerProps) {
  const session = useSession();
  const gate = useAuthGate();
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const fieldId = `comment-field-${postId}`;
  const hintId = `comment-hint-${postId}`;

  const trimmed = value.trim();
  const tooLong = value.length > COMMENT_MAX_LENGTH;
  const invalid = touched && trimmed.length === 0;
  const disabled = submitting || trimmed.length === 0 || tooLong;

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setTouched(true);
    if (disabled) return;
    const result = await onSubmit(value);
    if (result.ok) {
      setValue("");
      setTouched(false);
    }
  }

  if (!session) {
    return (
      <div className="border-t border-rule bg-paper/70 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => gate.open("Create an account or sign in to reply to this post.")}
          className="w-full rounded-card border border-dashed border-rule-2 bg-card px-4 py-3 text-left text-[13.5px] text-muted transition-colors hover:border-press hover:text-press"
        >
          Sign in to add a comment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} noValidate className="border-t border-rule bg-paper/70 px-4 py-4 sm:px-6">
      <div className="flex gap-3">
        <Avatar id={session.user.id} name={session.user.name} size="sm" className="mt-0.5" />
        <div className="min-w-0 flex-1">
          <label htmlFor={fieldId} className="sr-only">
            Write a comment
          </label>
          <Textarea
            id={fieldId}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={() => setTouched(true)}
            rows={2}
            invalid={tooLong || invalid}
            aria-describedby={hintId}
            placeholder="Add to the thread…"
            className="min-h-[72px] bg-card text-base sm:text-[14px]"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p id={hintId} className={cn("label-xs tabular", tooLong ? "text-oxide" : "text-faint")}>
              {value.length} / {COMMENT_MAX_LENGTH}
            </p>
            <Button type="submit" size="sm" disabled={disabled} aria-busy={submitting || undefined}>
              {submitting ? (
                <>
                  <Send className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" strokeWidth={2} />
                  Comment
                </>
              )}
            </Button>
          </div>

          {invalid ? (
            <p role="alert" className="mt-2 text-[13px] text-oxide">
              Write something before posting your comment.
            </p>
          ) : null}

          {error ? (
            <p
              role="alert"
              className="mt-2 flex items-start gap-2 rounded-card border border-oxide/30 bg-oxide-soft px-3 py-2 text-[13px] leading-snug text-oxide"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
              <span>
                <span className="font-semibold">{errorCopy(error).title}. </span>
                {errorCopy(error).body} Your text is still here — press Comment to retry.
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}

export function CommentCard({
  comment,
  pending = false,
}: {
  comment: CommentView;
  pending?: boolean;
}) {
  return (
    <li className={cn("flex gap-3", pending && "opacity-70")}>
      <Avatar id={comment.author.id} name={comment.author.name} size="sm" className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="break-words font-display text-[15px] leading-tight text-ink">
            {comment.author.name}
          </span>
          <span className="truncate text-[12px] text-muted">@{comment.author.handle}</span>
          <span className="label-xs whitespace-nowrap text-faint">
            {pending
              ? "Sending…"
              : new Date(comment.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-wrap break-words text-[14px] leading-[1.55] text-ink-soft">
          {comment.content}
        </p>
      </div>
    </li>
  );
}
