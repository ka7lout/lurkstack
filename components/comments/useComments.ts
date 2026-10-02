"use client";

import { useCallback, useEffect, useState } from "react";
import { loadComments, addComment } from "@/lib/actions/posts";
import { fromActionCode, type ApiErrorCode } from "@/lib/errors";
import type { CommentView, SessionUserView, UserView } from "@/lib/view-types";

export type CommentsStatus = "idle" | "loading" | "success" | "error";

export interface PendingComment {
  id: string;
  content: string;
  author: UserView;
}

function toAuthorView(user: SessionUserView): UserView {
  return {
    id: user.id,
    name: user.name,
    handle: user.handle,
    bio: "",
    joinedAt: new Date().toISOString(),
  };
}

/**
 * Comments are a *local* resource: their failure never affects the feed.
 * Submitting is optimistic — the pending comment renders immediately with a
 * "Sending…" state and is rolled back if the write fails.
 */
export function useComments(postId: string, enabled: boolean) {
  const [comments, setComments] = useState<CommentView[]>([]);
  const [status, setStatus] = useState<CommentsStatus>("idle");
  const [error, setError] = useState<ApiErrorCode | null>(null);
  const [nonce, setNonce] = useState(0);
  const [pendingComment, setPendingComment] = useState<PendingComment | null>(null);
  const [submitError, setSubmitError] = useState<ApiErrorCode | null>(null);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    setStatus("loading");
    setError(null);

    void loadComments(postId).then((res) => {
      if (cancelled) return;
      if (res.ok) {
        setComments(res.data ?? []);
        setStatus("success");
      } else {
        setError(fromActionCode(res.code));
        setStatus("error");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, postId, nonce]);

  const retry = useCallback(() => setNonce((value) => value + 1), []);

  const submit = useCallback(
    async (
      content: string,
      viewer: SessionUserView,
    ): Promise<{ ok: boolean; error?: ApiErrorCode }> => {
      const author = toAuthorView(viewer);
      const optimistic: PendingComment = {
        id: `pending_${postId}`,
        content: content.trim(),
        author,
      };
      setPendingComment(optimistic);
      setSubmitError(null);

      const res = await addComment(postId, content);
      if (res.ok) {
        // Re-read the authoritative list so ordering/counts stay truthful.
        const fresh = await loadComments(postId);
        if (fresh.ok) setComments(fresh.data ?? []);
        else setComments((prev) => [
          ...prev,
          {
            id: res.data?.id ?? optimistic.id,
            postId,
            authorId: author.id,
            author,
            content: content.trim(),
            createdAt: new Date().toISOString(),
          },
        ]);
        setPendingComment(null);
        return { ok: true };
      }

      // Optimistic rollback — the typed draft stays in the composer.
      setPendingComment(null);
      const code = fromActionCode(res.code);
      setSubmitError(code);
      return { ok: false, error: code };
    },
    [postId],
  );

  return {
    comments,
    status,
    error,
    retry,
    submit,
    pendingComment,
    submitError,
    clearSubmitError: () => setSubmitError(null),
  };
}
