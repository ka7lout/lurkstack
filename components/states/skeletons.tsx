import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function SrLoading({ label }: { label: string }) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {label}
    </span>
  );
}

export function PostSkeleton({ className }: { className?: string }) {
  return (
    <article aria-hidden="true" className={cn("border-t border-rule px-4 py-5 sm:px-6 sm:py-6", className)}>
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-3 w-10" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[92%]" />
        <Skeleton className="h-3 w-[64%]" />
      </div>
      <div className="mt-5 flex gap-5">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-20" />
      </div>
    </article>
  );
}

export function ComposerSkeleton() {
  return (
    <section aria-hidden="true" className="border-t border-rule bg-card px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeedSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div aria-busy="true">
      <SrLoading label="Loading the feed" />
      <ComposerSkeleton />
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}

export function CommentSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 px-4 py-4 sm:px-6" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="h-8 w-8 shrink-0" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-[85%]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div aria-busy="true">
      <SrLoading label="Loading profile" />
      <div className="border-b border-rule px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex items-start gap-4">
          <Skeleton className="h-20 w-20 shrink-0" />
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-full max-w-md" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}
