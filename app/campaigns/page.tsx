"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import LiveCampaigns from "@/components/LiveCampaigns"; // Eğer yoksa comment out yapın
import HotelFilters from "@/(dashboard)/hotel/components/HotelFilters";



export default function CampaignsPage() {
  return (
    <main className="pt-24 bg-white text-gray-900 min-h-screen">
      {/* HERO BÖLÜMÜ */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src="https://via.placeholder.com/1600x900?text=Kampanyalar+Hero"
          alt="Kampanyalar Hero"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Kampanyalar</h1>
          <p className="max-w-2xl">
            Kaçırılmayacak fırsatları yakalayın! Mevcut ve güncel kampanyalar burada.
          </p>
        </div>
      </div>

      {/* ANA İÇERİK: SOLDA FİLTRE, SAĞDA LIVE CAMPAIGNS + KAMPANYA KARTLARI */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SOL FİLTRE (HotelFilters) */}
          <aside className="bg-white shadow p-4 rounded-md">
            <HotelFilters cities={[]} priceRanges={[]} featureFilters={[]} popularFilters={[]} />
          </aside>

          {/* SAĞ (Orta) BÖLÜM */}
          <section className="lg:col-span-3 space-y-8">
            {/* 1) Anlık Kampanyalar */}
            <LiveCampaigns />

            {/* 2) Kampanya Kartları */}
            <CampaignsList />
          </section>
        </div>
      </div>
    </main>
  );
}

/* HeroSection: Otel sayfasına benzer genişlikte bir görsel */
function HeroSection() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      {/* Arkaplan görseli */}
      <Image
        src=""
        alt="Kampanyalar Hero"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Karartma katmanı */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Metinler */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">Kampanyalar</h1>
        <p className="max-w-2xl">
          Kaçırılmayacak fırsatları yakalayın! Mevcut ve güncel kampanyalar burada.
        </p>
      </div>
    </div>
  );
}

/* Kampanya kartlarını renderlayan fonksiyonel bileşen */
function CampaignsList() {
  // Örnek kampanya verileri
  const campaigns = [
    {
      id: 1,
      title: "Erken Rezervasyon İndirimi",
      description: "Yaz tatilini şimdiden planla, %25 indirim kazan!",
      discount: "%25",
      label: "Popüler",
      validity: "Son 3 gün",
      imageUrl: "https://via.placeholder.com/600x400?text=Erken+Rezervasyon",
    },
    {
      id: 2,
      title: "Aile Paketi",
      description: "Ailecek tatil yapın, çocuğunuzun konaklaması bizden!",
      label: "1 Çocuk Ücretsiz",
      validity: "Sınırlı sayıda",
    },
    {
      id: 3,
      title: "Son Dakika Fırsatı",
      description: "Hemen kararını ver, ekstra %30 indirim yakala!",
      discount: "%30",
      validity: "Bugüne özel",
    },
  ];

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 bg-white rounded-md shadow">
        <p className="text-gray-500">Arama kriterlerinize uygun kampanya bulunamadı.</p>
        <button className="mt-4 px-4 py-2 bg-gray-100 text-sm rounded-md hover:bg-gray-200">
          Filtreleri Temizle
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {campaigns.map((c) => (
        <div
          key={c.id}
          className="relative border border-gray-200 rounded-lg p-4"
        >
          {/* Discount Etiketi */}
          {c.discount && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white text-sm px-2 py-1 rounded-md">
              {c.discount}
            </span>
          )}
          {/* Label Etiketi */}
          {c.label && (
            <span className="absolute top-2 right-2 bg-green-600 text-white text-sm px-2 py-1 rounded-md">
              {c.label}
            </span>
          )}

          <h3 className="text-lg font-semibold">{c.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{c.description}</p>
          {c.validity && (
            <p className="text-xs text-red-500 mt-2">{c.validity}</p>
          )}
          <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
            Detaylar &rarr;
          </button>
        </div>
      ))}
    </div>
  );
}

