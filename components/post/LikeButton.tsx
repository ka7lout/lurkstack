"use client";

import { Heart } from "lucide-react";
import { useLike } from "@/components/post/useLike";
import { formatCount } from "@/lib/format";
import type { PostView } from "@/lib/view-types";
import { cn } from "@/lib/utils";

export function LikeButton({ post }: { post: PostView }) {
  const { liked, count, pending, toggle } = useLike(post);

  return (
    <span className="inline-flex items-center">
      <button
        type="button"
        onClick={() => void toggle()}
        aria-pressed={liked}
        aria-busy={pending || undefined}
        aria-label={`Like this post — ${count} ${count === 1 ? "reaction" : "reactions"}, ${
          liked ? "currently liked" : "not liked"
        }${pending ? ", updating" : ""}`}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-card px-2 text-[12px] font-semibold transition-colors",
          liked ? "text-press" : "text-muted hover:bg-press-soft hover:text-press",
          pending && "opacity-60",
        )}
      >
        <Heart
          key={liked ? "liked" : "unliked"}
          className={cn("h-4 w-4 animate-pop", liked && "fill-current")}
          strokeWidth={2}
        />
        <span className="tabular tracking-[0.04em]">{formatCount(count)}</span>
        <span className="sr-only">reactions</span>
      </button>
      <span role="status" className="sr-only">
        {pending ? "Updating reaction…" : ""}
      </span>
    </span>
  );
}
