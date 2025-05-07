'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon, StarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';

// Simplified Deal type
type Deal = {
  id: number;
  title: string;
  description: string;
  salePrice: number;
  image: string;
  location: string;
  category: 'popular' | 'lastMinute' | 'discount';
  type: 'tour' | 'activity';
};

// Updated deals data with type field
const allDeals: Deal[] = [
  // Turlar
  { id: 1, title: 'Kapadokya Balon Turu', description: 'Eşsiz peri bacaları manzarasında unutulmaz bir balon deneyimi yaşayın', salePrice: 2880, image: 'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e', location: 'Kapadokya', category: 'popular', type: 'tour' },
  { id: 2, title: 'İstanbul Boğaz Turu', description: 'Tekne ile İstanbul Boğazının güzelliklerini keşfedin', salePrice: 840, image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b', location: 'İstanbul', category: 'lastMinute', type: 'tour' },
  { id: 3, title: 'Pamukkale & Hierapolis Turu', description: 'Doğal travertenleri ve antik kenti keşfedin', salePrice: 1530, image: 'https://images.unsplash.com/photo-1571215682738-574b686ecb0b', location: 'Denizli', category: 'popular', type: 'tour' },
  { id: 4, title: 'Efes Antik Kenti Turu', description: 'Dünyanın en iyi korunmuş antik kentlerinden birini ziyaret edin', salePrice: 1125, image: 'https://images.unsplash.com/photo-1555869433-94f21d89a10d', location: 'İzmir', category: 'lastMinute', type: 'tour' },
  // Aktiviteler
  { id: 5, title: 'Fethiye Yamaç Paraşütü', description: 'Babadağdan Ölüdeniz manzarasına karşı yamaç paraşütü deneyimi', salePrice: 1200, image: 'https://images.unsplash.com/photo-1600255821058-c4f89958d700', location: 'Fethiye', category: 'popular', type: 'activity' },
  { id: 6, title: 'Köprülü Kanyon Rafting', description: 'Heyecan dolu rafting macerası', salePrice: 450, image: 'https://images.unsplash.com/photo-1530866495561-e3aa5c2461cd', location: 'Antalya', category: 'lastMinute', type: 'activity' },
  { id: 7, title: 'Kaş Dalış Deneyimi', description: 'Akdenizin berrak sularında batıkları keşfedin', salePrice: 800, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', location: 'Kaş', category: 'discount', type: 'activity' },
  { id: 8, title: 'Erciyes Kayak Turu', description: 'Her seviyeye uygun pistlerde kayak deneyimi', salePrice: 950, image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766', location: 'Kayseri', category: 'popular', type: 'activity' }
];

// Simplified price formatter
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(price);
};

type CategoryTab = 'popular' | 'lastMinute' | 'discount' | 'all';

// Kategori verilerini ayrı ayrı tanımlayalım
const tourCategories = [
  { id: 'all', title: 'Tüm Turlar' },
  { id: 'popular', title: 'En Popüler' },
  { id: 'lastMinute', title: 'Son Dakika' },
  { id: 'discount', title: 'İndirimli Turlar' }
];

const activityCategories = [
  { id: 'all', title: 'Tüm Aktiviteler' },
  { id: 'popular', title: 'En Popüler' },
  { id: 'lastMinute', title: 'Son Dakika' },
  { id: 'discount', title: 'İndirimli Aktiviteler' }
];

export default function HotDeals() {
  const [activeTourCategory, setActiveTourCategory] = useState<CategoryTab>('all');
  const [activeActivityCategory, setActiveActivityCategory] = useState<CategoryTab>('all');
  const [isVisible, setIsVisible] = useState(false);
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
      { threshold: 0.1 }
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

  const getFilteredDeals = (type: 'tour' | 'activity', category: CategoryTab) => {
    const typeFiltered = allDeals.filter(deal => deal.type === type);
    if (category === 'all') return typeFiltered;
    return typeFiltered.filter(deal => deal.category === category);
  };

  const filteredTours = getFilteredDeals('tour', activeTourCategory);
  const filteredActivities = getFilteredDeals('activity', activeActivityCategory);

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
              className="inline-flex items-center justify-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-4"
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
                onClick={() => setActiveTourCategory(category.id as CategoryTab)}
                className={`px-5 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  activeTourCategory === category.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                {category.title}
              </motion.button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredTours.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} isVisible={isVisible} />
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <Link 
              href="/tours"
              className="inline-flex items-center px-6 py-3 bg-sky-600 text-white hover:bg-sky-700 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sm"
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
              className="inline-flex items-center justify-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-4"
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
                onClick={() => setActiveActivityCategory(category.id as CategoryTab)}
                className={`px-5 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  activeActivityCategory === category.id
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
                }`}
              >
                {category.title}
              </motion.button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredActivities.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} isVisible={isVisible} />
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-12 text-center"
          >
            <Link 
              href="/activities"
              className="inline-flex items-center px-6 py-3 bg-sky-600 text-white hover:bg-sky-700 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-sm"
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
function DealCard({ deal, index, isVisible }: { deal: Deal; index: number; isVisible: boolean }) {
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
          src={deal.image} 
          alt={deal.title}
          fill
          priority={index < 4}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2">
          <div className="flex items-center">
            <MapPinIcon className="w-3.5 h-3.5 mr-1 text-neutral-400" />
            <span>{deal.location}</span>
          </div>
          <div className="flex items-center">
            <StarIcon className="w-3.5 h-3.5 mr-1 text-amber-400" />
            <span>4.8</span>
          </div>
        </div>
        
        <h3 className="text-base font-semibold text-neutral-800 mb-2 leading-snug group-hover:text-sky-700 transition-colors">
          {deal.title}
        </h3>
        
        <p className="text-xs text-neutral-600 mb-3 flex-grow line-clamp-2 leading-relaxed">
          {deal.description}
        </p>
        
        <div className="mb-3 mt-auto pt-3 border-t border-neutral-100">
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-neutral-900">
              {formatPrice(deal.salePrice)}
            </span>
            <span className="text-xs text-neutral-500">/ kişi</span>
          </div>
        </div>
        
        <Link 
          href={`/${deal.type === 'tour' ? 'tour' : 'activity'}/${deal.id}`}
          className="block w-full text-center px-3 py-2 bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-200 font-medium rounded-lg shadow-sm hover:shadow-md text-sm"
        >
          Detayları Gör
        </Link>
      </div>
    </motion.div>
  );
} 