'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Simplified Deal type
type Deal = {
  id: number;
  title: string;
  description: string;
  salePrice: number; // Only keeping sale price
  image: string;
  location: string;
  category: 'popular' | 'lastMinute' | 'discount';
};

// Updated deals data (removed unused fields like originalPrice, discount, label, expiry, rating, reviewCount, remainingSpots)
const allDeals: Deal[] = [
  { id: 1, title: 'Kapadokya Balon Turu', description: 'Eşsiz peri bacaları manzarasında unutulmaz bir balon deneyimi yaşayın', salePrice: 2880, image: 'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e', location: 'Kapadokya', category: 'popular' },
  { id: 2, title: 'İstanbul Boğaz Turu', description: 'Tekne ile İstanbul Boğazının güzelliklerini keşfedin', salePrice: 840, image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b', location: 'İstanbul', category: 'lastMinute' },
  { id: 3, title: 'Pamukkale & Hierapolis Turu', description: 'Doğal travertenleri ve antik kenti keşfedin', salePrice: 1530, image: 'https://images.unsplash.com/photo-1571215682738-574b686ecb0b', location: 'Denizli', category: 'popular' },
  { id: 4, title: 'Efes Antik Kenti Turu', description: 'Dünyanın en iyi korunmuş antik kentlerinden birini ziyaret edin', salePrice: 1125, image: 'https://images.unsplash.com/photo-1555869433-94f21d89a10d', location: 'İzmir', category: 'lastMinute' },
  { id: 5, title: 'Safranbolu Evleri Turu', description: 'UNESCO Dünya Mirası Listesinde yer alan tarihi evlerde bir gün geçirin', salePrice: 720, image: 'https://images.unsplash.com/photo-1600687621645-113ced83a0d5', location: 'Karabük', category: 'lastMinute' },
  { id: 6, title: 'Fethiye & Ölüdeniz Tekne Turu', description: 'Berrak sularda yüzün ve muhteşem koyları keşfedin', salePrice: 1540, image: 'https://images.unsplash.com/photo-1519356162333-4d49ceade668', location: 'Muğla', category: 'discount' },
  { id: 7, title: 'Göreme Açık Hava Müzesi', description: "Kapadokya'nın binlerce yıllık tarihi kiliselerini keşfedin", salePrice: 560, image: 'https://images.unsplash.com/photo-1563290173-a81f98c6183a', location: 'Nevşehir', category: 'discount' },
  { id: 8, title: 'Antalya Körfezi Yat Turu', description: "Lüks bir yatla Akdeniz'in turkuaz sularında gezinin", salePrice: 2100, image: 'https://images.unsplash.com/photo-1544998340-82295f75cfec', location: 'Antalya', category: 'discount' }
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

// Simplified category data (removed icons, description, color)
const categoryData = [
  { id: 'all', title: 'Tüm Turlar' },
  { id: 'popular', title: 'En Popüler' },
  { id: 'lastMinute', title: 'Son Dakika' },
  { id: 'discount', title: 'İndirimli Turlar' }
];

export default function HotDeals() {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all');
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

  // Filtered deals logic remains similar
  const getFilteredDeals = () => {
    if (activeCategory === 'all') return allDeals;
    return allDeals.filter(deal => deal.category === activeCategory);
  };
  const filteredDeals = getFilteredDeals();

  // Simplified category change handler (no animation state)
  const handleCategoryChange = (category: CategoryTab) => {
    setActiveCategory(category);
  };

  return (
    <section 
      ref={sectionRef}
      className={`py-24 bg-white transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center mb-16">
           {/* Optional: Simple blue tag */}
           <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-6">
             Öne Çıkanlar
           </div>
           {/* Simplified Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
            Öne Çıkan Turlarımız
          </h2>
          {/* Simplified Description */}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            En popüler, son dakika ve indirimli turlarımızı keşfedin.
          </p>
        </div>
        
        {/* Simplified Category Tabs */}
        <div className="flex justify-center border-b border-gray-200 mb-12">
          {categoryData.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id as CategoryTab)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${ 
                activeCategory === category.id
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
        
        {/* Modernized Deal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDeals.map((deal) => (
            <div 
              key={deal.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl flex flex-col transform transition duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative h-56 w-full overflow-hidden rounded-t-lg flex-shrink-0">
                <Image 
                  src={deal.image} 
                  alt={deal.title}
                  fill
                  priority={deal.id <= 4} 
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                 <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{deal.location}</p>
                 <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                  {deal.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
                  {deal.description}
                </p>
                
                <div className="mb-5 mt-auto pt-5 border-t border-gray-100">
                   <span className="text-xl font-bold text-black">
                     {formatPrice(deal.salePrice)}
                   </span>
                   <span className="text-xs text-gray-500 ml-1">/ kişi</span>
                </div>
                
                <Link 
                  href={`/tour/${deal.id}`}
                  className="block w-full text-center px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-medium rounded-md shadow-sm text-sm"
                >
                  Detayları Gör
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <Link 
            href="/tours"
            className="inline-block px-8 py-4 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors font-medium rounded-md shadow-sm text-base"
          >
            Tüm Turları Görüntüle
          </Link>
        </div>
      </div>
    </section>
  );
} 