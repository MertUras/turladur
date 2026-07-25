'use client';

import Image from 'next/image';
import { ArrowRight, Clock, Flame, Sparkles, Tag } from 'lucide-react';

import { LiveCampaigns } from '@/components/features/campaigns/live-campaigns';

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

const campaigns: Campaign[] = [
  {
    id: 1,
    title: 'Erken Rezervasyon İndirimi',
    description:
      'Yaz tatilini şimdiden planla, %25 indirim kazan! Erken rezervasyon avantajlarından yararlanın.',
    discount: '%25',
    label: 'Popüler',
    validity: 'Son 3 gün',
    image:
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
    category: 'Erken Rezervasyon',
    location: 'Tüm Destinasyonlar',
  },
  {
    id: 2,
    title: 'Aile Paketi',
    description:
      'Ailecek tatil yapın, çocuğunuzun konaklaması bizden! Ailelere özel avantajlı fırsatlar.',
    label: '1 Çocuk Ücretsiz',
    validity: 'Sınırlı sayıda',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
    category: 'Aile Paketi',
    location: 'Türkiye',
  },
  {
    id: 3,
    title: 'Son Dakika Fırsatı',
    description:
      'Hemen kararını ver, ekstra %30 indirim yakala! Son dakika fırsatlarını kaçırmayın.',
    discount: '%30',
    validity: 'Bugüne özel',
    image:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop',
    category: 'Son Dakika',
    location: 'Avrupa',
  },
  {
    id: 4,
    title: 'Uzun Konaklama İndirimi',
    description:
      "7 gece ve üzeri konaklamalarda %35'e varan indirim fırsatı! Uzun süreli tatiller için ideal.",
    discount: '%35',
    label: 'Sınırlı',
    validity: 'Mayıs sonuna kadar',
    image:
      'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=2070&auto=format&fit=crop',
    category: 'Uzun Konaklama',
    location: 'Tüm Destinasyonlar',
  },
  {
    id: 5,
    title: 'Bahar Kampanyası',
    description:
      'Baharın tadını çıkarın, erken yaz fırsatlarını yakalayın. %20 indirim avantajı.',
    discount: '%20',
    validity: 'Haziran sonuna kadar',
    image:
      'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2031&auto=format&fit=crop',
    category: 'Mevsimsel',
    location: 'Akdeniz',
  },
  {
    id: 6,
    title: 'Balayı Paketi',
    description:
      'Hayatınızın en özel tatilini unutulmaz kılın, ücretsiz ekstralar ve özel sürprizler sizi bekliyor.',
    label: 'Özel',
    validity: 'Yıl boyunca',
    image:
      'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=2070&auto=format&fit=crop',
    category: 'Özel Paket',
    location: 'Maldivler',
  },
];

function CampaignsList({ items }: { items: Campaign[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-100 py-20 text-center">
        <Sparkles className="mb-4 h-10 w-10 text-neutral-400" />
        <p className="mb-2 text-lg text-neutral-600">
          Henüz kampanya bulunmuyor
        </p>
        <p className="mb-6 text-sm text-neutral-500">
          Yakında yeni kampanyalar eklenecek.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <div
          key={c.id}
          className="group overflow-hidden rounded-xl border border-neutral-200/50 bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="relative h-56 overflow-hidden">
            <Image
              src={c.image}
              alt={c.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

            <div className="absolute top-3 right-3 left-3 z-10 flex flex-wrap gap-2">
              {c.discount ? (
                <span className="rounded-md border border-sky-200/80 bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">
                  {c.discount} İNDİRİM
                </span>
              ) : null}
              {c.label ? (
                <span className="rounded-md border border-neutral-200/80 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                  {c.label}
                </span>
              ) : null}
            </div>

            <div className="absolute right-3 bottom-3 left-3 z-10 flex flex-wrap gap-2">
              <span className="rounded-md bg-white/80 px-2.5 py-1 text-xs text-neutral-800 shadow-sm backdrop-blur-sm">
                {c.category}
              </span>
              <span className="rounded-md bg-white/80 px-2.5 py-1 text-xs text-neutral-800 shadow-sm backdrop-blur-sm">
                {c.location}
              </span>
            </div>
          </div>

          <div className="p-5 md:p-6">
            <div className="mb-4">
              <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-neutral-900">
                {c.title}
              </h3>
              <p className="line-clamp-2 text-sm text-neutral-600">
                {c.description}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
              {c.validity ? (
                <div className="flex items-center text-xs text-neutral-500">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  <span>{c.validity}</span>
                </div>
              ) : (
                <span />
              )}

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

export default function CampaignsPage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-800">
      <section className="relative h-[450px] w-full overflow-hidden bg-neutral-900 md:h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"
          alt="Kampanyalar Hero"
          fill
          className="object-cover object-center opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-6xl">
              Kaçırılmayacak Fırsatlar
            </h1>
            <p className="mb-10 text-lg leading-relaxed font-light text-neutral-200 drop-shadow md:text-xl">
              En avantajlı seyahat fırsatlarını keşfedin. Sınırlı süreli
              kampanyalar ve özel indirimler sizi bekliyor.
            </p>

            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <div className="flex items-center rounded-lg bg-black/20 px-4 py-2 text-neutral-200 backdrop-blur-md">
                <Flame className="mr-1.5 h-4 w-4 text-orange-400" />
                <span className="font-medium">Acil Fırsatlar</span>
              </div>
              <div className="flex items-center rounded-lg bg-black/20 px-4 py-2 text-neutral-200 backdrop-blur-md">
                <Tag className="mr-1.5 h-4 w-4 text-sky-300" />
                <span className="font-medium">En Çok Tercih Edilenler</span>
              </div>
              <div className="flex items-center rounded-lg bg-black/20 px-4 py-2 text-neutral-200 backdrop-blur-md">
                <Sparkles className="mr-1.5 h-4 w-4 text-yellow-400" />
                <span className="font-medium">Özel Kampanyalar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="space-y-16 md:space-y-20">
          <section>
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Anlık Kampanyalar
              </h2>
              <span className="flex items-center rounded-md border border-neutral-200/80 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-500 sm:text-sm">
                <Clock className="mr-1.5 h-4 w-4 text-neutral-400" />
                Sürekli güncelleniyor
              </span>
            </div>
            <LiveCampaigns />
          </section>

          <section>
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                Tüm Kampanyalar
              </h2>
              <div className="flex items-center space-x-3">
                <span className="rounded-md border border-neutral-200/80 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-500 sm:text-sm">
                  {campaigns.length} kampanya
                </span>
              </div>
            </div>
            <CampaignsList items={campaigns} />
          </section>
        </div>
      </div>
    </main>
  );
}
