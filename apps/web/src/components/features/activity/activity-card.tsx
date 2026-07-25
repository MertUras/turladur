import Link from 'next/link';
import type { Experience } from '@turta/shared-types';

function formatPrice(price: string) {
  const value = Number(price);
  if (Number.isNaN(value)) return `${price} TRY`;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Same card language as TourCard — ink borders, no purple/glow. */
export function ActivityCard({ experience }: { experience: Experience }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
        <span className="px-4 text-center text-sm font-medium text-neutral-700">
          {experience.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {experience.location}
        </p>
        <h3 className="text-lg font-semibold text-neutral-900">
          <Link
            href={`/activities/${experience.id}`}
            className="hover:text-neutral-600"
          >
            {experience.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-600">
          {experience.description}
        </p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-xs text-neutral-500">{experience.duration}</p>
            <p className="text-lg font-semibold text-neutral-900">
              {formatPrice(experience.price)}
            </p>
          </div>
          <Link
            href={`/activities/${experience.id}`}
            className="rounded-lg bg-neutral-950 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            İncele
          </Link>
        </div>
      </div>
    </article>
  );
}
