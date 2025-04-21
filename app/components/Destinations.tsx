"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon, MapPinIcon } from "@heroicons/react/20/solid";

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
    <section className="py-24 md:py-32 bg-neutral-50 border-t border-neutral-200/60">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-6">
             Popüler Turlar
           </div>
           <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
            Keşfedilecek Yeni Yerler
          </h2>
           <p className="text-lg text-neutral-600">
            Türkiye'nin en çok tercih edilen seyahat rotalarını keşfedin.
            Unutulmaz anılar bir tık uzağınızda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {routes.map((route, index) => (
            <Link 
              key={route.id} 
              href={`/routes/${route.id}`}
               className="group block bg-white rounded-xl border border-neutral-200/80 overflow-hidden transition-all duration-300 ease-out hover:shadow-lg"
            >
               <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={route.image}
                  alt={route.name}
                  fill
                   priority={index < 4}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                   className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                 <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-medium text-neutral-700 shadow-sm flex items-center">
                   <MapPinIcon className="w-3 h-3 mr-1 text-neutral-500"/>
                   {route.region}
                </div>
              </div>
               <div className="p-5">
                 <h3 className="text-base font-semibold text-neutral-800 mb-1.5 group-hover:text-sky-700 transition-colors duration-200 line-clamp-1" title={route.name}>
                  {route.name}
                </h3>
                 <p className="text-xs text-neutral-600 mb-3 line-clamp-2 h-8 leading-relaxed">
                  {route.description}
                </p>
                 <div className="flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100 pt-3 mt-3">
                  <span>{route.tourCount} Tur Seçeneği</span>
                   <span className="flex items-center text-sky-600 font-medium group-hover:translate-x-0.5 transition-transform duration-200">
                    Keşfet
                     <ChevronRightIcon className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 md:mt-20 text-center">
          <Link 
            href="/tours" 
             className="inline-flex items-center justify-center px-7 py-3 bg-white text-sky-700 border border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors font-medium rounded-lg shadow-sm text-sm"
          >
            Tüm Turları Gör
             <ChevronRightIcon className="w-5 h-5 ml-1.5" />
          </Link>
        </div>
      </div>
    </section>
  );
} 