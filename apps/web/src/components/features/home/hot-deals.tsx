'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, ArrowRight } from 'lucide-react';

import MembershipBadge from '@/components/features/tour/membership-badge';
import { IMAGE_PLACEHOLDER } from '@/lib/image-placeholder';
import type { MembershipTier } from '@/lib/tours/legacy-tour';
import { searchToursClient } from '@/services/catalog';
import { searchExperiences } from '@/services/activity';

type Deal = {
  id: string;
  title: string;
  description: string;
  salePrice: number;
  originalPrice: number | null;
  image: string | null;
  location: string;
  type: 'tour' | 'activity';
  partnerName: string | null;
  partnerTier: MembershipTier | null;
  operatorRating: number;
  discount?: number;
};

const PLACEHOLDER_IMAGE = IMAGE_PLACEHOLDER;

function formatPrice(price: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(price);
}

type CategoryTab = 'popular' | 'lastMinute' | 'discount' | 'all';

const tourCategories = [
  { id: 'all', title: 'Tüm Turlar' },
  { id: 'popular', title: 'En Popüler' },
  { id: 'lastMinute', title: 'Son Dakika' },
  { id: 'discount', title: 'İndirimli Turlar' },
];

const activityCategories = [
  { id: 'all', title: 'Tüm Aktiviteler' },
  { id: 'popular', title: 'En Popüler' },
  { id: 'lastMinute', title: 'Son Dakika' },
  { id: 'discount', title: 'İndirimli Aktiviteler' },
];

async function loadDeals(kind: 'tour' | 'activity'): Promise<Deal[]> {
  try {
    const rows =
      kind === 'tour'
        ? (
            await searchToursClient({
              limit: 8,
              featured: true,
            })
          ).data
        : (await searchExperiences({ limit: 8 })).data;

    const list = Array.isArray(rows) ? rows : [];
    return list.map((row) => {
      const record = row as unknown as Record<string, unknown>;
      const price = Number(record.price ?? record.salePrice ?? 0);
      const tierRaw = String(
        (record.partner as { membershipTier?: string } | undefined)
          ?.membershipTier ??
          record.membershipTier ??
          '',
      ).toUpperCase();
      const partnerTier =
        tierRaw === 'GOLD' || tierRaw === 'SILVER' || tierRaw === 'BRONZE'
          ? (tierRaw as MembershipTier)
          : null;
      return {
        id: String(record.id),
        title: String(record.title ?? ''),
        description: String(record.description ?? ''),
        salePrice: price,
        originalPrice: null,
        image: (record.coverUrl as string | null) ?? null,
        location: String(record.location ?? record.city ?? 'Türkiye'),
        type: kind,
        partnerName: null,
        partnerTier,
        operatorRating: Number(record.averageRating ?? 0),
      };
    });
  } catch {
    return [];
  }
}

