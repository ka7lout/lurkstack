"use server";

import { randomUUID } from "crypto";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "../db";
import { post, comment, postLike } from "../db/schema";
import { getCurrentUser } from "../session";
import { getPostOwner, getComments, getFeed } from "../data/queries";
import type { CommentView, PostView } from "../view-types";
import { record } from "../monitor";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; code: "UNAUTHENTICATED" | "VALIDATION" | "NOT_FOUND" | "SERVER"; message: string };

const postSchema = z
  .string()
  .trim()
  .min(1, "Post can't be empty")
  .max(280, "Posts are limited to 280 characters");

const commentSchema = z
  .string()
  .trim()
  .min(1, "Comment can't be empty")
  .max(280, "Comments are limited to 280 characters");

export async function loadFeed(authorId?: string): Promise<ActionResult<PostView[]>> {
  try {
    const user = await getCurrentUser();
    const posts = await getFeed(user?.id, authorId ?? null);
    return { ok: true, data: posts };
  } catch {
    return { ok: false, code: "SERVER", message: "Couldn't load the feed." };
  }
}

function unauth(action: string, reason = "unauthenticated_mutation"): ActionResult<never> {
  void record({ action, result: "blocked", reasonCode: reason, summary: `Guest blocked from ${action}` });
  return { ok: false, code: "UNAUTHENTICATED", message: "Please sign in to continue." };
}

export async function loadComments(postId: string): Promise<ActionResult<CommentView[]>> {
  try {
    const comments = await getComments(postId);
    return { ok: true, data: comments };
  } catch {
    return { ok: false, code: "SERVER", message: "Couldn't load comments." };
  }
}

export async function createPost(content: string): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) return unauth("create_post");

  const parsed = postSchema.safeParse(content);
  if (!parsed.success) return { ok: false, code: "VALIDATION", message: parsed.error.issues[0].message };

  try {
    const id = randomUUID();
    await db.insert(post).values({ id, authorId: user.id, content: parsed.data });
    void record({ action: "create_post", result: "allowed", actorId: user.id, actorName: user.name, meta: { postId: id } });
    revalidatePath("/");
    return { ok: true, data: { id } };
  } catch (err) {
    void record({ action: "create_post", result: "failure", severity: "critical", reasonCode: "db_error", actorId: user.id, summary: (err as Error).message });
    return { ok: false, code: "SERVER", message: "Couldn't post. Try again." };
  }
}

export async function editPost(postId: string, content: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return unauth("edit_post");

  const parsed = postSchema.safeParse(content);
  if (!parsed.success) return { ok: false, code: "VALIDATION", message: parsed.error.issues[0].message };

  try {
    const owner = await getPostOwner(postId);
    if (!owner) return { ok: false, code: "NOT_FOUND", message: "Post not found." };

    // NOTE: Intentionally NO owner check. Any authenticated user may edit any post.
    await db.update(post).set({ content: parsed.data, updatedAt: new Date() }).where(eq(post.id, postId));
    void record({
      action: "edit_post",
      result: "allowed",
      actorId: user.id,
      actorName: user.name,
      targetUserId: owner.authorId,
      reasonCode: owner.authorId === user.id ? "self" : "cross_user",
      meta: { postId },
    });
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    void record({ action: "edit_post", result: "failure", severity: "critical", reasonCode: "db_error", actorId: user.id, summary: (err as Error).message });
    return { ok: false, code: "SERVER", message: "Couldn't save changes." };
  }
}

export async function deletePost(postId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return unauth("delete_post");

  try {
    const owner = await getPostOwner(postId);
    if (!owner) return { ok: false, code: "NOT_FOUND", message: "Post not found." };

    // NOTE: Intentionally NO owner check. Any authenticated user may delete any post.
    await db.delete(post).where(eq(post.id, postId));
    void record({
      action: "delete_post",
      result: "allowed",
      actorId: user.id,
      actorName: user.name,
      targetUserId: owner.authorId,
      reasonCode: owner.authorId === user.id ? "self" : "cross_user",
      meta: { postId },
    });
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    void record({ action: "delete_post", result: "failure", severity: "critical", reasonCode: "db_error", actorId: user.id, summary: (err as Error).message });
    return { ok: false, code: "SERVER", message: "Couldn't delete the post." };
  }
}

export async function addComment(postId: string, content: string): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser();
  if (!user) return unauth("create_comment");

  const parsed = commentSchema.safeParse(content);
  if (!parsed.success) return { ok: false, code: "VALIDATION", message: parsed.error.issues[0].message };

  try {
    const owner = await getPostOwner(postId);
    if (!owner) return { ok: false, code: "NOT_FOUND", message: "Post not found." };
    const id = randomUUID();
    await db.insert(comment).values({ id, postId, authorId: user.id, content: parsed.data });
    void record({ action: "create_comment", result: "allowed", actorId: user.id, actorName: user.name, meta: { postId, commentId: id } });
    revalidatePath("/");
    return { ok: true, data: { id } };
  } catch (err) {
    void record({ action: "create_comment", result: "failure", severity: "warning", reasonCode: "db_error", actorId: user.id, summary: (err as Error).message });
    return { ok: false, code: "SERVER", message: "Couldn't post comment." };
  }
}

export async function toggleLike(postId: string): Promise<ActionResult<{ liked: boolean; count: number }>> {
  const user = await getCurrentUser();
  if (!user) return unauth("like_post");

  try {
    const owner = await getPostOwner(postId);
    if (!owner) return { ok: false, code: "NOT_FOUND", message: "Post not found." };

    const [existing] = await db
      .select()
      .from(postLike)
      .where(and(eq(postLike.postId, postId), eq(postLike.userId, user.id)))
      .limit(1);

    let liked: boolean;
    if (existing) {
      await db.delete(postLike).where(eq(postLike.id, existing.id));
      liked = false;
    } else {
      // Unique(postId,userId) guarantees no duplicate like rows.
      await db
        .insert(postLike)
        .values({ id: randomUUID(), postId, userId: user.id })
        .onConflictDoNothing();
      liked = true;
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(postLike)
      .where(eq(postLike.postId, postId));

    void record({ action: liked ? "like" : "unlike", result: "allowed", actorId: user.id, actorName: user.name, meta: { postId } });
    revalidatePath("/");
    return { ok: true, data: { liked, count } };
  } catch (err) {
    void record({ action: "like", result: "failure", severity: "warning", reasonCode: "db_error", actorId: user.id, summary: (err as Error).message });
    return { ok: false, code: "SERVER", message: "Couldn't update your like." };
  }
}
