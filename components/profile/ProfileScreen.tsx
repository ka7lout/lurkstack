"use client";

import Link from "next/link";
import { AppHeader } from "@/components/navigation/AppHeader";
import { FeedView } from "@/components/feed/FeedView";
import { ProfileHeader, ProfilePostsEmpty } from "@/components/profile/ProfileHeader";
import { useFeed } from "@/components/feed/useFeed";
import { useSession } from "@/lib/client-auth";
import type { PostView, UserView } from "@/lib/view-types";

export function ProfileScreen({ user, initialPosts }: { user: UserView; initialPosts: PostView[] }) {
  const session = useSession();
  const feed = useFeed(initialPosts, user.id);
  const isSelf = session?.user.id === user.id;

  return (
    <>
      <AppHeader />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[640px] px-3 pb-20 pt-5 focus:outline-none sm:px-6 sm:pt-7"
      >
        <nav aria-label="Breadcrumb" className="mb-4">
          <Link href="/" className="label-xs text-muted hover:text-press">
            ← The feed
          </Link>
        </nav>

        <div className="space-y-4">
          <ProfileHeader
            user={user}
            postCount={feed.status === "ready" ? feed.posts.length : initialPosts.length}
            isSelf={Boolean(isSelf)}
          />

          <div className="overflow-hidden rounded-card border border-rule bg-card">
            <div className="flex items-center justify-between gap-3 border-b border-rule bg-paper-2/70 px-4 py-3 sm:px-6">
              <h2 className="font-sans label-xs text-ink">Posts</h2>
              <p className="label-xs text-faint tabular">
                {feed.status === "loading"
                  ? "Loading…"
                  : feed.status === "error"
                    ? "Unavailable"
                    : `${feed.posts.length} total`}
              </p>
            </div>

            {/* Partial failure: the profile header above stays visible if posts fail. */}
            {feed.status === "ready" && feed.posts.length === 0 ? (
              <ProfilePostsEmpty name={user.name} />
            ) : (
              <FeedView resource={feed} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
