'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Filter,
  MapPin,
  Plus,
  Star,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import MembershipBadge from '@/components/features/tour/membership-badge';
import { ITEMS_PER_PAGE } from './activities-page.helpers';
import { ActivityCardSkeleton } from './activity-card-skeleton';
import { useActivitiesPageUi } from './activities-page-context';

/** Split from activities-page-client.tsx (Faz 7) — categories + grid; UI unchanged. */
export function ActivitiesPageListing() {
  const {
    selectedCategory,
    setSelectedCategory,
    categories,
    showAllCategories,
    setShowAllCategories,
    loading,
    displayedActivities,
    allFilteredActivities,
    activeFilters,
    removeFilter,
    resetFilters,
    loadMoreActivities,
  } = useActivitiesPageUi();

  return (
    <>
      {/* Kategori Butonları Güncellendi */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">
            Kategoriler
          </h3>
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="text-sky-600 hover:text-sky-800 text-xs font-medium flex items-center gap-1"
          >
            {showAllCategories ? 'Daha Az Göster' : 'Tümünü Göster'}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showAllCategories ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(showAllCategories ? categories : categories.slice(0, 6)).map(
            (category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-out ${selectedCategory === category.id ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80'}`}
              >
                {category.name}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-4">
          <span className="text-xs font-semibold text-neutral-600 mr-1">
            Aktif Filtreler:
          </span>
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="inline-flex items-center gap-1 bg-sky-100/80 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => removeFilter(filter.key)}
                className="ml-0.5 text-sky-600 hover:text-sky-800"
              >
                <X className="h-3 w-3 stroke-2" />
              </button>
            </div>
          ))}
          <button
            onClick={resetFilters}
            className="text-xs text-neutral-500 hover:text-rose-600 font-medium flex items-center gap-1 ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Filtreleri Temizle
          </button>
        </div>
      )}

      {/* Activity Listing Section Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-center gap-2">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-neutral-900 tracking-tight">
            Aktiviteler
          </h2>
          <p className="mt-0.5 text-xs text-neutral-600">
            {!loading && `${allFilteredActivities.length} aktivite bulundu.`}
          </p>
        </div>
      </div>

      {/* Loading / No Results / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
            <ActivityCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedActivities.length === 0 ? (
        <div className="mt-10 text-center">
          <div className="rounded-lg border-2 border-dashed border-neutral-300 p-12 bg-white">
            <Filter className="mx-auto h-10 w-10 text-neutral-400 mb-4" />
            <h3 className="text-base font-semibold text-neutral-800 mb-2">
              Sonuç Bulunamadı
            </h3>
            <p className="text-xs text-neutral-500 mb-4 max-w-xs mx-auto">
              Arama kriterlerinize uygun aktivite bulunamadı. Filtreleri
              değiştirmeyi veya temizlemeyi deneyin.
            </p>
            <button
              className="text-sky-600 hover:text-sky-800 font-medium text-xs flex items-center justify-center mx-auto gap-1"
              onClick={resetFilters}
            >
              <Trash2 className="w-3.5 h-3.5" /> Filtreleri Temizle
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {displayedActivities.map((experience) => (
              <Link
                href={`/activities/${experience.id}`}
                key={experience.id}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100/80 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={experience.imageUrl}
                    alt={experience.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Top Right Badge (Rating) */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-800">
                        {experience.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({experience.reviewCount})
                      </span>
                    </div>
                  </div>
                  {/* Top Left Badge (Category/Type) */}
                  {experience.category && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-blue-600 px-2.5 py-1 rounded-md shadow">
                      <span className="text-[11px] font-semibold text-white capitalize tracking-wide">
                        {experience.category}
                      </span>
                    </div>
                  )}
                  {/* Partner üyelik arması (müşteri değerlendirmelerinden otomatik hesaplanır) */}
                  <div
                    className={`absolute left-3 ${experience.category ? 'top-12' : 'top-3'}`}
                  >
                    <MembershipBadge
                      tier={experience.experienceOperator?.membershipTier}
                      variant="onImage"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-neutral-900 mb-1.5 line-clamp-2 group-hover:text-sky-700 transition-colors duration-200">
                    {experience.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
                    <span>{experience.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-3">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
                    <span>
                      {experience.duration}{' '}
                      {experience.durationHours
                        ? `(${experience.durationHours} sa)`
                        : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100/80">
                    {experience.price ? (
                      <span className="text-lg font-bold text-sky-600">
                        ₺{experience.price.toLocaleString('tr-TR')}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-neutral-500">
                        Fiyat Sorunuz
                      </span>
                    )}
                    <span className="inline-flex items-center px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-md transition-colors duration-200 cursor-pointer">
                      Detayları Gör
                      <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Load More Button */}
          {displayedActivities.length < allFilteredActivities.length && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMoreActivities}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Daha Fazla Yükle (
                {allFilteredActivities.length - displayedActivities.length} tane
                daha)
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
