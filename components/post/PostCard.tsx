"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { CommentSection, CommentsToggle } from "@/components/comments/CommentSection";
import { LikeButton } from "@/components/post/LikeButton";
import { PostMenu } from "@/components/post/PostMenu";
import { useSession, useAuthGate } from "@/lib/client-auth";
import { formatFullDate, formatRelative } from "@/lib/format";
import type { PostView } from "@/lib/view-types";
import { cn } from "@/lib/utils";

export interface PostCardProps {
  post: PostView;
  deleting?: boolean;
  onEdit: (post: PostView) => void;
  onDelete: (post: PostView) => void;
}

export function PostCard({ post, deleting = false, onEdit, onDelete }: PostCardProps) {
  const session = useSession();
  const gate = useAuthGate();
  const [expanded, setExpanded] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const headingId = `post-${post.id}-author`;
  const profileHref = `/u/${post.author.id}`;

  // Every authenticated user gets the menu — ownership is never consulted.
  function openEdit() {
    if (!session) {
      gate.open("Create an account or sign in to edit posts.");
      return;
    }
    onEdit(post);
  }

  function openDelete() {
    if (!session) {
      gate.open("Create an account or sign in to delete posts.");
      return;
    }
    onDelete(post);
  }

  return (
    <article
      aria-labelledby={headingId}
      data-state={deleting ? "deleting" : undefined}
      className={cn(
        "border-t border-rule bg-card transition-colors",
        deleting ? "opacity-55" : "hover:bg-paper/70 focus-within:bg-paper/70",
      )}
      aria-busy={deleting || undefined}
    >
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <header className="flex items-start gap-3">
          <Link href={profileHref} tabIndex={-1} aria-hidden="true" className="shrink-0">
            <Avatar id={post.author.id} name={post.author.name} size="md" />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <h2 id={headingId} className="break-words font-display text-[16px] leading-tight text-ink">
                <Link href={profileHref} className="hover:underline decoration-rule-2 underline-offset-4">
                  {post.author.name}
                </Link>
              </h2>
              <Link href={profileHref} className="break-all text-[13px] text-muted hover:text-press">
                @{post.author.handle}
              </Link>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <time dateTime={post.createdAt} title={formatFullDate(post.createdAt)} className="label-xs text-faint">
                {formatRelative(post.createdAt)}
              </time>
              {post.editedAt ? <span className="label-xs text-faint">· edited</span> : null}
              {deleting ? (
                <span className="label-xs inline-flex items-center gap-1.5 text-oxide">
                  <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.5} />
                  Deleting…
                </span>
              ) : null}
            </p>
          </div>

          <PostMenu authorName={post.author.name} onEdit={openEdit} onDelete={openDelete} />
        </header>

        <p className="mt-3.5 whitespace-pre-wrap break-words text-[15.5px] leading-[1.62] text-ink-soft">
          {post.content}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1">
          <LikeButton post={post} />
          <CommentsToggle
            count={commentCount}
            expanded={expanded}
            onToggle={() => setExpanded((value) => !value)}
          />
        </div>
      </div>

      {expanded ? (
        <CommentSection key={post.id} post={{ ...post, commentCount }} onCountChange={setCommentCount} />
      ) : null}
    </article>
  );
}
