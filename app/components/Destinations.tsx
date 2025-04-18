"use client";

import Image from "next/image";
import Link from "next/link";

const routes = [
  {
    id: 1,
    name: "İstanbul - Kapadokya",
    description: "Boğaz manzarasından peri bacalarına eşsiz bir yolculuk.",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    tourCount: 24,
    region: "Marmara - İç Anadolu"
  },
  {
    id: 2,
    name: "Akdeniz Kıyıları",
    description: "Turkuaz sular ve antik limanların büyüsü.",
    image: "https://images.unsplash.com/photo-1605217613423-0ebe71a1f71f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    tourCount: 36,
    region: "Akdeniz"
  },
  {
    id: 3,
    name: "Kapadokya - Pamukkale",
    description: "Doğa harikaları arasında mistik bir keşif.",
    image: "https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    tourCount: 18,
    region: "İç Anadolu - Ege"
  },
  {
    id: 4,
    name: "Ege Kıyıları",
    description: "Tarih ve denizin buluştuğu zeytin kokulu yollar.",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    tourCount: 25,
    region: "Ege"
  }
];

export default function Destinations() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2 block">
            Keşfedilecek Yerler
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Popüler Destinasyon Rotaları
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Türkiye'nin en çok tercih edilen rotalarını sizin için derledik. 
            Hayalinizdeki tatil bir tık uzağınızda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {routes.map((route) => (
            <Link 
              key={route.id} 
              href={`/routes/${route.id}`}
              className="group block bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 ease-out hover:shadow-lg hover:border-indigo-200"
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={route.image}
                  alt={route.name}
                  fill
                  priority={route.id <= 4}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-medium text-gray-700 shadow-sm">
                  {route.region}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300 truncate" title={route.name}>
                  {route.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                  {route.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3 mt-3">
                  <span>{route.tourCount} Farklı Tur Seçeneği</span>
                  <span className="flex items-center text-indigo-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
                    Keşfet
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 sm:mt-20 text-center">
          <Link 
            href="/routes" 
            className="inline-flex items-center justify-center px-7 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors duration-300 font-medium shadow-md hover:shadow-lg"
          >
            Tüm Rotaları Gör
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 