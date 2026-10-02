"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  loadFeed,
  createPost as createPostAction,
  editPost as editPostAction,
  deletePost as deletePostAction,
} from "@/lib/actions/posts";
import { fromActionCode, type ApiErrorCode } from "@/lib/errors";
import type { PostView } from "@/lib/view-types";

type Status = "loading" | "ready" | "error";

export interface MutationResult {
  ok: boolean;
  error?: ApiErrorCode;
}

export interface FeedResource {
  posts: PostView[];
  status: Status;
  error: ApiErrorCode | null;
  creating: boolean;
  reload: () => void;
  refresh: () => Promise<void>;
  savingId: string | null;
  deletingId: string | null;
  createPost: (content: string) => Promise<MutationResult>;
  editPost: (id: string, content: string) => Promise<MutationResult>;
  deletePost: (id: string) => Promise<MutationResult>;
}

/**
 * Client-side feed resource backed by real server actions.
 *
 * @param initialPosts posts already rendered on the server (skips the first fetch)
 * @param authorId     when set, scopes the feed to a single author's profile
 */
export function useFeed(initialPosts?: PostView[], authorId?: string): FeedResource {
  const [posts, setPosts] = useState<PostView[]>(initialPosts ?? []);
  const [status, setStatus] = useState<Status>(initialPosts ? "ready" : "loading");
  const [error, setError] = useState<ApiErrorCode | null>(null);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const didInit = useRef(Boolean(initialPosts));

  const refresh = useCallback(async () => {
    const res = await loadFeed(authorId);
    if (res.ok) {
      setPosts(res.data ?? []);
      setStatus("ready");
      setError(null);
    }
  }, [authorId]);

  const reload = useCallback(() => {
    setStatus("loading");
    setError(null);
    void loadFeed(authorId).then((res) => {
      if (res.ok) {
        setPosts(res.data ?? []);
        setStatus("ready");
      } else {
        setError(fromActionCode(res.code));
        setStatus("error");
      }
    });
  }, [authorId]);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    reload();
  }, [reload]);

  const createPost = useCallback(
    async (content: string): Promise<MutationResult> => {
      setCreating(true);
      const res = await createPostAction(content);
      setCreating(false);
      if (res.ok) {
        await refresh();
        return { ok: true };
      }
      return { ok: false, error: fromActionCode(res.code) };
    },
    [refresh],
  );

  const editPost = useCallback(
    async (id: string, content: string): Promise<MutationResult> => {
      setSavingId(id);
      const res = await editPostAction(id, content);
      setSavingId(null);
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, content: content.trim(), editedAt: new Date().toISOString() } : p,
          ),
        );
        return { ok: true };
      }
      return { ok: false, error: fromActionCode(res.code) };
    },
    [],
  );

  const deletePost = useCallback(
    async (id: string): Promise<MutationResult> => {
      setDeletingId(id);
      const res = await deletePostAction(id);
      setDeletingId(null);
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        return { ok: true };
      }
      return { ok: false, error: fromActionCode(res.code) };
    },
    [],
  );

  return {
    posts,
    status,
    error,
    creating,
    reload,
    refresh,
    savingId,
    deletingId,
    createPost,
    editPost,
    deletePost,
  };
}
