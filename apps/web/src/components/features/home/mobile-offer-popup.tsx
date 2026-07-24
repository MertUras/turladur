'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function MobileOfferPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const popupClosed = localStorage.getItem('mobileOfferPopupClosed');
      if (!popupClosed) {
        const timer = setTimeout(() => {
          setIsVisible(true);
          setAnimationClass('animate-in');
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const closePopup = () => {
    setAnimationClass('animate-out');
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('mobileOfferPopupClosed', Date.now().toString());
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${animationClass}`}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closePopup}
        onKeyDown={(e) => e.key === 'Escape' && closePopup()}
        role="presentation"
      />

      <div className="relative w-full max-w-xs overflow-hidden rounded-xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={closePopup}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-700 transition-colors hover:bg-white"
          aria-label="Kapat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="relative h-40 w-full">
          <Image
            src="https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1925"
            alt="Sınırlı zaman teklifi"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="mb-2 flex w-max items-center rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white">
              SINIRLI SÜRE
            </div>
            <h3 className="text-xl font-bold text-white">
              Mobil&apos;e Özel Fırsat!
            </h3>
            <p className="text-sm text-white/90">
              İndirim kodunu hemen kullanın.
            </p>
          </div>
        </div>

        <div className="p-4">
          <div className="relative mb-4 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-3 text-center">
            <span className="block text-xs font-medium text-neutral-700">
              KUPON KODU
            </span>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-xl font-bold tracking-wider text-neutral-950">
                MOBIL25
              </span>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText('MOBIL25');
                }}
                className="text-neutral-700 hover:text-neutral-900"
                aria-label="Kodu kopyala"
              >
                Kopyala
              </button>
            </div>
            <span className="mt-1 block text-xs font-medium text-neutral-700">
              %25 indirim kazanın
            </span>
          </div>

          <Link
            href="/tours"
            onClick={closePopup}
            className="mb-2 block w-full rounded-lg bg-neutral-950 px-4 py-3 text-center font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Fırsatları Keşfedin
          </Link>

          <p className="px-2 text-center text-xs text-neutral-500">
            Diğer kampanyalarla birleştirilemez.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MobileOfferPopup;
