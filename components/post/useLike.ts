"use client";

import { useState } from "react";
import { toggleLike } from "@/lib/actions/posts";
import { useSession, useAuthGate } from "@/lib/client-auth";
import { useToast } from "@/components/ui/toast";
import { errorCopy, fromActionCode } from "@/lib/errors";
import type { PostView } from "@/lib/view-types";

export function useLike(post: PostView) {
  const session = useSession();
  const gate = useAuthGate();
  const { toast } = useToast();
  const [liked, setLiked] = useState(post.viewerHasLiked);
  const [count, setCount] = useState(post.likeCount);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (!session) {
      gate.open("Create an account or sign in to react to posts.");
      return;
    }
    if (pending) return;

    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevCount + (prevLiked ? -1 : 1));
    setPending(true);

    const res = await toggleLike(post.id);
    setPending(false);

    if (res.ok) {
      setLiked(res.data!.liked);
      setCount(res.data!.count);
    } else {
      setLiked(prevLiked);
      setCount(prevCount);
      toast({ title: "Couldn't update your reaction", description: errorCopy(fromActionCode(res.code)).body, variant: "error" });
    }
  }

  return { liked, count, pending, toggle };
}
