'use client';

/** Split from activities-page-client.tsx (Faz 7) — card skeleton; UI unchanged. */
export function ActivityCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100/80 animate-pulse">
      <div className="relative h-56 bg-neutral-200"></div>
      <div className="p-5">
        <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/2 mb-1.5"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100/80">
          <div className="h-6 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-8 bg-neutral-200 rounded-lg w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
