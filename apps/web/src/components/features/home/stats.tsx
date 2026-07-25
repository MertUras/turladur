'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Users, Ticket, Smile, DollarSign, ArrowRight } from 'lucide-react';

const stats = [
  {
    id: 1,
    title: 'Aktif Kullanıcı',
    value: 2500,
    suffix: '+',
    description: 'Platformumuzu düzenli kullanan gezgin',
    icon: Users,
    color: 'sky',
  },
  {
    id: 2,
    title: 'Gerçekleşen Rezervasyon',
    value: 3850,
    suffix: '+',
    description: 'Son 3 ayda yapılan toplam rezervasyon',
    icon: Ticket,
    color: 'emerald',
  },
  {
    id: 3,
    title: 'Müşteri Memnuniyeti',
    value: 98,
    suffix: '%',
    description: 'Müşteri anketlerinden alınan ortalama puan',
    icon: Smile,
    color: 'amber',
  },
  {
    id: 4,
    title: 'Ortalama Fırsat İndirimi',
    value: 25,
    suffix: '%',
    description: 'Öne çıkan turlardaki ortalama indirim',
    icon: DollarSign,
    color: 'rose',
  },
];

export function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = statsRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const colorClasses = {
    sky: { bg: 'bg-neutral-100', text: 'text-neutral-950' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600' },
  };

  return (
    <section
      ref={statsRef}
      className={`bg-white py-24 transition-opacity duration-1000 ease-out md:py-32 ${isVisible ? 'opacity-100' : 'translate-y-4 opacity-0'}`}
    >
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800">
            Başarı Hikayemiz
          </div>
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            Rakamlarla turta
          </h2>
          <p className="text-lg text-neutral-600">
            Binlerce mutlu gezgin, unutulmaz anılar ve sürekli büyüyen bir
            topluluk. Size en iyi seyahat deneyimini sunmak için buradayız.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const colors =
              colorClasses[stat.color as keyof typeof colorClasses] ||
              colorClasses.sky;
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className={`rounded-xl border border-neutral-200/70 bg-white p-6 transition-all duration-300 ease-out hover:border-neutral-300 hover:shadow-sm ${isVisible ? `animate-fadeInUp delay-${index * 100}` : 'translate-y-3 opacity-0'}`}
              >
                <div className="mb-3 flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${colors.bg}`}
                  >
                    <IconComponent className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <p className="text-3xl font-semibold text-neutral-900">
                    {stat.value.toLocaleString('tr-TR')}
                    <span className={`text-xl ${colors.text}`}>
                      {stat.suffix}
                    </span>
                  </p>
                </div>
                <p className="mb-1.5 text-sm font-medium text-neutral-700">
                  {stat.title}
                </p>
                <p className="text-xs leading-relaxed text-neutral-500">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center md:mt-20">
          <p className="mx-auto mb-6 max-w-2xl text-base text-neutral-600">
            Türkiye&apos;nin dört bir yanındaki eşsiz destinasyonları ve
            aktiviteleri keşfedin. Özel fırsatlar ve unutulmaz deneyimler sizi
            bekliyor.
          </p>

          <div className="mx-auto flex max-w-xs flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center">
            <Link
              href="/tours"
              className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-950 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 sm:w-auto"
            >
              Turları Keşfet
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
            <Link
              href="/activities"
              className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-950 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 sm:w-auto"
            >
              Aktiviteleri Keşfet
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
