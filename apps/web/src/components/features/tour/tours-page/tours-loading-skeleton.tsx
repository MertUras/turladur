'use client';

/** Split from tours-page-client.tsx (Faz 7) — loading skeleton; UI unchanged. */
export function ToursLoadingSkeleton({
  itemsPerPage,
}: {
  itemsPerPage: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
          role="status"
          aria-label="Yükleniyor"
        >
          <div className="h-64 bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
