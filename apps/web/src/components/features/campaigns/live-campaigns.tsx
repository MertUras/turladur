'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';

interface LiveCampaign {
  id: number;
  title: string;
  description: string;
  timeLeft: string;
  image: string;
  label?: string;
  discount?: string;
}

export function LiveCampaigns() {
  const [campaigns] = useState<LiveCampaign[]>([
    {
      id: 1,
      title: 'Son 2 Saat! Ekstra İndirim',
      description:
        'Acele edin, kısa süreli ekstra indirim fırsatını kaçırmayın!',
      timeLeft: '2 saat içinde bitiyor',
      image:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
      label: 'Acil',
      discount: '%15 Ekstra',
    },
    {
      id: 2,
      title: 'Gün Sonu Fırsatı',
      description:
        'Sadece bugüne özel seçili turlarda ek avantajlar yakalayın.',
      timeLeft: "Bugün 23:59'da bitiyor",
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
      discount: 'Sürpriz Avantaj',
    },
  ]);

  if (campaigns.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="group overflow-hidden rounded-xl border border-neutral-200/50 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="relative h-48 overflow-hidden">
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
              {campaign.discount ? (
                <span className="rounded-md border border-sky-200/80 bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                  {campaign.discount}
                </span>
              ) : null}
              {campaign.label ? (
                <span className="rounded-md border border-neutral-200/80 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                  {campaign.label}
                </span>
              ) : null}
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="mb-4">
              <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-neutral-900">
                {campaign.title}
              </h3>
              <p className="line-clamp-2 text-sm text-neutral-600">
                {campaign.description}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
              <div className="flex items-center text-xs text-neutral-500">
                <Clock className="mr-1 h-3.5 w-3.5" />
                <span>{campaign.timeLeft}</span>
              </div>

              <button
                type="button"
                className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-sky-600 transition-colors hover:bg-sky-50 hover:text-sky-800"
              >
                Detaylar
                <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
