"use client";

import { useState, type FormEvent } from "react";
import { AlertTriangle, Check, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useSession, useAuthGate } from "@/lib/client-auth";
import { errorCopy, type ApiErrorCode } from "@/lib/errors";
import { useDelayedFlag } from "@/lib/network";
import { POST_MAX_LENGTH } from "@/lib/view-types";
import { cn } from "@/lib/utils";

export interface PostComposerProps {
  creating: boolean;
  onSubmit: (content: string) => Promise<{ ok: boolean; error?: ApiErrorCode }>;
}

export function PostComposer({ creating, onSubmit }: PostComposerProps) {
  const session = useSession();
  const gate = useAuthGate();
  const { toast } = useToast();
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<ApiErrorCode | null>(null);
  const [justPosted, setJustPosted] = useState(false);

  const trimmed = value.trim();
  const tooLong = value.length > POST_MAX_LENGTH;
  const empty = trimmed.length === 0;
  const disabled = creating || tooLong;
  const percent = Math.min(100, Math.round((value.length / POST_MAX_LENGTH) * 100));
  const slow = useDelayedFlag(creating, 2200);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setTouched(true);
    if (disabled || empty) return;

    const result = await onSubmit(value);
    if (result.ok) {
      setValue("");
      setTouched(false);
      setError(null);
      setJustPosted(true);
      toast({ title: "Post published", description: "It's at the top of the feed.", variant: "success" });
      window.setTimeout(() => setJustPosted(false), 3600);
      return;
    }
    setError(result.error ?? "server");
    toast({
      title: "Post wasn't published",
      description: "Your draft is still here. Press Post to retry.",
      variant: "error",
    });
  }

  // Guests see the composer as an invitation into the auth gate, never a dead end.
  if (!session) {
    return (
      <section
        aria-label="Write a post"
        className="border-b border-rule bg-card px-4 py-5 sm:px-6 sm:py-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-[17px] leading-tight text-ink">Have something to add?</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted">
              Create an account or sign in to post to the feed.
            </p>
          </div>
          <Button onClick={() => gate.open("Create an account or sign in to post to the feed.")}>
            Sign in to post
          </Button>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      aria-label="Write a post"
      className="border-b border-rule bg-card px-4 py-5 sm:px-6 sm:py-6"
    >
      <div className="flex gap-3">
        <Avatar id={session.user.id} name={session.user.name} size="md" className="mt-0.5" />

        <div className="min-w-0 flex-1">
          <label htmlFor="post-composer" className="sr-only">
            Write a post
          </label>
          <Textarea
            id="post-composer"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (error) setError(null);
            }}
            onBlur={() => setTouched(true)}
            rows={3}
            invalid={tooLong || (touched && empty && value.length > 0)}
            aria-describedby="post-composer-meta"
            placeholder="Share an update with everyone…"
            className="min-h-[96px] bg-paper/60 text-[15.5px]"
          />

          <div className="mt-1.5 h-px w-full bg-rule" aria-hidden="true">
            <div
              className={cn(
                "h-px transition-[width] duration-200",
                tooLong ? "bg-oxide" : percent > 85 ? "bg-amber" : "bg-press",
              )}
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p
              id="post-composer-meta"
              className={cn("label-xs tabular", tooLong ? "text-oxide" : "text-faint")}
            >
              {value.length} / {POST_MAX_LENGTH}
              <span className="ml-2 hidden normal-case tracking-normal text-faint sm:inline">
                {tooLong ? "Over the limit" : "characters"}
              </span>
            </p>

            <div className="flex items-center gap-2">
              {value.length > 0 && !tooLong ? (
                <Button variant="ghost" size="sm" onClick={() => setValue("")} disabled={creating}>
                  Clear
                </Button>
              ) : null}
              <Button type="submit" disabled={disabled || empty} aria-busy={creating || undefined}>
                {creating ? (
                  <>
                    <Send className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                    Posting…
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" strokeWidth={2} />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>

          <span role="status" aria-live="polite" className="sr-only">
            {creating ? "Publishing your post" : justPosted ? "Post published" : ""}
          </span>

          {creating && slow ? (
            <p className="mt-2 flex items-center gap-2 text-[13px] text-amber" role="status">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber" aria-hidden="true" />
              This is taking longer than usual — your draft is safe.
            </p>
          ) : null}

          {touched && empty && !creating && !error ? (
            <p role="alert" className="mt-2 text-[13px] text-oxide">
              Write something before posting.
            </p>
          ) : null}

          {error ? (
            <div
              role="alert"
              className="mt-3 flex flex-wrap items-start gap-x-3 gap-y-2 rounded-card border border-oxide/30 bg-oxide-soft px-3 py-2.5"
            >
              <span className="flex min-w-0 flex-1 items-start gap-2 text-[13px] leading-snug text-oxide">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
                <span>
                  <span className="font-semibold">{errorCopy(error).title}. </span>
                  {errorCopy(error).body}
                </span>
              </span>
              <Button type="submit" size="sm" variant="outline" className="shrink-0" disabled={creating}>
                Retry
              </Button>
            </div>
          ) : null}

          {justPosted && !error ? (
            <p className="mt-3 flex items-center gap-2 rounded-card border border-press/25 bg-press-soft px-3 py-2 text-[13px] text-press">
              <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
              Published to the feed.
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
