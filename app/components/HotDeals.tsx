'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon, StarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import MembershipBadge, {
  type MembershipTier,
} from './partner-dashboard/MembershipBadge';
import { IMAGE_PLACEHOLDER } from '@/lib/constants/images';

// Gerçek turları/aktiviteleri döndüren /api/home/deals'ten gelen kart tipi.
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
  partnerTier: MembershipTier;
  operatorRating: number;
  discount?: number;
};

const PLACEHOLDER_IMAGE = IMAGE_PLACEHOLDER;

// Simplified price formatter
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(price);
};

type CategoryTab = 'popular' | 'lastMinute' | 'discount' | 'all';

// Kategori verilerini ayrı ayrı tanımlayalım
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

export default function HotDeals() {
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

  // Intersection observer remains the same
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
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Gerçek turları, seçilen kategoriye ve partner üyelik seviyesine
  // (GOLD > SILVER > BRONZE) göre sıralanmış şekilde getirir.
  useEffect(() => {
    setLoadingTours(true);
    fetch(`/api/home/deals?type=tour&category=${activeTourCategory}`)
      .then((res) => (res.ok ? res.json() : { deals: [] }))
      .then((data) => setTours(data.deals || []))
      .catch(() => setTours([]))
      .finally(() => setLoadingTours(false));
  }, [activeTourCategory]);

  useEffect(() => {
    setLoadingActivities(true);
    fetch(`/api/home/deals?type=activity&category=${activeActivityCategory}`)
      .then((res) => (res.ok ? res.json() : { deals: [] }))
      .then((data) => setActivities(data.deals || []))
      .catch(() => setActivities([]))
      .finally(() => setLoadingActivities(false));
  }, [activeActivityCategory]);

  const filteredTours = tours;
  const filteredActivities = activities;

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 bg-gradient-to-b from-neutral-50 via-white to-neutral-50"
    >
      <div className="container px-4 mx-auto max-w-7xl">
        {/* Turlar Bölümü */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center justify-center px-3 py-1 bg-neutral-100 rounded-full text-neutral-800 font-medium text-xs mb-4"
            >
              Öne Çıkan Turlar
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4"
            >
              Sizin İçin Seçtiğimiz Turlar
            </motion.h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tourCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setActiveTourCategory(category.id as CategoryTab)
                }
                className={`px-5 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  activeTourCategory === category.id
                    ? 'bg-neutral-950 text-white shadow-md shadow-neutral-200'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                {category.title}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loadingTours ? (
              Array.from({ length: 4 }).map((_, i) => (
                <DealCardSkeleton key={i} />
              ))
            ) : filteredTours.length > 0 ? (
              filteredTours.map((deal, index) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  index={index}
                  isVisible={isVisible}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-neutral-500 py-8 text-sm">
                Bu kategoride şu anda tur bulunmuyor.
              </p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/tours"
              className="inline-flex items-center px-6 py-3 bg-neutral-950 text-white hover:bg-neutral-800 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 text-sm"
            >
              Tüm Turları Görüntüle
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Aktiviteler Bölümü */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="inline-flex items-center justify-center px-3 py-1 bg-neutral-100 rounded-full text-neutral-800 font-medium text-xs mb-4"
            >
              Öne Çıkan Aktiviteler
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4"
            >
              Macera Dolu Aktiviteler
            </motion.h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {activityCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setActiveActivityCategory(category.id as CategoryTab)
                }
                className={`px-5 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  activeActivityCategory === category.id
                    ? 'bg-neutral-950 text-white shadow-md shadow-neutral-200'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                {category.title}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loadingActivities ? (
              Array.from({ length: 4 }).map((_, i) => (
                <DealCardSkeleton key={i} />
              ))
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map((deal, index) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  index={index}
                  isVisible={isVisible}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-neutral-500 py-8 text-sm">
                Bu kategoride şu anda aktivite bulunmuyor.
              </p>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/activities"
              className="inline-flex items-center px-6 py-3 bg-neutral-950 text-white hover:bg-neutral-800 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 text-sm"
            >
              Tüm Aktiviteleri Görüntüle
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// DealCard bileşeni
function DealCard({
  deal,
  index,
  isVisible,
}: {
  deal: Deal;
  index: number;
  isVisible: boolean;
}) {
  const [imageSrc, setImageSrc] = useState(deal.image || PLACEHOLDER_IMAGE);

  useEffect(() => {
    setImageSrc(deal.image || PLACEHOLDER_IMAGE);
  }, [deal.image]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg border border-neutral-200/80 shadow-sm hover:shadow-md flex flex-col transition-all duration-300 ease-out group overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={deal.title}
          fill
          priority={index < 4}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized={imageSrc.endsWith('.svg')}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          onError={() => {
            if (imageSrc !== PLACEHOLDER_IMAGE) setImageSrc(PLACEHOLDER_IMAGE);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Partnerin müşteri değerlendirmelerinden otomatik hesaplanan üyelik arması */}
        {deal.partnerTier && (
          <div className="absolute top-2 left-2">
            <MembershipBadge tier={deal.partnerTier} variant="onImage" />
          </div>
        )}
        {deal.discount && deal.discount > 0 ? (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
            %{deal.discount} İndirim
          </div>
        ) : null}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
          <div className="flex items-center">
            <MapPinIcon className="w-3.5 h-3.5 mr-1 text-neutral-400" />
            <span>{deal.location || 'Türkiye'}</span>
          </div>
          <div className="flex items-center">
            <StarIcon className="w-3.5 h-3.5 mr-1 text-amber-400" />
            <span>
              {deal.operatorRating > 0
                ? deal.operatorRating.toFixed(1)
                : 'Yeni'}
            </span>
          </div>
        </div>

        <h3 className="text-base font-semibold text-neutral-800 mb-2 leading-snug group-hover:text-neutral-800 transition-colors">
          {deal.title}
        </h3>

        <p className="text-xs text-neutral-600 mb-3 flex-grow line-clamp-2 leading-relaxed">
          {deal.description}
        </p>

        <div className="mb-3 mt-auto pt-3 border-t border-neutral-100">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-neutral-900">
                {formatPrice(deal.salePrice)}
              </span>
              {deal.originalPrice && deal.originalPrice > deal.salePrice && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(deal.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-xs text-neutral-500">/ kişi</span>
          </div>
        </div>

        <Link
          href={`/${deal.type === 'tour' ? 'tour' : 'activities'}/${deal.id}`}
          className="block w-full text-center px-3 py-2 bg-neutral-950 text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md text-sm"
        >
          Detayları Gör
        </Link>
      </div>
    </motion.div>
  );
}

function DealCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200/80 shadow-sm flex flex-col overflow-hidden animate-pulse">
      <div className="aspect-[4/3] w-full bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-24 bg-neutral-200 rounded" />
        <div className="h-4 w-3/4 bg-neutral-200 rounded" />
        <div className="h-3 w-full bg-neutral-100 rounded" />
        <div className="h-8 w-full bg-neutral-100 rounded-lg mt-2" />
      </div>
    </div>
  );
}
