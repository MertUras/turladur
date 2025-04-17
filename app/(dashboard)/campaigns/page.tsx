"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import LiveCampaigns from "../components/LiveCampaigns";
import { FireIcon, ClockIcon, TagIcon, SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

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
    <main className="pt-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen">
      {/* HERO BÖLÜMÜ */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
          alt="Kampanyalar Hero"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white drop-shadow-lg">
              Kaçırılmayacak Fırsatlar
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 font-light leading-relaxed drop-shadow mb-8">
              En avantajlı seyahat fırsatlarını keşfedin. Sınırlı süreli kampanyalar ve özel indirimler sizi bekliyor.
            </p>
            
            {/* Banner Etiketleri */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg hover:bg-white/30 transition-colors">
                <FireIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Acil Fırsatlar</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg hover:bg-white/30 transition-colors">
                <TagIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">En Çok Tercih Edilenler</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-lg hover:bg-white/30 transition-colors">
                <SparklesIcon className="w-5 h-5 mr-2" />
                <span className="font-semibold">Özel Kampanyalar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ANA İÇERİK */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="space-y-16">
          {/* Anlık Kampanyalar */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center text-gray-900">
                <FireIcon className="w-8 h-8 mr-3 text-red-500" />
                Anlık Kampanyalar
              </h2>
              <span className="text-sm text-gray-600 flex items-center bg-gray-100 px-4 py-2 rounded-full">
                <ClockIcon className="w-4 h-4 mr-1 text-gray-500" />
                Sürekli güncelleniyor
              </span>
            </div>
            <LiveCampaigns />
          </section>

          {/* Tüm Kampanyalar */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold flex items-center text-gray-900">
                <SparklesIcon className="w-8 h-8 mr-3 text-yellow-500" />
                Tüm Kampanyalar
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                  Toplam {campaigns.length} kampanya
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
                  Tümünü Gör
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
            <CampaignsList campaigns={campaigns} />
          </section>
        </div>
      </div>
    </main>
  );
}

/* Kampanya kartlarını renderlayan fonksiyonel bileşen */
function CampaignsList({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-white rounded-2xl shadow-sm">
        <SparklesIcon className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-600 text-xl mb-2">Henüz kampanya bulunmuyor</p>
        <p className="text-gray-500 mb-6">Yakında yeni kampanyalar eklenecek</p>
        <button className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((c) => (
        <div
          key={c.id}
          className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-100"
        >
          {/* Kampanya Görseli */}
          <div className="relative h-56 overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={c.image}
                alt={c.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/80 group-hover:via-black/40 group-hover:to-transparent transition-all duration-300" />
            </div>
            
            {/* Üst Etiketler */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
              {c.discount && (
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm px-4 py-1.5 rounded-full shadow-lg font-medium transform group-hover:-translate-y-1 transition-transform duration-300">
                  {c.discount} İndirim
                </span>
              )}
              
              {c.label && (
                <span className="bg-gradient-to-r from-green-600 to-green-700 text-white text-sm px-4 py-1.5 rounded-full shadow-lg font-medium transform group-hover:-translate-y-1 transition-transform duration-300">
                  {c.label}
                </span>
              )}
            </div>

            {/* Alt Etiketler */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
              <span className="bg-white/95 text-gray-800 text-xs px-3 py-1 rounded-full shadow-sm backdrop-blur-sm group-hover:bg-white transition-colors duration-300">
                {c.category}
              </span>
              <span className="bg-white/95 text-gray-800 text-xs px-3 py-1 rounded-full shadow-sm backdrop-blur-sm group-hover:bg-white transition-colors duration-300">
                {c.location}
              </span>
            </div>
          </div>

          {/* Kampanya İçeriği */}
          <div className="p-6">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {c.title}
              </h3>
              <p className="text-gray-600 line-clamp-2 text-sm group-hover:text-gray-700 transition-colors">
                {c.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              {c.validity && (
                <div className="flex items-center text-sm text-red-500 group-hover:text-red-600 transition-colors">
                  <ClockIcon className="w-4 h-4 mr-1 animate-pulse" />
                  <span>{c.validity}</span>
                </div>
              )}
              
              <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all duration-300 hover:scale-105">
                Detayları Gör
                <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

