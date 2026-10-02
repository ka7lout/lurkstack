import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../db";
import { post, user, comment, postLike } from "../db/schema";
import { handleFor } from "../format";
import type { PostView, CommentView, UserView } from "../view-types";

function toUserView(row: { id: string; name: string; createdAt: Date }): UserView {
  return {
    id: row.id,
    name: row.name,
    handle: handleFor(row.name, row.id),
    bio: "",
    joinedAt: row.createdAt.toISOString(),
  };
}

// The viewer's own like is joined as a second, aliased copy of post_like so
// that "how many likes" and "has the viewer liked this" come from one
// statement. Reading them in two round-trips let a like land in between and
// produce a response that contradicted itself (count 0, liked true).
const viewerLike = alias(postLike, "viewer_like");

function postColumns() {
  return {
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    authorId: user.id,
    authorName: user.name,
    authorCreatedAt: user.createdAt,
    likeCount: sql<number>`count(distinct ${postLike.id})::int`,
    commentCount: sql<number>`count(distinct ${comment.id})::int`,
    viewerHasLiked: sql<boolean>`count(distinct ${viewerLike.id}) > 0`,
  };
}

/** Joins the viewer's own like row, or a never-true condition for guests. */
function viewerLikeJoin(viewerId?: string | null) {
  return viewerId
    ? and(eq(viewerLike.postId, post.id), eq(viewerLike.userId, viewerId))
    : sql`false`;
}

export async function getFeed(
  viewerId?: string | null,
  authorId?: string | null,
): Promise<PostView[]> {
  const rows = await db
    .select(postColumns())
    .from(post)
    .innerJoin(user, eq(post.authorId, user.id))
    .leftJoin(postLike, eq(postLike.postId, post.id))
    .leftJoin(comment, eq(comment.postId, post.id))
    .leftJoin(viewerLike, viewerLikeJoin(viewerId))
    .where(authorId ? eq(post.authorId, authorId) : undefined)
    .groupBy(post.id, user.id)
    .orderBy(desc(post.createdAt))
    .limit(50);

  return rows.map(mapPost);
}

type FeedRow = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  authorName: string;
  authorCreatedAt: Date;
  likeCount: number;
  commentCount: number;
  viewerHasLiked: boolean;
};

function mapPost(r: FeedRow): PostView {
  const edited = r.updatedAt.getTime() - r.createdAt.getTime() > 1000;
  return {
    id: r.id,
    authorId: r.authorId,
    author: toUserView({ id: r.authorId, name: r.authorName, createdAt: r.authorCreatedAt }),
    content: r.content,
    createdAt: r.createdAt.toISOString(),
    editedAt: edited ? r.updatedAt.toISOString() : undefined,
    likeCount: r.likeCount,
    viewerHasLiked: r.viewerHasLiked,
    commentCount: r.commentCount,
  };
}

export async function getComments(postId: string): Promise<CommentView[]> {
  const rows = await db
    .select({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      authorId: user.id,
      authorName: user.name,
      authorCreatedAt: user.createdAt,
    })
    .from(comment)
    .innerJoin(user, eq(comment.authorId, user.id))
    .where(eq(comment.postId, postId))
    .orderBy(comment.createdAt);
  return rows.map((r) => ({
    id: r.id,
    postId,
    authorId: r.authorId,
    author: toUserView({ id: r.authorId, name: r.authorName, createdAt: r.authorCreatedAt }),
    content: r.content,
    createdAt: r.createdAt.toISOString(),
  }));
}

export interface ProfileData {
  user: UserView;
  posts: PostView[];
}

export async function getProfile(
  userId: string,
  viewerId?: string | null,
): Promise<ProfileData | null> {
  const [u] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  if (!u) return null;

  const rows = await db
    .select(postColumns())
    .from(post)
    .innerJoin(user, eq(post.authorId, user.id))
    .leftJoin(postLike, eq(postLike.postId, post.id))
    .leftJoin(comment, eq(comment.postId, post.id))
    .leftJoin(viewerLike, viewerLikeJoin(viewerId))
    .where(eq(post.authorId, userId))
    .groupBy(post.id, user.id)
    .orderBy(desc(post.createdAt));

  return {
    user: toUserView({ id: u.id, name: u.name, createdAt: u.createdAt }),
    posts: rows.map(mapPost),
  };
}

export async function getPostOwner(postId: string) {
  const [row] = await db
    .select({ id: post.id, authorId: post.authorId })
    .from(post)
    .where(eq(post.id, postId))
    .limit(1);
  return row ?? null;
}

export async function seedCounts() {
  const [[u], [p], [c], [l]] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(user),
    db.select({ n: sql<number>`count(*)::int` }).from(post),
    db.select({ n: sql<number>`count(*)::int` }).from(comment),
    db.select({ n: sql<number>`count(*)::int` }).from(postLike),
  ]);
  return { users: u.n, posts: p.n, comments: c.n, likes: l.n };
}
