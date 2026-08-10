import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight as ArrowRightIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Star as StarIcon,
} from 'lucide-react';

import type { RouteWithStats } from '@/services/route';

const CATEGORY_LABELS: Record<string, string> = {
  historical: 'Tarihi & Kültürel',
  nature: 'Doğa & Manzara',
  beach: 'Deniz & Plaj',
  gastronomy: 'Gastronomi',
  family: 'Aile Dostu',
};

function formatRating(rating: number | null): string {
  if (rating === null) return '—';
  return rating.toFixed(1);
}

export function RouteCard({ route }: { route: RouteWithStats }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <Link
        href={`/routes/${route.id}`}
        className="relative aspect-[16/10] overflow-hidden bg-neutral-100"
      >
        <Image
          src={route.image}
          alt={route.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 inline-flex items-center rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-neutral-900 backdrop-blur-sm">
          {route.tourCount} tur
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {CATEGORY_LABELS[route.category] ?? route.category}
        </p>
        <h3 className="text-lg font-semibold text-neutral-900">
          <Link href={`/routes/${route.id}`} className="hover:text-neutral-600">
            {route.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-600">
          {route.description}
        </p>

        <div className="mt-1 space-y-1.5 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 shrink-0 text-neutral-950" />
            <span>{route.computedDuration ?? route.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 shrink-0 text-neutral-950" />
            <span>{route.bestTimeToVisit}</span>
          </div>
          {route.priceRange ? (
            <p className="pl-6 text-xs font-medium text-neutral-800">
              {route.priceRange}
            </p>
          ) : null}
        </div>

        {route.highlights.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {route.highlights.slice(0, 3).map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700"
              >
                {highlight}
              </span>
            ))}
            {route.highlights.length > 3 ? (
              <span className="inline-flex items-center rounded-md bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-500">
                +{route.highlights.length - 3}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="flex min-w-0 items-center">
            {route.avgRating !== null ? (
              <>
                <div className="flex items-center" aria-hidden>
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      className={`h-3.5 w-3.5 ${
                        index < Math.floor(route.avgRating!)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1.5 text-sm text-neutral-600">
                  {formatRating(route.avgRating)}
                </span>
              </>
            ) : (
              <span className="text-xs text-neutral-400">
                Henüz değerlendirme yok
              </span>
            )}
          </div>
          <Link
            href={`/routes/${route.id}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-neutral-950 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Keşfet
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
