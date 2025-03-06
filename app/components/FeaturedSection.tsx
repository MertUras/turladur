"use client";

import Image from "next/image";
import Link from "next/link";
import { parseJsonString, formatCurrency } from "@/app/utils/format";
import { useState, useRef, useEffect } from "react";

interface FeaturedSectionProps {
  title: string;
  description: string;
  items: any[];
  type: 'hotel' | 'tour' | 'experience';
  viewAllLink: string;
  bgColor?: string;
}

export default function FeaturedSection({ 
  title, 
  description, 
  items, 
  type, 
  viewAllLink,
  bgColor = "bg-gray-50"
}: FeaturedSectionProps) {
  // Renk ve stil ayarları
  const colorScheme = {
    hotel: {
      badge: "bg-white text-blue-600",
      button: "bg-blue-500 hover:bg-blue-600",
      tag: "bg-blue-50 text-blue-700",
      gradient: "from-blue-600 to-blue-400",
      lightBg: "bg-blue-50"
    },
    tour: {
      badge: "bg-green-500 text-white",
      button: "bg-green-500 hover:bg-green-600",
      tag: "bg-green-50 text-green-700",
      gradient: "from-green-600 to-green-400",
      lightBg: "bg-green-50"
    },
    experience: {
      badge: "bg-purple-500 text-white",
      button: "bg-purple-500 hover:bg-purple-600",
      tag: "bg-purple-50 text-purple-700",
      gradient: "from-purple-600 to-purple-400",
      lightBg: "bg-purple-50"
    }
  };

  // Görüntülenen öğe sayısı için state
  const [visibleItems, setVisibleItems] = useState(6);
  // Animasyon için ref
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll animasyonu
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
        }
      });
    }, { threshold: 0.1 });

    const childElements = sectionRef.current?.querySelectorAll('.card-item');
    childElements?.forEach(item => {
      observer.observe(item);
    });

    return () => {
      childElements?.forEach(item => {
        observer.unobserve(item);
      });
    };
  }, [items]);

  // Daha fazla göster fonksiyonu
  const handleShowMore = () => {
    setVisibleItems(prev => prev + 3);
  };

  return (
    <section className={`py-20 ${bgColor} relative overflow-hidden`}>
      {/* Dekoratif arkaplan şekilleri */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-opacity-10 to-opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-opacity-10 to-opacity-5 rounded-full blur-3xl"></div>
      
      <div className="container px-4 mx-auto relative">
        {/* Başlık ve açıklama alanı */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium mb-4 ${colorScheme[type].lightBg} ${`text-${colorScheme[type].gradient.split('-')[1]}-600`}`}>
            {type === 'hotel' ? 'Konaklamalar' : type === 'tour' ? 'Turlar' : 'Etkinlikler'}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r animate-text-gradient-slow pb-2 
            bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{description}</p>
          
          <div className="flex justify-center mt-8">
            <Link href={viewAllLink} 
              className={`group relative inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${colorScheme[type].gradient} px-8 py-3 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px]`}>
              <span className="font-medium">Tümünü Gör</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="absolute -bottom-0 left-1/2 h-px w-0 bg-white transition-all group-hover:w-4/5 -translate-x-1/2"></span>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={sectionRef}>
          {items.slice(0, visibleItems).map((item, index) => (
            <div 
              key={item.id} 
              className="card-item bg-white rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group opacity-0"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={parseJsonString<string[]>(item.images, [])[0]}
                  alt={item.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Favorilere ekleme butonu */}
                <button className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/50 transition-colors duration-300 z-10"
                  aria-label="Favorilere ekle">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5 group-hover:fill-red-500 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
                
                {/* Tip bazında farklı badge'ler */}
                {type === 'hotel' && (
                  <div className={`absolute top-4 right-4 ${colorScheme[type].badge} px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md shadow-md`}>
                    {item.stars} Yıldızlı
                  </div>
                )}
                
                {type === 'tour' && (
                  <>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="font-medium">{item.duration} Gün</span>
                      </div>
                    </div>
                    <div className={`absolute top-4 right-4 ${colorScheme[type].badge} px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md shadow-md`}>
                      {formatCurrency(item.price)}
                    </div>
                  </>
                )}
                
                {type === 'experience' && (
                  <>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="font-medium">{item.duration} Saat</span>
                      </div>
                    </div>
                    <div className={`absolute top-4 right-4 ${colorScheme[type].badge} px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md shadow-md`}>
                      {formatCurrency(item.price)}
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300 
                  group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-black">
                  {item.name}
                </h3>
                
                {/* Tip bazında farklı alt bilgiler */}
                {type === 'hotel' && (
                  <div className="flex items-center mt-2 text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 text-blue-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span className="font-medium">{item.city}, {item.country}</span>
                  </div>
                )}
                
                {type === 'tour' && (
                  <div className="flex items-center mt-2 text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 text-green-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                    </svg>
                    <span className="font-medium">{parseJsonString<string[]>(item.destinations, []).slice(0, 2).join(" → ")}</span>
                  </div>
                )}
                
                {type === 'experience' && (
                  <div className="flex items-center mt-2 text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 text-purple-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span className="font-medium">{item.city}, {item.country}</span>
                  </div>
                )}
                
                {/* Etiketler - Geliştirilmiş */}
                {type === 'hotel' && (
                  <div className="flex flex-wrap gap-2 my-3">
                    {parseJsonString<string[]>(item.amenities, []).slice(0, 3).map((amenity, index) => (
                      <span key={index} className={`${colorScheme[type].tag} text-xs px-3 py-1.5 rounded-full flex items-center gap-1`}>
                        {index === 0 && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                        {index === 1 && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                          </svg>
                        )}
                        {index === 2 && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                          </svg>
                        )}
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
                
                {type === 'experience' && (
                  <div className="flex flex-wrap gap-2 my-3">
                    <span className={`${colorScheme[type].tag} text-xs px-3 py-1.5 rounded-full flex items-center gap-1`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                      </svg>
                      {item.category}
                    </span>
                  </div>
                )}
                
                <p className="text-gray-600 line-clamp-2 text-sm my-4">{item.description}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <Link 
                    href={`/${type}/${item.id}`} 
                    className={`group relative inline-flex items-center gap-1 ${colorScheme[type].button} text-white px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden`}
                  >
                    <span className="relative z-10">Detayları Gör</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform relative z-10 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="absolute inset-0 bg-black/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                  </Link>
                  {type === 'hotel' && (
                    <div className="flex items-center text-yellow-500 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-1">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                      {item.rating} 
                      <span className="text-gray-500 text-xs ml-1">({item.reviewCount || '0'})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Daha fazla göster butonu */}
        {items.length > visibleItems && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={handleShowMore}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-300"
            >
              <span>Daha Fazla Göster</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
} 