"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { errorCopy, type ApiErrorCode } from "@/lib/errors";
import type { PostView } from "@/lib/view-types";

export interface DeletePostDialogProps {
  post: PostView | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ ok: boolean; error?: ApiErrorCode }>;
}

export function DeletePostDialog({ post, deleting, onClose, onConfirm }: DeletePostDialogProps) {
  return (
    <Dialog open={post !== null} onOpenChange={(open) => !open && onClose()}>
      {post ? (
        <DeleteForm key={post.id} post={post} deleting={deleting} onClose={onClose} onConfirm={onConfirm} />
      ) : null}
    </Dialog>
  );
}

function DeleteForm({
  post,
  deleting,
  onClose,
  onConfirm,
}: {
  post: PostView;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ ok: boolean; error?: ApiErrorCode }>;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ApiErrorCode | null>(null);
  const busy = pending || deleting;

  async function handleConfirm(): Promise<void> {
    if (busy) return;
    setPending(true);
    setError(null);
    const result = await onConfirm();
    setPending(false);
    if (result.ok) {
      onClose();
      return;
    }
    setError(result.error ?? "server");
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this post?</DialogTitle>
        <DialogDescription>
          This removes the post and its comments from the feed for everyone. It can&apos;t be undone.
        </DialogDescription>
      </DialogHeader>

      <blockquote className="max-h-[160px] overflow-y-auto rounded-card border border-rule bg-paper px-3.5 py-3">
        <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">
          {post.author.name} · {post.content.length} characters
        </p>
        <p className="line-clamp-4 whitespace-pre-wrap break-words text-[14px] leading-relaxed text-muted">
          {post.content}
        </p>
      </blockquote>

      {error ? (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-card border border-oxide/30 bg-oxide-soft px-3 py-2.5 text-[13px] leading-snug text-oxide"
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
          <span>
            <span className="font-semibold">{errorCopy(error).title}. </span>
            {errorCopy(error).body}
          </span>
        </p>
      ) : null}

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => void handleConfirm()} disabled={busy} aria-busy={busy || undefined}>
          {busy ? "Deleting…" : "Delete post"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
