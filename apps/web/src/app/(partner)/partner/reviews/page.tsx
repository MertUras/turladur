'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, Search, SlidersHorizontal, Star } from 'lucide-react';

import {
  ReviewCard,
  type ReviewCardProps,
} from '@/components/features/partner-dashboard/review-card';
import { resolveCategoryFeedback } from '@/lib/partner/reviews/client';
import {
  listPartnerReviews,
  replyPartnerReview,
  type PartnerReviewItem,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

const ratingOptions = [
  { id: 'all', name: 'Tüm Puanlar' },
  { id: '5', name: '5 Yıldız' },
  { id: '4', name: '4 Yıldız' },
  { id: '3', name: '3 Yıldız' },
  { id: '2', name: '2 Yıldız' },
  { id: '1', name: '1 Yıldız' },
];

const responseOptions = [
  { id: 'all', name: 'Tüm Değerlendirmeler' },
  { id: 'responded', name: 'Yanıtlananlar' },
  { id: 'not_responded', name: 'Yanıtlanmayanlar' },
];

const sortOptions = [
  { id: 'newest', name: 'En Yeni' },
  { id: 'oldest', name: 'En Eski' },
  { id: 'highest', name: 'En Yüksek Puan' },
  { id: 'lowest', name: 'En Düşük Puan' },
];

const EMPTY_CATEGORY_RATINGS = {
  guideRating: null,
  operatorRating: null,
  routeRating: null,
  foodRating: null,
  hotelRating: null,
  transportRating: null,
} as const;

const EMPTY_CATEGORY_FEEDBACK = {
  guideFeedback: null,
  operatorFeedback: null,
  routeFeedback: null,
  foodFeedback: null,
  hotelFeedback: null,
  transportFeedback: null,
} as const;

function mapReviewToCard(
  review: PartnerReviewItem,
): ReviewCardProps & { reviewDateRaw: string } {
  return {
    id: review.id,
    customerName: review.customerName,
    customerImage: review.customerImage ?? undefined,
    tourName: review.tourName,
    tourId: review.tourId,
    productType: review.productType,
    rating: review.rating,
    categoryRatings: review.categoryRatings,
    categoryFeedback: resolveCategoryFeedback(
      review.categoryRatings ?? EMPTY_CATEGORY_RATINGS,
      review.categoryFeedback ?? EMPTY_CATEGORY_FEEDBACK,
    ),
    reviewDate: review.reviewDate,
    reviewText: review.reviewText,
    isResponded: review.isResponded,
    responseText: review.responseText,
    reviewDateRaw: review.reviewDateRaw,
  };
}

function formatLastUpdated(date: Date): string {
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export default function ReviewsPage() {
  const { accessToken } = useAuth();
  const [reviews, setReviews] = useState<PartnerReviewItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    responded: 0,
    pending: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedResponseStatus, setSelectedResponseStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');

  const refetch = useCallback(async () => {
    if (!accessToken) return;
    setIsRefreshing(true);
    setError(null);
    try {
      const data = await listPartnerReviews(accessToken);
      setReviews(data.reviews);
      setStats(data.stats);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Değerlendirmeler yüklenemedi',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const reviewCards = reviews.map(mapReviewToCard);

  const handleReplySuccess = () => {
    void refetch();
  };

  const filteredReviews = reviewCards
    .filter((review) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.reviewText.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating =
        selectedRating === 'all' ||
        review.rating === parseInt(selectedRating, 10);

      const matchesResponseStatus =
        selectedResponseStatus === 'all' ||
        (selectedResponseStatus === 'responded' && review.isResponded) ||
        (selectedResponseStatus === 'not_responded' && !review.isResponded);

      return matchesSearch && matchesRating && matchesResponseStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return (
          new Date(b.reviewDateRaw).getTime() -
          new Date(a.reviewDateRaw).getTime()
        );
      }
      if (sortBy === 'oldest') {
        return (
          new Date(a.reviewDateRaw).getTime() -
          new Date(b.reviewDateRaw).getTime()
        );
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen pb-12 flex items-center justify-center">
        <p className="text-gray-500">Değerlendirmeler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Değerlendirmeler
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Tüm turlara ait müşteri değerlendirmelerini görüntüleyin ve
              yanıtlayın
            </p>
            {lastUpdated ? (
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                {isRefreshing ? (
                  <span className="inline-flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                ) : null}
                Son güncelleme: {formatLastUpdated(lastUpdated)}
              </p>
            ) : null}
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0 items-center">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="rounded-lg border border-gray-200 text-sm text-gray-700 bg-white px-3 py-2 shadow-sm"
              aria-label="Dışa aktarma formatı"
            >
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Raporu İndir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            label="Toplam Değerlendirme"
            value={String(stats.total)}
            icon={<Star className="h-5 w-5 text-indigo-600" />}
            iconBg="bg-indigo-50"
          />
          <StatCard
            label="Ortalama Puan"
            value={`${stats.averageRating.toFixed(1)} / 5`}
            icon={<Star className="h-5 w-5 text-amber-500 fill-amber-500" />}
            iconBg="bg-amber-50"
          />
          <StatCard
            label="Yanıtlanan"
            value={String(stats.responded)}
            icon={<span className="text-emerald-500 font-bold text-lg">✓</span>}
            iconBg="bg-emerald-50"
          />
          <StatCard
            label="Bekleyen"
            value={String(stats.pending)}
            icon={<span className="text-blue-500 font-bold text-lg">…</span>}
            iconBg="bg-blue-50"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg"
                  placeholder="Değerlendirmelerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:ml-4">
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="rounded-lg border border-gray-200 text-sm px-3 py-2 bg-white"
                aria-label="Puan filtresi"
              >
                {ratingOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedResponseStatus}
                onChange={(e) => setSelectedResponseStatus(e.target.value)}
                className="rounded-lg border border-gray-200 text-sm px-3 py-2 bg-white"
                aria-label="Yanıt durumu filtresi"
              >
                {responseOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-gray-200 text-sm px-3 py-2 bg-white"
                aria-label="Sıralama"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className={`inline-flex items-center px-4 py-2.5 border ${
                  showFilters
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-700'
                } text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-all duration-200`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtreler
              </button>
            </div>
          </div>

          {showFilters ? (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Puan
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedRating(option.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          selectedRating === option.id
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Yanıt Durumu
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {responseOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedResponseStatus(option.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          selectedResponseStatus === option.id
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Sıralama
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSortBy(option.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                          sortBy === option.id
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {filteredReviews.length} değerlendirme gösteriliyor
          </p>
          {filteredReviews.length > 0 ? (
            <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
              Sayfa 1 / 1
            </span>
          ) : null}
        </div>

        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                {...review}
                onReplySuccess={handleReplySuccess}
                onReply={
                  accessToken
                    ? async (id, text) => {
                        await replyPartnerReview(id, text, accessToken);
                      }
                    : undefined
                }
              />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-800">
                Değerlendirme bulunamadı
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                {reviews.length === 0
                  ? 'Henüz müşteri değerlendirmesi bulunmuyor'
                  : 'Farklı bir arama veya filtre deneyin'}
              </p>
            </div>
          )}
        </div>

        {filteredReviews.length > 0 ? (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex shadow-sm rounded-lg overflow-hidden">
              <button
                type="button"
                className="px-4 py-2 border-r border-gray-200 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 transition-colors"
              >
                Önceki
              </button>
              <span className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border-r border-gray-200">
                1
              </span>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 transition-colors"
              >
                Sonraki
              </button>
            </nav>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-2.5 rounded-lg ${iconBg}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="text-xl font-semibold text-gray-800 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}
