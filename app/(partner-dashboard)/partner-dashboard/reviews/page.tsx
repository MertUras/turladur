'use client';

import { useState } from 'react';
import { 
  StarIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import ReviewCard, { ReviewCardProps } from '@/app/components/partner-dashboard/ReviewCard';

// Demo veriler
const demoReviews: ReviewCardProps[] = [
  {
    id: '1',
    customerName: 'Ahmet Yılmaz',
    customerImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    tourName: 'Kapadokya Balon Turu',
    tourId: '1',
    rating: 5,
    reviewDate: '15 Ağustos 2023',
    reviewText: "Hayatımda yaşadığım en güzel deneyimlerden biriydi! Güneş doğarken Kapadokya'nın üzerinde süzülmek inanılmazdı. Rehberimiz çok profesyoneldi ve güvenliğimiz her zaman ön plandaydı. Kesinlikle herkese tavsiye ederim!",
    isResponded: true,
    responseText: "Değerli yorumunuz için teşekkür ederiz! Sizinle bu deneyimi paylaşmaktan mutluluk duyduk. Tekrar görüşmek dileğiyle."
  },
  {
    id: '2',
    customerName: 'Zeynep Şahin',
    customerImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    tourName: 'Pamukkale ve Hierapolis Turu',
    tourId: '2',
    rating: 4,
    reviewDate: '22 Temmuz 2023',
    reviewText: "Pamukkale travertenleri gerçekten görülmeye değer. Hierapolis antik kenti de çok etkileyiciydi. Tek sorun öğle yemeğinin biraz acele olmasıydı, daha fazla zaman ayırabilirdik. Onun dışında harikaydı.",
    isResponded: false
  },
  {
    id: '3',
    customerName: 'Mehmet Kaya',
    customerImage: 'https://randomuser.me/api/portraits/men/41.jpg',
    tourName: 'Efes Antik Kenti Turu',
    tourId: '3',
    rating: 5,
    reviewDate: '3 Ağustos 2023',
    reviewText: "Efes her zaman görmek istediğim bir yerdi ve beklentilerimi fazlasıyla karşıladı. Rehberimiz tarihi çok iyi biliyordu ve çok şey öğrendim. Celcius Kütüphanesi önünde çektiğim fotoğraflar harika oldu!",
    isResponded: true,
    responseText: "Değerli yorumunuz için teşekkür ederiz Mehmet Bey. Efes'in muhteşem tarihini sizinle paylaşmak bizim için bir zevkti. Başka turlarımızda da görüşmek dileğiyle!"
  },
  {
    id: '4',
    customerName: 'Ayşe Demir',
    tourName: 'Boğaz Turu ve Yemek',
    tourId: '4',
    rating: 3,
    reviewDate: '10 Temmuz 2023',
    reviewText: "Manzara ve yemek güzeldi fakat tekne biraz kalabalıktı. Daha az kişiyle yapılan bir tur olsa çok daha keyifli olabilirdi. Yine de İstanbul Boğazı'nı görmek harikaydı.",
    isResponded: false
  },
  {
    id: '5',
    customerName: 'Can Öztürk',
    tourName: 'Kapadokya ATV Safari Turu',
    tourId: '5',
    rating: 5,
    reviewDate: '5 Eylül 2023',
    reviewText: "İnanılmaz bir deneyimdi! ATV ile vadileri keşfetmek çok eğlenceliydi. Güvenlik önlemleri üst düzeydi ve ekipman kaliteliydi. Güzel manzaralarda durup fotoğraf çekmek için yeterli vakit tanındı. Kesinlikle tekrar yapacağım bir aktivite!",
    isResponded: false
  }
];

// Rating filtre seçenekleri
const ratingOptions = [
  { value: 'all', label: 'Tüm Puanlar' },
  { value: '5', label: '5 Yıldız' },
  { value: '4', label: '4 Yıldız' },
  { value: '3', label: '3 Yıldız' },
  { value: '2', label: '2 Yıldız' },
  { value: '1', label: '1 Yıldız' }
];

// Response durum filtre seçenekleri
const responseOptions = [
  { value: 'all', label: 'Tüm Değerlendirmeler' },
  { value: 'responded', label: 'Yanıtlananlar' },
  { value: 'not_responded', label: 'Yanıtlanmayanlar' }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(demoReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedResponseStatus, setSelectedResponseStatus] = useState<string>('all');

  // Arama işlemi
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filtreleme işlemi
  const filteredReviews = reviews.filter(review => {
    // Arama kriteri
    const matchesSearch = searchTerm.trim() === '' ||
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewText.toLowerCase().includes(searchTerm.toLowerCase());

    // Puan filtreleme
    const matchesRating = selectedRating === 'all' || review.rating === parseInt(selectedRating);

    // Yanıt durumu filtreleme
    const matchesResponseStatus = 
      selectedResponseStatus === 'all' || 
      (selectedResponseStatus === 'responded' && review.isResponded) ||
      (selectedResponseStatus === 'not_responded' && !review.isResponded);

    return matchesSearch && matchesRating && matchesResponseStatus;
  });

  // Özet verileri
  const reviewStats = {
    total: reviews.length,
    averageRating: (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1),
    fiveStarCount: reviews.filter(review => review.rating === 5).length,
    fiveStarPercentage: Math.round((reviews.filter(review => review.rating === 5).length / reviews.length) * 100),
    respondedCount: reviews.filter(review => review.isResponded).length,
    respondedPercentage: Math.round((reviews.filter(review => review.isResponded).length / reviews.length) * 100)
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Değerlendirmeler</h1>
        <button
          type="button"
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ChartBarIcon className="h-5 w-5 mr-2" />
          Raporları Görüntüle
        </button>
      </div>

      {/* Değerlendirme İstatistikleri */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-50 rounded-full p-3">
              <StarIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Toplam Değerlendirme</p>
              <h2 className="text-2xl font-bold text-gray-900">{reviewStats.total}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-50 rounded-full p-3">
              <div className="text-yellow-600 font-bold">★</div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Ortalama Puan</p>
              <h2 className="text-2xl font-bold text-gray-900">{reviewStats.averageRating}</h2>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-50 rounded-full p-3">
              <div className="text-green-600 font-bold">5★</div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">5 Yıldız Oranı</p>
              <h2 className="text-2xl font-bold text-gray-900">{reviewStats.fiveStarPercentage}%</h2>
              <p className="text-xs text-gray-500">{reviewStats.fiveStarCount} değerlendirme</p>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-50 rounded-full p-3">
              <div className="text-blue-600 font-bold">✓</div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Yanıtlama Oranı</p>
              <h2 className="text-2xl font-bold text-gray-900">{reviewStats.respondedPercentage}%</h2>
              <p className="text-xs text-gray-500">{reviewStats.respondedCount} yanıtlanmış</p>
            </div>
          </div>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex-1 min-w-0">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Değerlendirmelerde ara..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`inline-flex items-center px-4 py-2 border ${showFilters ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-700'} text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtreler
            </button>
          </div>
        </div>

        {/* Filtre Seçenekleri */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Puan</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ratingOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedRating(option.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                        selectedRating === option.value
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Yanıt Durumu</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {responseOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedResponseStatus(option.value)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                        selectedResponseStatus === option.value
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Değerlendirme Kartları */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Değerlendirme bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Farklı bir arama veya filtre deneyin
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 