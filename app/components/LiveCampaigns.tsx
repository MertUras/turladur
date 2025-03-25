"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface LiveCampaign {
  id: number;
  title: string;
  expiresIn: string; // "2 saat kaldı" gibi
  imageUrl?: string;
}

export default function LiveCampaigns() {
  const [liveCampaigns, setLiveCampaigns] = useState<LiveCampaign[]>([]);

  // Örnek: statik veri veya bir API’den fetch
  useEffect(() => {
    const data: LiveCampaign[] = [
      {
        id: 101,
        title: "Son 2 Saat! %40 İndirim",
        expiresIn: "2 saat içinde bitiyor",
        imageUrl: "https://via.placeholder.com/300x200?text=Live+1",
      },
      {
        id: 102,
        title: "Hafta Sonu Fırsatı",
        expiresIn: "Bugün 23:59'da bitiyor",
        imageUrl: "https://via.placeholder.com/300x200?text=Live+2",
      },
    ];
    setLiveCampaigns(data);

    // Eğer gerçek bir API çağrısı yapmak isterseniz:
    // fetch("/api/live-campaigns")
    //   .then((res) => res.json())
    //   .then((json) => setLiveCampaigns(json));
  }, []);

  return (
    <section className="bg-blue-50 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Anlık Kampanyalar</h2>
      <div className="flex flex-col sm:flex-row gap-6">
        {liveCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-lg shadow-md overflow-hidden w-full sm:w-1/2"
          >
            <div className="relative h-40">
              <Image
                src={
                  campaign.imageUrl ??
                  "https://via.placeholder.com/300x200?text=Live+Campaign"
                }
                alt={campaign.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-md font-medium">{campaign.title}</h3>
              <p className="text-sm text-red-500 mt-1">{campaign.expiresIn}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
