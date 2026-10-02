import { ComposerSkeleton, PostSkeleton } from "@/components/states/skeletons";

export default function Loading() {
  return (
    <main id="main" className="pb-20">
      <div className="mx-auto w-full max-w-[640px] px-3 pb-14 sm:px-6">
        <div className="mt-5 overflow-hidden rounded-card border border-rule bg-card sm:mt-6">
          <div className="flex items-center justify-between gap-3 border-b border-rule bg-paper-2/70 px-4 py-3 sm:px-6">
            <h1 className="font-sans label-xs text-ink">The feed</h1>
            <p className="label-xs text-faint" role="status">
              Loading…
            </p>
          </div>
          <ComposerSkeleton />
          {Array.from({ length: 4 }).map((_, index) => (
            <PostSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
