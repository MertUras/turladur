import Link from 'next/link';
import type { Tour } from '@turladur/shared-types';

function formatPrice(price: string, currency: string) {
  const value = Number(price);
  if (Number.isNaN(value)) return `${price} ${currency}`;
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency || 'TRY',
    maximumFractionDigits: 0,
  }).format(value);
}

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        {tour.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tour.coverUrl}
            alt={tour.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-sky-100 to-sky-200 text-sky-800">
            <span className="text-sm font-medium">{tour.category}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-sky-700">
          {tour.category}
        </p>
        <h3 className="text-lg font-semibold text-neutral-900">
          <Link href={`/tours/${tour.id}`} className="hover:text-sky-700">
            {tour.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-600">
          {tour.description}
        </p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-xs text-neutral-500">{tour.durationDays} gün</p>
            <p className="text-lg font-semibold text-neutral-900">
              {formatPrice(tour.price, tour.currency)}
            </p>
          </div>
          <Link
            href={`/tours/${tour.id}`}
            className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
          >
            İncele
          </Link>
        </div>
      </div>
    </article>
  );
}
