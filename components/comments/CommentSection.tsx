"use client";

import { useState } from "react";
import { ChevronUp, MessageSquare } from "lucide-react";
import { CommentCard, CommentComposer } from "@/components/comments/CommentComposer";
import { useComments } from "@/components/comments/useComments";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { CommentSkeleton } from "@/components/states/skeletons";
import { useToast } from "@/components/ui/toast";
import { useSession } from "@/lib/client-auth";
import { formatCount } from "@/lib/format";
import type { PostView } from "@/lib/view-types";

export interface CommentSectionProps {
  post: PostView;
  onCountChange: (count: number) => void;
}

export function CommentSection({ post, onCountChange }: CommentSectionProps) {
  const session = useSession();
  const { toast } = useToast();
  const {
    comments,
    status,
    error,
    retry,
    submit,
    pendingComment,
    submitError,
    clearSubmitError,
  } = useComments(post.id, true);
  const [localCount, setLocalCount] = useState(post.commentCount);

  async function handleSubmit(content: string): Promise<{ ok: boolean }> {
    if (!session) return { ok: false };
    clearSubmitError();
    const result = await submit(content, session.user);
    if (result.ok) {
      const next = localCount + 1;
      setLocalCount(next);
      onCountChange(next);
      toast({ title: "Comment posted", variant: "success" });
    } else {
      toast({
        title: "Comment wasn't posted",
        description: "Your text is still in the box — try again.",
        variant: "error",
      });
    }
    return result;
  }

  return (
    <section aria-label={`Comments on the post by ${post.author.name}`} className="border-t border-rule bg-paper/60">
      <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6">
        <h3 className="label-xs flex items-center gap-2 text-muted">
          <MessageSquare className="h-3.5 w-3.5" strokeWidth={2.25} />
          Comments
          <span className="tabular text-faint">{formatCount(localCount)}</span>
        </h3>
        <span className="sr-only" role="status">
          {status === "loading" ? "Loading comments" : ""}
        </span>
      </div>

      <div className="mt-3">
        {status === "loading" ? (
          <CommentSkeleton count={3} />
        ) : status === "error" ? (
          <div className="px-4 pb-4 pt-1 sm:px-6">
            <ErrorState
              code={error ?? "server"}
              compact
              title="Comments failed to load"
              actionLabel="Retry comments"
              onAction={retry}
            />
          </div>
        ) : comments.length === 0 && !pendingComment ? (
          <div className="px-4 pb-4 sm:px-6">
            <EmptyState
              title="No comments yet"
              body="Be the first to reply to this post."
              className="bg-card px-4 py-6"
            />
          </div>
        ) : (
          <ul className="space-y-4 px-4 pb-4 sm:px-6">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
            {pendingComment ? (
              <CommentCard
                pending
                comment={{
                  id: pendingComment.id,
                  postId: post.id,
                  authorId: pendingComment.author.id,
                  author: pendingComment.author,
                  content: pendingComment.content,
                  createdAt: new Date().toISOString(),
                }}
              />
            ) : null}
          </ul>
        )}
      </div>

      <CommentComposer
        postId={post.id}
        submitting={Boolean(pendingComment)}
        error={submitError}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

/** Toggle button rendered in the post action row. */
export function CommentsToggle({
  count,
  expanded,
  onToggle,
}: {
  count: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      className="inline-flex h-8 items-center gap-1.5 rounded-card px-2 text-[12px] font-semibold text-muted transition-colors hover:bg-paper-2 hover:text-ink"
    >
      <MessageSquare className="h-4 w-4" strokeWidth={2} />
      {count > 0 ? (
        <span className="tabular tracking-[0.04em]">{formatCount(count)}</span>
      ) : null}
      <span className="uppercase tracking-[0.1em]">
        {expanded ? "Hide" : count > 0 ? "Comments" : "Comment"}
      </span>
      <ChevronUp
        className={expanded ? "h-3.5 w-3.5 rotate-180 transition-transform" : "h-3.5 w-3.5 transition-transform"}
        strokeWidth={2.25}
      />
    </button>
  );
}
