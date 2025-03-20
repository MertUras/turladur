"use client";

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon, ArrowLongRightIcon, CalendarIcon, FireIcon, TagIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
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
      color: "bg-orange-600",
      image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/early-booking",
      badge: "Popüler",
      description: "Yaz tatilini şimdiden planla, %25 indirim kazan!"
    },
    {
      id: "2",
      title: "Aile Paketi",
      discount: "1 Çocuk Ücretsiz",
      expiry: "Sınırlı sayıda",
      color: "bg-emerald-600",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/family-package",
      description: "Ailecek tatil yapın, çocuğunuzun konaklaması bizden!"
    },
    {
      id: "3",
      title: "Son Dakika Fırsatı",
      discount: "%30",
      expiry: "Bugüne özel",
      color: "bg-red-600",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/last-minute",
      description: "Hemen kararını ver, ekstra %30 indirim yakala!"
    },
    {
      id: "4",
      title: "Hafta Sonu Kaçamağı",
      discount: "%15",
      expiry: "Her hafta sonu",
      color: "bg-blue-600",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2083&auto=format&fit=crop",
      link: "/campaigns/weekend-getaway",
      badge: "Yeni",
      description: "Hafta sonları şehir stresinden uzaklaşın, %15 indirimle dinlenin."
    },
    {
      id: "5",
      title: "Bahar Kampanyası",
      discount: "%20",
      expiry: "Mayıs sonuna kadar",
      color: "bg-purple-600",
      image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2031&auto=format&fit=crop",
      link: "/campaigns/spring-deal",
      description: "Baharın tadını çıkarın, erken yaz fırsatlarını yakalayın."
    },
    {
      id: "6",
      title: "Balayı Paketi",
      discount: "Özel İndirim",
      expiry: "Yıl boyunca",
      color: "bg-pink-600",
      image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/honeymoon",
      description: "Hayatınızın en özel tatilini unutulmaz kılın, ücretsiz ekstralar!"
    },
    {
      id: "7",
      title: "Tekne Turu Fırsatı",
      discount: "2 Kişi 1 Kişi Öder",
      expiry: "Yaz sezonu",
      color: "bg-cyan-600",
      image: "https://images.unsplash.com/photo-1586902197503-e71026292412?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/boat-tour",
      description: "Eşsiz mavilikte tekne turu, iki kişi fiyatına bir kişi"
    },
    {
      id: "8",
      title: "Uzun Konaklama İndirimi",
      discount: "%35",
      expiry: "Her zaman",
      color: "bg-amber-600",
      image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=2070&auto=format&fit=crop",
      link: "/campaigns/long-stay",
      badge: "Sınırlı",
      description: "7 gece ve üzeri konaklamalarda %35'e varan indirim!"
    },
    {
      id: "9",
      title: "Kültür Turu Kampanyası",
      discount: "%15 + Müze Kartı",
      expiry: "Kış sezonu",
      color: "bg-indigo-600",
      image: "https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?q=80&w=2076&auto=format&fit=crop",
      link: "/campaigns/culture-tour",
      description: "Şehrin kültürel zenginliklerini keşfedin, müze kartı hediye"
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
    : deals.filter((_, index) => index % 2 === (activeCategory === "popular" ? 0 : 1));
  
  if (!isOpen || !mounted) return null;

  const popupContent = (
    <div 
      className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden"
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
      
      {/* Popup Mobile Kaydırma Göstergesi */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/30 rounded-full z-[10000]" />
      
      {/* Popup Modal */}
      <FocusTrap>
        <div className="fixed inset-0 md:inset-auto md:flex items-center justify-center z-[9999] md:p-4">
          <div 
            ref={popupRef}
            className={`flex flex-col bg-white md:rounded-2xl shadow-2xl md:max-w-5xl w-full h-full md:h-auto md:max-h-[90vh] border border-gray-100 ${isClosing ? 'animate-zoomOut' : 'animate-zoomIn'}`}
            role="document"
          >
            {/* Dekoratif Elemanlar */}
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-300/30 blur-3xl z-0 pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-r from-orange-200/30 to-red-300/30 blur-3xl z-0 pointer-events-none"></div>
            
            {/* Header - Sabit */}
            <div className="relative z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 p-4 sm:p-6 flex-shrink-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4 shadow-lg animate-float">
                    <TagIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 
                      id="modal-title" 
                      className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      Özel Fırsatlar
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base mt-0.5 sm:mt-1">Sınırlı süreli kampanyalar ve indirimler</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto hide-scrollbar max-w-full">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeCategory === category.id 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      aria-pressed={activeCategory === category.id}
                    >
                      <category.icon className={`w-4 h-4 mr-1.5 ${activeCategory === category.id ? 'text-blue-500' : 'text-gray-400'}`} />
                      {category.name}
                    </button>
                  ))}
                </div>
                
                <button
                  ref={closeButtonRef}
                  onClick={handleClose}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Kapat"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            {/* İçerik - Kaydırılabilir */}
            <div 
              className="relative flex-grow overflow-y-auto overscroll-contain custom-scrollbar touch-pan-y"
              style={{ 
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="relative z-10 p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredDeals.map((deal) => (
                    <a 
                      href={deal.link} 
                      key={deal.id}
                      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full transform hover:-translate-y-1 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                      onMouseEnter={() => setHoveredCard(deal.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={(e) => handleCardClick(e, deal.link)}
                      aria-label={`${deal.title} - ${deal.discount} indirim, ${deal.expiry}`}
                    >
                      <div className="relative h-40 sm:h-48">
                        <Image
                          src={deal.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-all duration-700"
                          style={{
                            transform: hoveredCard === deal.id ? 'scale(1.05)' : 'scale(1)',
                            filter: hoveredCard === deal.id ? 'brightness(0.85)' : 'brightness(1)'
                          }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-80"></div>
                        
                        {/* Badge */}
                        {deal.badge && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
                              <span className="animate-pulse-slow bg-white w-1.5 h-1.5 rounded-full mr-1.5"></span>
                              {deal.badge}
                            </span>
                          </div>
                        )}
                        
                        {/* Discount */}
                        <div className="absolute bottom-3 left-3 z-10">
                          <span className={`${deal.color} text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg`}>
                            {deal.discount.includes("%") && (
                              <FireIcon className="w-4 h-4 text-yellow-300" />
                            )}
                            {deal.discount}
                          </span>
                        </div>
                        
                        {/* Title on Image */}
                        <div 
                          className="absolute bottom-3 left-3 right-3 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10" 
                          style={{ bottom: deal.discount ? '3.5rem' : '1rem' }}
                        >
                          <h3 className="text-white font-bold text-lg drop-shadow-xl">
                            {deal.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-5 flex-1 flex flex-col bg-gradient-to-br from-white to-gray-50">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
                          {deal.title}
                        </h3>
                        
                        {deal.description && (
                          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{deal.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3 border-t border-gray-100">
                          <p className="text-gray-500 text-xs sm:text-sm flex items-center">
                            <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-red-500 flex-shrink-0" />
                            <span className="truncate">{deal.expiry}</span>
                          </p>
                          
                          <div className="text-blue-600 font-medium text-xs sm:text-sm flex items-center group-hover:font-bold transition-all">
                            Detaylar
                            <ArrowLongRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Footer - Sabit */}
            <div className="relative z-20 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-100 p-4 sm:p-6 flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-blue-600 flex-shrink-0" />
                  <p>Fırsatlar düzenli olarak güncellenmektedir. Son güncelleme: Bugün</p>
                </div>
                
                <a
                  href="/campaigns"
                  className="text-white font-medium text-xs sm:text-sm flex items-center transition-all bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg shadow-md hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto justify-center sm:justify-start"
                  onClick={(e) => handleCardClick(e, '/campaigns')}
                >
                  <span>Tüm Kampanyaları Gör</span>
                  <ArrowLongRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  );

  // Portal kullanarak body'ye direkt render ediyoruz
  return createPortal(popupContent, document.body);
} 