'use client';

import { ModernTourCard } from './modern-tour-card';
import { ToursLoadingSkeleton } from './tours-loading-skeleton';
import { ToursNoResults } from './tours-no-results';
import { useToursPageUi } from './tours-page-context';

/** Split from tours-page-client.tsx (Faz 7) — results list; UI unchanged. */
export function ToursPageResults() {
  const {
    view,
    setView,
    sortBy,
    handleSortChange,
    isLoading,
    itemsPerPage,
    filteredTours,
    currentTours,
    totalItems,
    totalTours,
    currentPage,
    totalPages,
    resetFilters,
    handlePageChange,
    fetchError,
  } = useToursPageUi();

  return (
    <div className="flex-1 min-w-0">
      {/* Başlık ve Filtreler */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Tüm Turlar</h1>
          <div className="h-1 w-16 bg-neutral-950"></div>
        </div>
        {/* Görünüm Seçenekleri */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'grid'
                ? 'bg-neutral-100 text-neutral-950'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${
              view === 'list'
                ? 'bg-neutral-100 text-neutral-950'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Sıralama Seçenekleri */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-neutral-950 focus:border-neutral-950"
          >
            <option value="popular">Popülerliğe Göre</option>
            <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
            <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
            <option value="date">Tarihe Göre</option>
            <option value="rating">Puana Göre</option>
          </select>
        </div>

        <div className="text-sm text-gray-600">
          {totalTours > 0 ? (
            <>
              Toplam{' '}
              <span className="font-semibold text-gray-800">{totalTours}</span>{' '}
              tur bulundu
            </>
          ) : (
            <span className="text-gray-500">Gösterilecek tur bulunamadı</span>
          )}
        </div>
      </div>

      {/* Yükleme Durumu */}
      {fetchError ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {fetchError}
        </div>
      ) : null}
      {isLoading ? (
        <ToursLoadingSkeleton itemsPerPage={itemsPerPage} />
      ) : filteredTours.length === 0 ? (
        <ToursNoResults onReset={resetFilters} />
      ) : (
        <>
          {/* Tur Kartları */}
          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {currentTours.map((tour) => (
                <ModernTourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {currentTours.map((tour) => (
                <ModernTourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}

          {/* Sayfalama */}
          {totalItems > itemsPerPage && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                >
                  Önceki
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-neutral-950 text-white'
                          : 'border hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
