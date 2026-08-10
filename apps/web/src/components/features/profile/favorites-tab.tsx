'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, Heart, MapPin, Star } from 'lucide-react';

import { useFavorites } from '@/hooks/use-favorites';
import { resolveMediaUrl, shouldUnoptimizeMedia } from '@/lib/media';
import type { Favorite } from '@/services/favorite';
import { cn } from '@/lib/utils';

type FavoritesSubTab = 'tours' | 'activities';

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatTry(value: string | number | null | undefined): string {
  return toNumber(value).toLocaleString('tr-TR');
}

function renderStars(rating: number) {
  const fullStars = Math.floor(rating);
  const emptyStars = Math.max(0, 5 - fullStars);
  return (
    <>
      {Array.from({ length: fullStars }, (_, i) => (
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star
          key={`empty-${i}`}
          className="h-4 w-4 fill-neutral-300 text-neutral-300"
        />
      ))}
    </>
  );
}

type CardModel = {
  favoriteId: string;
  href: string;
  title: string;
  image: string | null;
  location: string;
  rating: number;
  reviewCount: number;
  price: string | number;
  suffix: string;
};

function toTourCard(row: Favorite): CardModel | null {
  if (!row.tour) return null;
  return {
    favoriteId: row.id,
    href: `/tours/${row.tour.id}`,
    title: row.tour.title,
    image: row.tour.coverUrl,
    location:
      row.tour.durationDays > 0 ? `${row.tour.durationDays} gün` : 'Tur',
    rating: toNumber(row.tour.averageRating),
    reviewCount: row.tour.reviewCount,
    price: row.tour.price,
    suffix: '/ kişi',
  };
}

function toActivityCard(row: Favorite): CardModel | null {
  if (!row.experience) return null;
  return {
    favoriteId: row.id,
    href: `/activities/${row.experience.id}`,
    title: row.experience.title,
    image: row.experience.imageUrl,
    location: row.experience.location || row.experience.duration || 'Aktivite',
    rating: toNumber(row.experience.averageRating),
    reviewCount: row.experience.reviewCount,
    price: row.experience.price,
    suffix: '/ kişi',
  };
}

export function FavoritesTab() {
  const [subTab, setSubTab] = useState<FavoritesSubTab>('tours');
  const {
    favorites,
    isLoading,
    toggleTourFavorite,
    toggleExperienceFavorite,
    isMutating,
  } = useFavorites();

  const tourCards = useMemo(
    () =>
      favorites
        .filter((row) => row.tourId)
        .map(toTourCard)
        .filter((card): card is CardModel => card != null),
    [favorites],
  );

  const activityCards = useMemo(
    () =>
      favorites
        .filter((row) => row.experienceId)
        .map(toActivityCard)
        .filter((card): card is CardModel => card != null),
    [favorites],
  );

  const cards = subTab === 'tours' ? tourCards : activityCards;
  const emptyLabel = subTab === 'tours' ? 'tur' : 'aktivite';
  const exploreHref = subTab === 'tours' ? '/tours' : '/activities';
  const exploreLabel = subTab === 'tours' ? 'Turları' : 'Aktiviteleri';

  async function handleRemove(card: CardModel) {
    if (isMutating) return;
    if (subTab === 'tours') {
      const row = favorites.find((f) => f.id === card.favoriteId);
      if (row?.tourId) await toggleTourFavorite(row.tourId, '/profile');
      return;
    }
    const row = favorites.find((f) => f.id === card.favoriteId);
    if (row?.experienceId) {
      await toggleExperienceFavorite(row.experienceId, '/profile');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-neutral-900">Favorilerim</h2>
      </div>

      <div className="flex space-x-1 border-b border-neutral-200">
        {(
          [
            { key: 'tours', label: 'Turlar' },
            { key: 'activities', label: 'Aktiviteler' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSubTab(tab.key)}
            className={cn(
              'border-b-2 px-4 py-2 text-sm font-medium transition-colors duration-150',
              subTab === tab.key
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-neutral-500">
          Favoriler yükleniyor…
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-neutral-200/80 bg-neutral-100 py-16 text-center">
              <Heart className="mb-4 h-10 w-10 text-neutral-400" />
              <h3 className="text-lg font-medium text-neutral-600">
                Henüz favori {emptyLabel} eklemediniz
              </h3>
              <p className="mb-6 mt-1 text-sm text-neutral-500">
                Beğendiğiniz {emptyLabel === 'tur' ? 'turları' : 'aktiviteleri'}{' '}
                favorilerinize ekleyebilirsiniz.
              </p>
              <Link
                href={exploreHref}
                className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-sky-700"
              >
                {exploreLabel} Keşfet
              </Link>
            </div>
          ) : (
            cards.map((item) => {
              const src = resolveMediaUrl(item.image);
              return (
                <div
                  key={item.favoriteId}
                  className="overflow-hidden rounded-xl border border-neutral-200/50 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="group relative h-44">
                    {src ? (
                      <Image
                        src={src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized={shouldUnoptimizeMedia(src)}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-neutral-200 text-sm text-neutral-500">
                        Görsel yok
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => void handleRemove(item)}
                      disabled={isMutating}
                      className="absolute right-2 top-2 rounded-full bg-black/30 p-1.5 text-white opacity-80 transition-all duration-200 hover:bg-black/50 hover:text-red-500 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-black/30 disabled:opacity-50"
                      title="Favorilerden Kaldır"
                      aria-label="Favorilerden kaldır"
                    >
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="mb-1 line-clamp-1 text-base font-semibold text-neutral-900">
                      {item.title}
                    </h3>

                    <div className="mb-1.5 flex items-center text-xs text-neutral-500">
                      <MapPin className="mr-1 h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <div className="mb-2.5 flex items-center text-xs">
                      <div className="mr-1.5 flex items-center">
                        {renderStars(item.rating)}
                      </div>
                      <span className="text-neutral-500">
                        ({item.reviewCount})
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                      <div className="text-base font-semibold text-neutral-900">
                        {formatTry(item.price)} ₺
                        <span className="ml-1 text-xs font-normal text-neutral-500">
                          {item.suffix}
                        </span>
                      </div>

                      <Link
                        href={item.href}
                        className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium text-sky-600 transition-colors hover:bg-sky-50 hover:text-sky-800"
                      >
                        Detaylar
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
