"use client";

import { useState } from "react";
import { Radio } from "lucide-react";
import { DeletePostDialog } from "@/components/post/DeletePostDialog";
import { PostEditDialog } from "@/components/post/PostEditDialog";
import { PostCard } from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { PostSkeleton } from "@/components/states/skeletons";
import { useToast } from "@/components/ui/toast";
import { errorCopy, type ApiErrorCode } from "@/lib/errors";
import type { FeedResource } from "@/components/feed/useFeed";
import type { PostView } from "@/lib/view-types";

export interface FeedViewProps {
  resource: FeedResource;
  emptyAction?: React.ReactNode;
}

/**
 * Shared, finite feed presentation: loading skeleton → error → empty → list.
 * Owns the edit and delete dialogs so their pending states are visible on the
 * card as well as in the dialog.
 */
export function FeedView({ resource, emptyAction }: FeedViewProps) {
  const { posts, status, error, reload, savingId, deletingId, editPost, deletePost } = resource;
  const { toast } = useToast();
  const [editing, setEditing] = useState<PostView | null>(null);
  const [deleting, setDeleting] = useState<PostView | null>(null);

  if (status === "loading") {
    return (
      <div aria-busy="true">
        {Array.from({ length: 4 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    const code: ApiErrorCode = error ?? "server";
    const offline = code === "offline";
    return (
      <div className="px-4 py-5 sm:px-6 sm:py-6">
        <ErrorState
          code={code}
          title={offline ? "You're offline" : "The feed didn't load"}
          actionLabel={offline ? "Try again" : "Reload the feed"}
          onAction={reload}
        />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        <EmptyState
          icon={Radio}
          title="Nothing here yet"
          body="No posts yet. Publish the first update and it will appear at the top of the feed."
          action={emptyAction}
        />
      </div>
    );
  }

  return (
    <>
      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            deleting={deletingId === post.id}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        ))}
      </div>

      <PostEditDialog
        post={editing}
        saving={Boolean(editing) && savingId === editing?.id}
        onClose={() => setEditing(null)}
        onSubmit={async (content) => {
          if (!editing) return { ok: false, error: "not_found" };
          const result = await editPost(editing.id, content);
          if (result.ok) return { ok: true };
          return { ok: false, error: result.error };
        }}
      />

      <DeletePostDialog
        post={deleting}
        deleting={Boolean(deleting) && deletingId === deleting?.id}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return { ok: false, error: "not_found" };
          const target = deleting;
          const result = await deletePost(target.id);
          if (result.ok) {
            toast({
              title: "Post deleted",
              description: `${target.author.name}'s post was removed from the feed.`,
              variant: "success",
            });
            return { ok: true };
          }
          toast({
            title: "Couldn't delete that post",
            description: errorCopy(result.error ?? "server").body,
            variant: "error",
          });
          return { ok: false, error: result.error };
        }}
      />
    </>
  );
}

export function FeedReloadButton({ onReload }: { onReload: () => void }) {
  return (
    <Button variant="outline" size="sm" onClick={onReload}>
      Refresh
    </Button>
  );
}
