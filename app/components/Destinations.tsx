"use client";

import Image from "next/image";
import Link from "next/link";

const routes = [
  {
    id: 1,
    name: "İstanbul - Kapadokya",
    description: "Boğaz manzarasından peri bacalarına eşsiz bir rota",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    tourCount: 24,
    region: "Marmara - İç Anadolu"
  },
  {
    id: 2,
    name: "Akdeniz Kıyıları",
    description: "Turkuaz sahilleri ve antik kentleriyle büyüleyici bir rota",
    image: "https://images.unsplash.com/photo-1605217613423-0ebe71a1f71f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tourCount: 36,
    region: "Akdeniz"
  },
  {
    id: 3,
    name: "Kapadokya - Pamukkale",
    description: "Peri bacalarından travertenlere doğa harikası bir rota",
    image: "https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tourCount: 18,
    region: "İç Anadolu - Ege"
  },
  {
    id: 4,
    name: "Ege Kıyıları",
    description: "Antik kentler ve muhteşem koylarla dolu bir rota",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
    tourCount: 25,
    region: "Ege"
  }
];

export default function Routes() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popüler Rotalar
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Türkiye'nin en güzel rotalarını keşfedin ve unutulmaz bir seyahat deneyimi yaşayın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route) => (
            <Link 
              key={route.id} 
              href={`/routes/${route.id}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={route.image}
                  alt={route.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{route.name}</h3>
                  <p className="text-white/90 text-sm mb-3">{route.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">{route.region}</span>
                    <span className="text-white/80 text-sm">{route.tourCount} tur</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/routes" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tüm Rotaları Gör
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 