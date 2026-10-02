"use client";

import { Avatar } from "@/components/ui/avatar";
import { formatCount, formatMonthYear } from "@/lib/format";
import type { UserView } from "@/lib/view-types";

export function ProfileHeader({
  user,
  postCount,
  isSelf,
}: {
  user: UserView;
  postCount: number;
  isSelf: boolean;
}) {
  return (
    <section aria-labelledby="profile-name" className="overflow-hidden rounded-card border border-rule bg-card">
      <div className="h-16 w-full bg-press" aria-hidden="true">
        <div
          className="h-full w-full opacity-70"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(250,248,243,0.22) 0 1px, transparent 1px 14px)",
          }}
        />
      </div>

      <div className="px-4 pb-5 sm:px-6 sm:pb-6">
        <div className="-mt-9 flex items-end gap-4">
          <span className="rounded-card border-2 border-card shadow-[0_6px_18px_-10px_rgba(20,20,20,0.6)]">
            <Avatar id={user.id} name={user.name} size="xl" />
          </span>
          <div className="min-w-0 flex-1 pb-1">
            <p className="label-xs text-faint">Profile</p>
          </div>
        </div>

        <div className="mt-3 min-w-0">
          <h1 id="profile-name" className="break-words font-display text-[28px] leading-tight text-ink sm:text-[34px]">
            {user.name}
          </h1>
          <p className="mt-1 break-all text-[14px] text-muted">@{user.handle}</p>
          <p className="mt-3 max-w-[56ch] whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink-soft">
            {user.bio?.trim()
              ? user.bio
              : `On the wire at LurkStack. Anything they post appears below.`}
          </p>
        </div>

        <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rule pt-4">
          <div>
            <dt className="label-xs text-faint">Posts</dt>
            <dd className="mt-1 font-display text-[20px] leading-none text-ink tabular">
              {formatCount(postCount)}
            </dd>
          </div>
          <div>
            <dt className="label-xs text-faint">Joined</dt>
            <dd className="mt-1 font-display text-[20px] leading-none text-ink">
              {formatMonthYear(user.joinedAt)}
            </dd>
          </div>
          {isSelf ? (
            <div>
              <dt className="label-xs text-faint">Session</dt>
              <dd className="mt-1 font-display text-[20px] leading-none text-press">Signed in</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </section>
  );
}

export function ProfileNotFound({ handle }: { handle: string }) {
  return (
    <div className="rounded-card border border-rule bg-card px-5 py-8 text-center sm:px-8">
      <p className="label-xs text-oxide">No such profile</p>
      <h1 className="mt-3 font-display text-[26px] leading-tight text-ink">
        Nothing filed under <span className="break-all">@{handle}</span>
      </h1>
      <p className="mx-auto mt-2 max-w-[44ch] text-[14px] leading-relaxed text-muted">
        This account doesn&apos;t exist, or the handle was changed. The feed is still running.
      </p>
    </div>
  );
}

export function ProfilePostsEmpty({ name }: { name: string }) {
  return (
    <div className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="rounded-card border border-dashed border-rule-2 bg-paper/60 px-5 py-8 text-center">
        <h2 className="font-display text-[21px] text-ink">No posts yet</h2>
        <p className="mx-auto mt-2 max-w-[44ch] text-[14px] leading-relaxed text-muted">
          {name} hasn&apos;t posted yet. New posts appear here as soon as they&apos;re published.
        </p>
      </div>
    </div>
  );
}
