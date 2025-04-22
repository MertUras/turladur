"use client";
import React from "react";
import Image from "next/image";
//import LiveCampaigns from "../components/LiveCampaigns";
import { FireIcon, ClockIcon, TagIcon, SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import LiveCampaigns from "@/app/components/LiveCampaigns";

// Kampanya tipini tanımlıyoruz
type Campaign = {
  id: number;
  title: string;
  description: string;
  discount?: string;
  label?: string;
  validity?: string;
  image: string;
  category: string;
  location: string;
};

// Kampanya verilerini burada tanımlıyoruz
const campaigns: Campaign[] = [
  {
    id: 1,
    title: "Erken Rezervasyon İndirimi",
    description: "Yaz tatilini şimdiden planla, %25 indirim kazan! Erken rezervasyon avantajlarından yararlanın.",
    discount: "%25",
    label: "Popüler",
    validity: "Son 3 gün",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    category: "Erken Rezervasyon",
    location: "Tüm Destinasyonlar"
  },
  {
    id: 2,
    title: "Aile Paketi",
    description: "Ailecek tatil yapın, çocuğunuzun konaklaması bizden! Ailelere özel avantajlı fırsatlar.",
    label: "1 Çocuk Ücretsiz",
    validity: "Sınırlı sayıda",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
    category: "Aile Paketi",
    location: "Türkiye"
  },
  {
    id: 3,
    title: "Son Dakika Fırsatı",
    description: "Hemen kararını ver, ekstra %30 indirim yakala! Son dakika fırsatlarını kaçırmayın.",
    discount: "%30",
    validity: "Bugüne özel",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop",
    category: "Son Dakika",
    location: "Avrupa"
  },
  {
    id: 4,
    title: "Uzun Konaklama İndirimi",
    description: "7 gece ve üzeri konaklamalarda %35'e varan indirim fırsatı! Uzun süreli tatiller için ideal.",
    discount: "%35",
    label: "Sınırlı",
    validity: "Mayıs sonuna kadar",
    image: "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=2070&auto=format&fit=crop",
    category: "Uzun Konaklama",
    location: "Tüm Destinasyonlar"
  },
  {
    id: 5,
    title: "Bahar Kampanyası",
    description: "Baharın tadını çıkarın, erken yaz fırsatlarını yakalayın. %20 indirim avantajı.",
    discount: "%20",
    validity: "Haziran sonuna kadar",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2031&auto=format&fit=crop",
    category: "Mevsimsel",
    location: "Akdeniz"
  },
  {
    id: 6,
    title: "Balayı Paketi",
    description: "Hayatınızın en özel tatilini unutulmaz kılın, ücretsiz ekstralar ve özel sürprizler sizi bekliyor.",
    label: "Özel",
    validity: "Yıl boyunca",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2070&auto=format&fit=crop",
    category: "Özel Paket",
    location: "Maldivler"
  }
];

export default function CampaignsPage() {
  return (
    <main className="bg-neutral-50 text-neutral-800 min-h-screen">
      {/* HERO SECTION - Refined */}
      <section className="relative h-[450px] md:h-[500px] w-full overflow-hidden bg-neutral-900"> 
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
          alt="Kampanyalar Hero"
          fill
          className="object-cover object-center opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /> 
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight text-white drop-shadow-lg">
              Kaçırılmayacak Fırsatlar
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 font-light leading-relaxed drop-shadow mb-10">
              En avantajlı seyahat fırsatlarını keşfedin. Sınırlı süreli kampanyalar ve özel indirimler sizi bekliyor.
            </p>
            
            {/* Refined Banner Tags */}
            <div className="flex flex-wrap justify-center gap-3 text-sm"> 
              <div className="flex items-center bg-black/20 backdrop-blur-md text-neutral-200 px-4 py-2 rounded-lg"> 
                <FireIcon className="w-4 h-4 mr-1.5 text-orange-400" />
                <span className="font-medium">Acil Fırsatlar</span>
              </div>
              <div className="flex items-center bg-black/20 backdrop-blur-md text-neutral-200 px-4 py-2 rounded-lg"> 
                <TagIcon className="w-4 h-4 mr-1.5 text-sky-300" />
                <span className="font-medium">En Çok Tercih Edilenler</span>
              </div>
              <div className="flex items-center bg-black/20 backdrop-blur-md text-neutral-200 px-4 py-2 rounded-lg"> 
                <SparklesIcon className="w-4 h-4 mr-1.5 text-yellow-400" />
                <span className="font-medium">Özel Kampanyalar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="space-y-16 md:space-y-20">
          {/* Live Campaigns Section - Refined Header */}
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
                Anlık Kampanyalar
              </h2>
              <span className="text-xs sm:text-sm text-neutral-500 flex items-center bg-neutral-100 px-3 py-1.5 rounded-md border border-neutral-200/80">
                <ClockIcon className="w-4 h-4 mr-1.5 text-neutral-400" />
                Sürekli güncelleniyor
              </span>
            </div>
            <LiveCampaigns />
          </section>

          {/* All Campaigns Section - Refined Header */}
          <section>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
                Tüm Kampanyalar
              </h2>
              <div className="flex items-center space-x-3">
                <span className="text-xs sm:text-sm text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-md border border-neutral-200/80">
                  {campaigns.length} kampanya
                </span>
              </div>
            </div>
            <CampaignsList campaigns={campaigns} />
          </section>
        </div>
      </div>
    </main>
  );
}

/* CampaignsList Component - Refined Styles */
function CampaignsList({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-neutral-100 rounded-2xl border border-neutral-200/80">
        <SparklesIcon className="w-10 h-10 text-neutral-400 mb-4" />
        <p className="text-neutral-600 text-lg mb-2">Henüz kampanya bulunmuyor</p>
        <p className="text-neutral-500 text-sm mb-6">Yakında yeni kampanyalar eklenecek.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((c) => (
        <div
          key={c.id}
          className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-neutral-200/50"
        >
          <div className="relative h-56 overflow-hidden">
            <Image
              src={c.image}
              alt={c.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            
            <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2 z-10">
              {c.discount && (
                <span className="bg-sky-100 text-sky-700 text-xs px-2.5 py-1 rounded-md font-semibold border border-sky-200/80">
                  {c.discount} İNDİRİM
                </span>
              )}
              {c.label && (
                <span className="bg-neutral-100 text-neutral-700 text-xs px-2.5 py-1 rounded-md font-medium border border-neutral-200/80">
                  {c.label}
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 z-10">
              <span className="bg-white/80 backdrop-blur-sm text-neutral-800 text-xs px-2.5 py-1 rounded-md shadow-sm">
                {c.category}
              </span>
              <span className="bg-white/80 backdrop-blur-sm text-neutral-800 text-xs px-2.5 py-1 rounded-md shadow-sm">
                {c.location}
              </span>
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1 mb-1">
                {c.title}
              </h3>
              <p className="text-neutral-600 line-clamp-2 text-sm">
                {c.description}
              </p>
            </div>

            <div className="mt-5 pt-4 flex items-center justify-between border-t border-neutral-100">
              {c.validity && (
                <div className="flex items-center text-xs text-neutral-500">
                  <ClockIcon className="w-3.5 h-3.5 mr-1" />
                  <span>{c.validity}</span>
                </div>
              )}
              
              <button className="inline-flex items-center text-sky-600 hover:text-sky-800 text-sm font-medium hover:bg-sky-50 px-3 py-1.5 rounded-md transition-colors">
                Detaylar
                <ArrowRightIcon className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

