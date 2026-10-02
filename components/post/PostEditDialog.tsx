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
import { Textarea } from "@/components/ui/input";
import { errorCopy, type ApiErrorCode } from "@/lib/errors";
import { useToast } from "@/components/ui/toast";
import { POST_MAX_LENGTH, type PostView } from "@/lib/view-types";
import { cn } from "@/lib/utils";

export interface PostEditDialogProps {
  post: PostView | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<{ ok: boolean; error?: ApiErrorCode }>;
}

export function PostEditDialog({ post, saving, onClose, onSubmit }: PostEditDialogProps) {
  return (
    <Dialog open={post !== null} onOpenChange={(open) => !open && onClose()}>
      {post ? <EditForm key={post.id} post={post} saving={saving} onClose={onClose} onSubmit={onSubmit} /> : null}
    </Dialog>
  );
}

function EditForm({
  post,
  saving,
  onClose,
  onSubmit,
}: {
  post: PostView;
  saving: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<{ ok: boolean; error?: ApiErrorCode }>;
}) {
  const { toast } = useToast();
  const [value, setValue] = useState(post.content);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ApiErrorCode | null>(null);

  const trimmed = value.trim();
  const tooLong = value.length > POST_MAX_LENGTH;
  const unchanged = trimmed === post.content.trim();
  const disabled = pending || saving || trimmed.length === 0 || tooLong || unchanged;
  const busy = pending || saving;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (disabled) return;
    setPending(true);
    setError(null);
    const result = await onSubmit(value);
    setPending(false);
    if (result.ok) {
      toast({ title: "Post updated", variant: "success" });
      onClose();
      return;
    }
    setError(result.error ?? "server");
  }

  return (
    <DialogContent>
      <form onSubmit={handleSubmit} noValidate>
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
          <DialogDescription>Changes are visible to everyone who can read the feed.</DialogDescription>
        </DialogHeader>

        <label htmlFor="edit-post" className="sr-only">
          Post text
        </label>
        <Textarea
          id="edit-post"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={6}
          invalid={tooLong}
          aria-describedby="edit-post-count"
          className="min-h-[150px] font-sans text-base sm:text-[15px]"
          placeholder="Write your post…"
        />

        <div className="mt-2 flex items-start justify-between gap-3">
          <p className={cn("label-xs tabular", tooLong ? "text-oxide" : "text-faint")}>
            <span id="edit-post-count">
              {value.length} / {POST_MAX_LENGTH}
            </span>
          </p>
          <p className="text-[12px] text-faint">
            {tooLong ? (
              <span className="text-oxide">{value.length - POST_MAX_LENGTH} over the limit</span>
            ) : unchanged ? (
              "No changes yet"
            ) : (
              "Ready to save"
            )}
          </p>
        </div>

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
          <Button type="submit" disabled={disabled} aria-busy={busy || undefined}>
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
