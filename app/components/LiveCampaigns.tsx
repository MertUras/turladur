"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ClockIcon, FireIcon, TagIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function LiveCampaigns() {
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Son 2 Saat! %40 İndirim",
      description: "Son 2 Saat! %40 İndirim",
      timeLeft: "2 saat içinde bitiyor",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
      label: "Acil Fırsat",
      discount: "%40",
    },
    {
      id: 2,
      title: "Hafta Sonu Fırsatı",
      description: "Hafta Sonu Fırsatı",
      timeLeft: "Bugün 23:59'da bitiyor",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      label: "Hafta Sonu",
      discount: "%30",
    },
  ]);

  return (
    <div className="space-y-8">


      {/* Kampanya Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48">
              <Image
                src={campaign.image}
                alt={campaign.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {campaign.label}
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {campaign.discount} İndirim
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-2 mb-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {campaign.title}
                </h3>
                <p className="text-gray-600">{campaign.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-red-500">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">{campaign.timeLeft}</span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Detayları Gör
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