export function HotDeals() {
  const [activeTourCategory, setActiveTourCategory] =
    useState<CategoryTab>('all');
  const [activeActivityCategory, setActiveActivityCategory] =
    useState<CategoryTab>('all');
  const [isVisible, setIsVisible] = useState(false);
  const [tours, setTours] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Deal[]>([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.1 },
    );
    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  useEffect(() => {
    setLoadingTours(true);
    void loadDeals('tour')
      .then(setTours)
      .finally(() => setLoadingTours(false));
  }, [activeTourCategory]);

  useEffect(() => {
    setLoadingActivities(true);
    void loadDeals('activity')
      .then(setActivities)
      .finally(() => setLoadingActivities(false));
  }, [activeActivityCategory]);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-neutral-50 via-white to-neutral-50 py-20 md:py-28"
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-24">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800">
              Öne Çıkan Turlar
            </div>
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
              Sizin İçin Seçtiğimiz Turlar
            </h2>
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {tourCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setActiveTourCategory(category.id as CategoryTab)
                }
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTourCategory === category.id
                    ? 'bg-neutral-950 text-white shadow-md shadow-neutral-200'
                    : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {loadingTours ? (
              Array.from({ length: 4 }).map((_, i) => (
                <DealCardSkeleton key={i} />
              ))
            ) : tours.length > 0 ? (
              tours.map((deal, index) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  index={index}
                  isVisible={isVisible}
                />
              ))
            ) : (
              <p className="col-span-full py-8 text-center text-sm text-neutral-500">
                Bu kategoride şu anda tur bulunmuyor.
              </p>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/tours"
              className="inline-flex items-center rounded-lg bg-neutral-950 px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-neutral-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
            >
              Tüm Turları Görüntüle
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div>
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800">
              Öne Çıkan Aktiviteler
            </div>
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
              Macera Dolu Aktiviteler
            </h2>
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {activityCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() =>
                  setActiveActivityCategory(category.id as CategoryTab)
                }
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeActivityCategory === category.id
                    ? 'bg-neutral-950 text-white shadow-md shadow-neutral-200'
                    : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {loadingActivities ? (
              Array.from({ length: 4 }).map((_, i) => (
                <DealCardSkeleton key={i} />
              ))
            ) : activities.length > 0 ? (
              activities.map((deal, index) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  index={index}
                  isVisible={isVisible}
                />
              ))
            ) : (
              <p className="col-span-full py-8 text-center text-sm text-neutral-500">
                Bu kategoride şu anda aktivite bulunmuyor.
              </p>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/activities"
              className="inline-flex items-center rounded-lg bg-neutral-950 px-6 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-neutral-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
            >
              Tüm Aktiviteleri Görüntüle
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function DealCard({
  deal,
  index,
}: {
  deal: Deal;
  index: number;
  isVisible: boolean;
}) {
  const [imageSrc, setImageSrc] = useState(deal.image || PLACEHOLDER_IMAGE);

  useEffect(() => {
    setImageSrc(deal.image || PLACEHOLDER_IMAGE);
  }, [deal.image]);

  const href =
    deal.type === 'tour' ? `/tours/${deal.id}` : `/activities/${deal.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 ease-out hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={deal.title}
          fill
          priority={index < 4}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized={imageSrc.startsWith('data:')}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => {
            if (imageSrc !== PLACEHOLDER_IMAGE) setImageSrc(PLACEHOLDER_IMAGE);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {deal.partnerTier ? (
          <div className="absolute left-2 top-2">
            <MembershipBadge tier={deal.partnerTier} variant="onImage" />
          </div>
        ) : null}
        {deal.discount && deal.discount > 0 ? (
          <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
            %{deal.discount} İndirim
          </div>
        ) : null}
      </div>

      <div className="flex flex-grow flex-col p-4">
        <div className="mb-2 flex items-center gap-3 text-xs text-neutral-500">
          <div className="flex items-center">
            <MapPin className="mr-1 h-3.5 w-3.5 text-neutral-400" />
            <span>{deal.location || 'Türkiye'}</span>
          </div>
          <div className="flex items-center">
            <Star className="mr-1 h-3.5 w-3.5 text-amber-400" />
            <span>
              {deal.operatorRating > 0
                ? deal.operatorRating.toFixed(1)
                : 'Yeni'}
            </span>
          </div>
        </div>

        <h3 className="mb-2 text-base font-semibold leading-snug text-neutral-800 transition-colors group-hover:text-neutral-800">
          {deal.title}
        </h3>

        <p className="mb-3 line-clamp-2 flex-grow text-xs leading-relaxed text-neutral-600">
          {deal.description}
        </p>

        <div className="mb-3 mt-auto border-t border-neutral-100 pt-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-neutral-900">
                {formatPrice(deal.salePrice)}
              </span>
              {deal.originalPrice && deal.originalPrice > deal.salePrice ? (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(deal.originalPrice)}
                </span>
              ) : null}
            </div>
            <span className="text-xs text-neutral-500">/ kişi</span>
          </div>
        </div>

        <Link
          href={href}
          className="block w-full rounded-lg bg-neutral-950 px-3 py-2 text-center text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
        >
          Detayları Gör
        </Link>
      </div>
    </motion.div>
  );
}

function DealCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-lg border border-neutral-200/80 bg-white shadow-sm">
      <div className="aspect-[4/3] w-full bg-neutral-200" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-24 rounded bg-neutral-200" />
        <div className="h-4 w-3/4 rounded bg-neutral-200" />
        <div className="h-3 w-full rounded bg-neutral-100" />
      </div>
    </div>
  );
}

export default HotDeals;
