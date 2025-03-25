"use client";
import React from "react";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function ExperiencesPage() {
  const experiences = [
    {
      id: 1,
      title: "Kapadokya",
      description:
        "Peri bacaları ve balon turlarıyla ünlü Kapadokya, Türkiye'nin en sıra dışı rotalarından biri.",
      imageUrl: "https://via.placeholder.com/600x400?text=Kapadokya+Balon",
    },
    {
      id: 2,
      title: "Pamukkale",
      description:
        "Bembeyaz travertenleri ve termal sularıyla dünyaca ünlü bir doğa harikası.",
      imageUrl: "https://via.placeholder.com/600x400?text=Pamukkale",
    },
    {
      id: 3,
      title: "Efes Antik Kenti",
      description:
        "Tarihi kalıntıları ve görkemli kütüphanesiyle antik dünyanın gözde destinasyonu.",
      imageUrl: "https://via.placeholder.com/600x400?text=Efes+Antik+Kenti",
    },
    {
      id: 4,
      title: "Karadeniz Yaylaları",
      description:
        "Yeşilin binbir tonunu barındıran yaylalar, huzur ve serin hava arayanlar için birebir.",
      imageUrl: "https://via.placeholder.com/600x400?text=Karadeniz+Yaylalari",
    },
  ];

  return (
    <><main className="bg-white text-gray-900">
      {/* HERO SECTION */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <Image
          src="https://via.placeholder.com/1600x900?text=Deneyimler+Hero"
          alt="Deneyimler Hero"
          fill
          className="object-cover object-center"
          priority />
        {/* İsteğe bağlı: Resmin üzerine hafif bir karartma */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        {/* Hero başlık ve alt metin */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Deneyimler</h1>
          <p className="max-w-2xl mx-auto">
            Türkiye’nin favori rotaları ve eşsiz deneyimleri hakkında bilgi edinin.
            Gezgincilerin gözdesi olan destinasyonlar burada!
          </p>
        </div>
      </div>

      {/* İÇERİK - KARTLAR */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {experiences.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Hiç deneyim bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Kart içindeki resim */}
                <div className="relative w-full h-40">
                  <Image
                    src={exp.imageUrl}
                    alt={exp.title}
                    fill
                    className="object-cover" />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{exp.title}</h2>
                  <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Detaylar &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main><Footer></Footer></>
  );
}
