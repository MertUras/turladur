"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ClockIcon, FireIcon, TagIcon, SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

// Interface for Live Campaign data (can be simplified if needed)
interface LiveCampaign {
  id: number;
  title: string;
  description: string; // Might be redundant if same as title
  timeLeft: string;
  image: string;
  label?: string; // Optional label
  discount?: string; // Optional discount
}

export default function LiveCampaigns() {
  // Sample live campaigns - adapt structure as needed
  const [campaigns, setCampaigns] = useState<LiveCampaign[]>([
    {
      id: 1,
      title: "Son 2 Saat! Ekstra İndirim",
      description: "Acele edin, kısa süreli ekstra indirim fırsatını kaçırmayın!",
      timeLeft: "2 saat içinde bitiyor",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
      label: "Acil",
      discount: "%15 Ekstra",
    },
    {
      id: 2,
      title: "Gün Sonu Fırsatı",
      description: "Sadece bugüne özel seçili turlarda ek avantajlar yakalayın.",
      timeLeft: "Bugün 23:59'da bitiyor",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
      // label: "Günün Fırsatı",
      discount: "Sürpriz Avantaj",
    },
  ]);

  // Return null or a placeholder if no campaigns exist
  if (campaigns.length === 0) {
    return null; // Or a placeholder message
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-neutral-200/50"
        >
          <div className="relative h-48 overflow-hidden">
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              {campaign.discount && (
                <span className="bg-sky-100 text-sky-700 text-xs px-2.5 py-1 rounded-md font-semibold border border-sky-200/80">
                  {campaign.discount}
                </span>
              )}
              {campaign.label && (
                <span className="bg-neutral-100 text-neutral-700 text-xs px-2.5 py-1 rounded-md font-medium border border-neutral-200/80">
                  {campaign.label}
                </span>
              )}
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 line-clamp-1 mb-1">
                {campaign.title}
              </h3>
              <p className="text-neutral-600 line-clamp-2 text-sm">
                {campaign.description}
              </p>
            </div>

            <div className="mt-5 pt-4 flex items-center justify-between border-t border-neutral-100">
              <div className="flex items-center text-xs text-neutral-500">
                <ClockIcon className="w-3.5 h-3.5 mr-1" />
                <span>{campaign.timeLeft}</span>
              </div>
              
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
