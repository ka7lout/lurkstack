"use client";

import { AppHeader } from "@/components/navigation/AppHeader";
import { PostComposer } from "@/components/feed/PostComposer";
import { FeedView } from "@/components/feed/FeedView";
import { useFeed } from "@/components/feed/useFeed";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useSession } from "@/lib/client-auth";
import { formatCount } from "@/lib/format";
import { errorCopy, type ApiErrorCode } from "@/lib/errors";
import type { PostView } from "@/lib/view-types";

export function FeedScreen({ initialPosts }: { initialPosts: PostView[] }) {
  const session = useSession();
  const resource = useFeed(initialPosts);
  const { status, posts, creating, createPost } = resource;

  async function handleCreate(content: string): Promise<{ ok: boolean; error?: ApiErrorCode }> {
    const result = await createPost(content);
    return result.ok ? { ok: true } : { ok: false, error: result.error };
  }

  function focusComposer(): void {
    const field = document.getElementById("post-composer");
    if (field instanceof HTMLElement) {
      field.focus();
      field.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  return (
    <>
      <AppHeader />

      <main id="main" tabIndex={-1} className="pb-20 focus:outline-none">
        {session ? (
          <section aria-label="Signed in as" className="border-b border-rule bg-paper-2/70">
            <div className="mx-auto flex max-w-[640px] items-center gap-3 px-3 py-3.5 sm:px-6">
              <Avatar id={session.user.id} name={session.user.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[16px] leading-tight text-ink">
                  {session.user.name}
                </p>
                <p className="label-xs mt-1 truncate text-faint">@{session.user.handle}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="label-xs text-faint">On the feed</p>
                <p className="mt-1 font-display text-[18px] leading-none text-ink tabular">
                  {status === "ready" ? formatCount(posts.length) : "—"}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <div className="mx-auto w-full max-w-[640px] px-3 pb-14 sm:px-6">
          <div className="mt-5 overflow-hidden rounded-card border border-rule bg-card sm:mt-6">
            <div className="flex items-center justify-between gap-3 border-b border-rule bg-paper-2/70 px-4 py-3 sm:px-6">
              <h1 className="font-sans label-xs text-ink">The feed</h1>
              <p className="label-xs text-faint tabular" aria-live="polite">
                {status === "loading"
                  ? "Loading…"
                  : status === "error"
                    ? "Unavailable"
                    : `${formatCount(posts.length)} ${posts.length === 1 ? "post" : "posts"}`}
              </p>
            </div>

            <PostComposer creating={creating} onSubmit={handleCreate} />

            <FeedView
              resource={resource}
              emptyAction={
                session ? (
                  <Button onClick={focusComposer}>Write the first post</Button>
                ) : undefined
              }
            />
          </div>

          {status === "error" ? (
            <p role="alert" className="mt-4 text-center text-[13px] text-oxide">
              {errorCopy(resource.error ?? "server").title}. {errorCopy(resource.error ?? "server").body}
            </p>
          ) : (
            <p className="label-xs mt-4 text-center text-faint">End of feed</p>
          )}
        </div>
      </main>
    </>
  );
}
