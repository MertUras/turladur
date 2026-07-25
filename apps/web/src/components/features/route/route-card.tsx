import Image from 'next/image';
import Link from 'next/link';

import type { RouteWithStats } from '@/services/route';

const CATEGORY_LABELS: Record<string, string> = {
  historical: 'Tarihi & Kültürel',
  nature: 'Doğa & Manzara',
  beach: 'Deniz & Plaj',
  gastronomy: 'Gastronomi',
  family: 'Aile Dostu',
};

export function RouteCard({ route }: { route: RouteWithStats }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
        <Image
          src={route.image}
          alt={route.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
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
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="text-xs text-neutral-500">
            <p>{route.computedDuration ?? route.duration}</p>
            <p className="mt-1 font-medium text-neutral-800">
              {route.tourCount} tur
              {route.priceRange ? ` · ${route.priceRange}` : ''}
            </p>
          </div>
          <Link
            href={`/routes/${route.id}`}
            className="rounded-lg bg-neutral-950 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Keşfet
          </Link>
        </div>
      </div>
    </article>
  );
}
