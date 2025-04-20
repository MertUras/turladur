'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';

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
      className={`py-24 md:py-32 bg-neutral-50 transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
    >
      <div className="container px-6 mx-auto max-w-7xl">
        <div className="text-center mb-16">
           {/* Etiket stili güncellendi */}
           <div className="inline-flex items-center justify-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-6">
             Öne Çıkanlar
           </div>
           {/* Ana başlık stili güncellendi */}
           <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Sizin İçin Seçtiklerimiz
          </h2>
           {/* Açıklama stili güncellendi */}
           <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            En popüler, son dakika ve indirimli turlarımıza göz atın.
          </p>
        </div>
        
        {/* Kategori Sekmeleri - Stil güncellendi */}
        <div className="flex justify-center border-b border-neutral-200 mb-12">
          {categoryData.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id as CategoryTab)}
               // Sekme butonu stili güncellendi (aktif/pasif)
               className={`px-4 sm:px-5 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${ 
                activeCategory === category.id
                  ? 'border-sky-600 text-sky-700 font-semibold' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:border-neutral-300'
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
        
        {/* Fırsat Kartları - Stil güncellendi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredDeals.map((deal, index) => (
            <div 
              key={deal.id}
               // Kart ana yapısı ve hover efekti güncellendi
               className={`bg-white rounded-xl border border-neutral-200/80 shadow-sm hover:shadow-lg flex flex-col transition-all duration-300 ease-out group overflow-hidden ${isVisible ? `animate-fadeInUp delay-${index * 100}` : 'opacity-0 translate-y-3'}`}
            >
               {/* Kart Görseli */}
               <div className="relative aspect-[4/3] w-full overflow-hidden flex-shrink-0">
                <Image 
                  src={deal.image} 
                  alt={deal.title}
                  fill
                  priority={index < 4} // İlk 4 görseli öncelikli yükle
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                   // Hover efekti eklendi
                   className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                 {/* Görsel üzerine overlay (isteğe bağlı) */}
                 {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div> */} 
               </div>
              
               {/* Kart İçeriği */}
               <div className="p-5 flex flex-col flex-grow">
                  {/* Konum */}
                  <div className="flex items-center text-xs text-neutral-500 mb-1.5">
                   <MapPinIcon className="w-3.5 h-3.5 mr-1 text-neutral-400 flex-shrink-0" />
                   <span>{deal.location}</span>
                 </div>
                  {/* Başlık */}
                  <h3 className="text-base font-semibold text-neutral-800 mb-2 leading-snug group-hover:text-sky-700 transition-colors">
                   {/* Başlığın tamamını göstermek için truncate kaldırıldı */} 
                   {deal.title}
                 </h3>
                  {/* Açıklama */}
                  <p className="text-xs text-neutral-600 mb-4 flex-grow line-clamp-2 leading-relaxed">
                   {deal.description}
                 </p>
                
                 {/* Fiyat */}
                 <div className="mb-4 mt-auto pt-4 border-t border-neutral-100">
                    <span className="text-xl font-bold text-neutral-900">
                      {formatPrice(deal.salePrice)}
                    </span>
                    <span className="text-xs text-neutral-500 ml-1">/ kişi</span>
                 </div>
                
                 {/* Buton */}
                 <Link 
                  href={`/tour/${deal.id}`}
                   // Buton stili güncellendi
                   className="block w-full text-center px-4 py-2 bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors font-medium rounded-lg shadow-sm text-sm"
                 >
                  Detayları Gör
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tümünü Gör Butonu - Stil güncellendi */}
        <div className="mt-16 md:mt-20 text-center">
          <Link 
            href="/tours"
             className="inline-block px-7 py-3 bg-white text-sky-700 border border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors font-medium rounded-lg shadow-sm text-sm"
          >
            Tüm Turları Görüntüle
          </Link>
        </div>
      </div>
    </section>
  );
} 