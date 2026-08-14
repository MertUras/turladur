'use client';

import { Search, ChevronRight } from 'lucide-react';

/** Split from tours-page-client.tsx (Faz 7) — empty results; UI unchanged. */
export function ToursNoResults({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-8 text-center"
      role="alert"
      aria-live="polite"
    >
      <div className="mx-auto w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        <Search className="w-10 h-10 text-neutral-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Tur bulunamadı</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Arama kriterlerinize uygun tur bulunamadı. Farklı filtreler deneyebilir
        veya tüm filtreleri temizleyebilirsiniz.
      </p>
      <button
        onClick={onReset}
        className="bg-neutral-950 hover:bg-neutral-800 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center transition-colors"
        aria-label="Tüm filtreleri temizle"
      >
        Tüm filtreleri temizle
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
}
