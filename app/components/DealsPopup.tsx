"use client";

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon, CalendarIcon, FireIcon, TagIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import FocusTrap from 'focus-trap-react';

// Deal types
interface Deal {
  id: string;
  title: string;
  discount: string;
  expiry: string;
  color: string;
  image: string;
  link: string;
  badge?: string;
  description?: string;
  category?: string[];
}

interface DealsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DealsPopup({ isOpen, onClose }: DealsPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Focus handling when popup opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Click outside control
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling when popup is open
      document.body.style.overflow = 'hidden';
      // Add padding to body if page is scrollable to prevent layout shift
      if (window.innerWidth > document.documentElement.clientWidth) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore body scrolling when popup is closed
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
  }, [isOpen]);
  
  // Close with ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  // Smooth closing animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setShowAll(false);
    }, 300);
  };

  // Handle card click - navigation with preload
  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    router.prefetch(link);
    setTimeout(() => {
      handleClose();
      setTimeout(() => {
        router.push(link);
      }, 300);
    }, 100);
  };

  // Örnek fırsat verileri
  const deals: Deal[] = [
    {
      id: "1",
      title: "Erken Rezervasyon İndirimi",
      discount: "%25",
      expiry: "Son 3 gün",
      color: "from-blue-600 to-indigo-700",
      image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/early-booking",
      badge: "Popüler",
      description: "Yaz tatilini şimdiden planla, %25 indirim kazan!",
      category: ["popular", "discount"]
    },
    {
      id: "2",
      title: "Aile Paketi",
      discount: "1 Çocuk Ücretsiz",
      expiry: "Sınırlı sayıda",
      color: "from-emerald-600 to-teal-700",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/family-package",
      description: "Ailecek tatil yapın, çocuğunuzun konaklaması bizden!",
      category: ["seasonal"]
    },
    {
      id: "3",
      title: "Son Dakika Fırsatı",
      discount: "%30",
      expiry: "Bugüne özel",
      color: "from-rose-600 to-red-700",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/last-minute",
      description: "Hemen kararını ver, ekstra %30 indirim yakala!",
      category: ["limited", "discount"]
    },
    {
      id: "4",
      title: "Hafta Sonu Kaçamağı",
      discount: "%15",
      expiry: "Her hafta sonu",
      color: "from-sky-600 to-blue-700",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2083&auto=format&fit=crop",
      link: "/campaigns/weekend-getaway",
      badge: "Yeni",
      description: "Hafta sonları şehir stresinden uzaklaşın, %15 indirimle dinlenin.",
      category: ["seasonal"]
    },
    {
      id: "5",
      title: "Bahar Kampanyası",
      discount: "%20",
      expiry: "Mayıs sonuna kadar",
      color: "from-purple-600 to-indigo-800",
      image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2031&auto=format&fit=crop",
      link: "/campaigns/spring-deal",
      description: "Baharın tadını çıkarın, erken yaz fırsatlarını yakalayın.",
      category: ["seasonal"]
    },
    {
      id: "6",
      title: "Balayı Paketi",
      discount: "Özel İndirim",
      expiry: "Yıl boyunca",
      color: "from-pink-600 to-rose-700",
      image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/honeymoon",
      description: "Hayatınızın en özel tatilini unutulmaz kılın, ücretsiz ekstralar!",
      category: ["popular"]
    },
    {
      id: "7",
      title: "Tekne Turu Fırsatı",
      discount: "2 Kişi 1 Kişi Öder",
      expiry: "Yaz sezonu",
      color: "from-cyan-600 to-blue-700",
      image: "https://images.unsplash.com/photo-1586902197503-e71026292412?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/boat-tour",
      description: "Eşsiz mavilikte tekne turu, iki kişi fiyatına bir kişi",
      category: ["seasonal", "discount"]
    },
    {
      id: "8",
      title: "Uzun Konaklama İndirimi",
      discount: "%35",
      expiry: "Her zaman",
      color: "from-amber-600 to-orange-700",
      image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/long-stay",
      badge: "Sınırlı",
      description: "7 gece ve üzeri konaklamalarda %35'e varan indirim!",
      category: ["limited", "discount"]
    },
    {
      id: "9",
      title: "Kültür Turu Kampanyası",
      discount: "%15 + Müze Kartı",
      expiry: "Kış sezonu",
      color: "from-indigo-600 to-violet-800",
      image: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?q=80&w=2076&auto=format&fit=crop",
      link: "/campaigns/culture-tour",
      description: "Şehrin kültürel zenginliklerini keşfedin, müze kartı hediye",
      category: ["seasonal", "popular"]
    }
  ];

  const categories = [
    { id: "all", name: "Tümü", icon: SparklesIcon },
    { id: "popular", name: "Popüler", icon: FireIcon },
    { id: "seasonal", name: "Mevsimsel", icon: CalendarIcon },
    { id: "discount", name: "İndirimli", icon: TagIcon },
    { id: "limited", name: "Sınırlı", icon: ClockIcon },
  ];

  const filteredDeals = activeCategory === "all" 
    ? deals 
    : deals.filter((deal) => deal.category?.includes(activeCategory));
  
  const displayedDeals = showAll ? filteredDeals : filteredDeals.slice(0, 6);
  const hasMoreDeals = filteredDeals.length > 6;
  
  if (!isOpen || !mounted) return null;

  const popupContent = (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overflow-x-hidden"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Sadece arka planın kendisine tıklandığında popup'ı kapat
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Arkaplan Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`} 
        aria-hidden="true"
      />
      
      <div 
        ref={popupRef}
        className={`relative bg-white rounded-xl shadow-2xl mx-auto max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col transform ${
          isClosing ? 'animate-slideOutDown' : 'animate-slideInUp'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-6 px-6 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl sm:text-2xl font-bold flex items-center" id="modal-title">
                <TagIcon className="w-6 h-6 mr-2" />
                Özel Fırsatlar
              </h2>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">
                Sizin için seçilmiş en avantajlı kampanyalar
              </p>
            </div>
            
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Kapat"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Category Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-white text-indigo-800'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
                {activeCategory === category.id && activeCategory !== 'all' && (
                  <span className="ml-1 rounded-full bg-indigo-100 text-indigo-800 text-xs px-1.5 py-0.5">
                    {filteredDeals.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-y-auto p-6 sm:p-8 flex-grow">
          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedDeals.map((deal) => (
              <Link
                href={deal.link}
                key={deal.id}
                className={`group relative rounded-xl overflow-hidden flex flex-col shadow-md hover:shadow-xl transform transition-all duration-300 ${
                  hoveredCard === deal.id ? 'scale-[1.02]' : 'scale-100'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                onClick={(e) => handleCardClick(e, deal.link)}
                onMouseEnter={() => setHoveredCard(deal.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative h-44">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Overlay Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${deal.color} opacity-75`}></div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-0 left-0 m-4">
                    <div className="bg-white text-gray-900 text-lg font-bold px-3 py-1 rounded-md shadow-lg">
                      {deal.discount}
                    </div>
                  </div>
                  
                  {/* Badge (if any) */}
                  {deal.badge && (
                    <div className="absolute top-0 right-0 m-4">
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center">
                        <FireIcon className="w-3 h-3 mr-1" />
                        {deal.badge}
                      </div>
                    </div>
                  )}
                  
                  {/* Title & Expiry */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg">{deal.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-white/90">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {deal.expiry}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 flex-grow flex flex-col justify-between">
                  <p className="text-gray-700 mb-4">{deal.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-xs text-gray-500">
                      {deal.category?.map((cat) => {
                        const foundCat = categories.find(c => c.id === cat);
                        return foundCat ? (
                          <span key={cat} className="flex items-center mr-2">
                            <foundCat.icon className="w-3 h-3 mr-1" />
                            {foundCat.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                    
                    <div className="inline-flex items-center text-indigo-700 font-medium text-sm group-hover:text-indigo-800">
                      <span>Fırsatı Gör</span>
                      <ChevronRightIcon className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Show More Button */}
          {hasMoreDeals && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center justify-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium px-6 py-3 rounded-lg transition-colors"
              >
                {showAll ? (
                  <>
                    <span>Daha Az Göster</span>
                  </>
                ) : (
                  <>
                    <span>Tümünü Göster</span>
                    <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full px-1.5 py-0.5">
                      +{filteredDeals.length - 6}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h4 className="font-bold text-gray-900 flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-indigo-700 mr-2" />
                Size Özel Avantajlar
              </h4>
              <p className="text-gray-600 text-sm mt-1">
                TurlaDur üyeleri tüm fırsatlardan öncelikli olarak yararlanır
              </p>
            </div>
            
            <Link
              href="/campaigns"
              className="inline-flex items-center justify-center bg-indigo-700 hover:bg-indigo-800 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              onClick={(e) => handleCardClick(e, '/campaigns')}
            >
              <span>Tüm Kampanyaları Gör</span>
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(<FocusTrap focusTrapOptions={{ initialFocus: false }}>{popupContent}</FocusTrap>, document.body);
} 