'use client';

import { Search, X } from 'lucide-react';
import { useToursPageUi } from './tours-page-context';

const TOURS_RESULTS_ANCHOR_ID = 'tours-results';

function scrollToToursResults() {
  document.getElementById(TOURS_RESULTS_ANCHOR_ID)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

/** Split from tours-page-client.tsx (Faz 7) — hero; UI unchanged. */
export function ToursPageHero() {
  const { searchTerm, setSearchTerm, setLoading } = useToursPageUi();

  function handleSearch() {
    setLoading(true);
    scrollToToursResults();
    setTimeout(() => setLoading(false), 500);
  }

  return (
    <div className="relative bg-gradient-to-r from-neutral-900 to-neutral-950 pt-28 pb-12 md:pb-20">
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='2'/%3E%3Ccircle cx='13' cy='13' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 relative">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center bg-neutral-950/30 backdrop-blur-sm text-neutral-200 rounded-full py-1.5 px-4 text-xs font-medium mb-4">
            <span className="w-2 h-2 bg-neutral-300 rounded-full mr-2"></span>
            En İyi Tur Deneyimleri
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Türkiye&apos;nin <span className="text-white/90">En İyi</span>{' '}
            Turları
          </h1>
          <p className="text-lg text-neutral-200 md:px-8 mb-8">
            Profesyonel rehberler eşliğinde, en iyi tur operatörlerinin özenle
            hazırladığı tur paketleri ile unutulmaz deneyimler yaşayın.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-neutral-600 blur-xl opacity-20 rounded-xl"></div>
            <div className="relative flex bg-white rounded-xl p-1.5 shadow-xl">
              <div className="flex-1 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Tur adı, destinasyon veya aktivite ara..."
                  className="w-full py-3 px-2 outline-none text-gray-700 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                className="bg-neutral-950 hover:bg-neutral-800 text-white font-medium rounded-lg px-5 py-3 transition-colors flex items-center"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                Ara
              </button>
            </div>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">100+</div>
            <div className="text-sm text-neutral-200">Tur Rotası</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">50+</div>
            <div className="text-sm text-neutral-200">Tur Operatörü</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">4.8/5</div>
            <div className="text-sm text-neutral-200">Müşteri Puanı</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-neutral-200">Müşteri Desteği</div>
          </div>
        </div>
      </div>
    </div>
  );
}
