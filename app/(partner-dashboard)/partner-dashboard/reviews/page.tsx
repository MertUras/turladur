'use client';

import { useState, Fragment } from 'react';
import { 
  StarIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { Transition, Menu, Popover } from '@headlessui/react';
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
  { id: 'all', name: 'Tüm Puanlar' },
  { id: '5', name: '5 Yıldız' },
  { id: '4', name: '4 Yıldız' },
  { id: '3', name: '3 Yıldız' },
  { id: '2', name: '2 Yıldız' },
  { id: '1', name: '1 Yıldız' }
];

// Response durum filtre seçenekleri
const responseOptions = [
  { id: 'all', name: 'Tüm Değerlendirmeler' },
  { id: 'responded', name: 'Yanıtlananlar' },
  { id: 'not_responded', name: 'Yanıtlanmayanlar' }
];

// Sıralama seçenekleri
const sortOptions = [
  { id: 'newest', name: 'En Yeni' },
  { id: 'oldest', name: 'En Eski' },
  { id: 'highest', name: 'En Yüksek Puan' },
  { id: 'lowest', name: 'En Düşük Puan' }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(demoReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedResponseStatus, setSelectedResponseStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Arama işlemi
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filtreleme ve sıralama işlemi
  const filteredReviews = reviews
    .filter(review => {
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
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime();
      } else if (sortBy === 'highest') {
        return b.rating - a.rating;
      } else if (sortBy === 'lowest') {
        return a.rating - b.rating;
      }
      return 0;
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
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Üst Bölüm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Değerlendirmeler</h1>
            <p className="text-gray-500 mt-1 text-sm">Tüm turlara ait müşteri değerlendirmelerini görüntüleyin ve yanıtlayın</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all duration-200">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Raporu İndir
                  <ChevronDownIcon className="h-4 w-4 ml-2 opacity-70" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`${
                          active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                        } block px-4 py-2.5 text-sm`}
                      >
                        Excel (.xlsx)
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`${
                          active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                        } block px-4 py-2.5 text-sm`}
                      >
                        PDF
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={`${
                          active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                        } block px-4 py-2.5 text-sm`}
                      >
                        CSV
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Değerlendirme İstatistikleri */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2.5 bg-indigo-50 rounded-lg">
                <StarIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-gray-500">Toplam Değerlendirme</p>
                <p className="text-xl font-semibold text-gray-800 mt-1">{reviewStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2.5 bg-amber-50 rounded-lg">
                <div className="text-amber-500 font-bold text-lg">★</div>
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-gray-500">Ortalama Puan</p>
                <p className="text-xl font-semibold text-gray-800 mt-1">{reviewStats.averageRating} / 5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2.5 bg-emerald-50 rounded-lg">
                <div className="text-emerald-500 font-bold text-lg">5★</div>
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-gray-500">5 Yıldız Oranı</p>
                <p className="text-xl font-semibold text-gray-800 mt-1">{reviewStats.fiveStarPercentage}%</p>
                <p className="text-xs text-gray-400 mt-0.5">{reviewStats.fiveStarCount} değerlendirme</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2.5 bg-blue-50 rounded-lg">
                <div className="text-blue-500 font-bold text-lg">✓</div>
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium text-gray-500">Yanıtlama Oranı</p>
                <p className="text-xl font-semibold text-gray-800 mt-1">{reviewStats.respondedPercentage}%</p>
                <p className="text-xs text-gray-400 mt-0.5">{reviewStats.respondedCount} yanıtlanmış</p>
              </div>
            </div>
          </div>
        </div>

        {/* Arama ve Filtreler */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2.5 text-sm border-gray-200 rounded-lg"
                  placeholder="Değerlendirmelerde ara..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`inline-flex items-center px-4 py-2.5 border ${showFilters ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700'} text-sm font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-all duration-200`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Filtreler
              </button>
            </div>
          </div>

          {/* Filtre Seçenekleri */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Puan</label>
                  <div className="flex flex-wrap gap-2">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.id}
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
                  <label className="block text-xs font-medium text-gray-700 mb-2">Yanıt Durumu</label>
                  <div className="flex flex-wrap gap-2">
                    {responseOptions.map((option) => (
                      <button
                        key={option.id}
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
                  <label className="block text-xs font-medium text-gray-700 mb-2">Sıralama</label>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
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
          )}
        </div>

        {/* Sonuç Sayısı */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {filteredReviews.length} değerlendirme gösteriliyor
          </p>
          {filteredReviews.length > 0 && (
            <span className="text-xs text-gray-400 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
              Sayfa 1 / 1
            </span>
          )}
        </div>

        {/* Değerlendirme Kartları */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-base font-medium text-gray-800">Değerlendirme bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                Farklı bir arama veya filtre deneyin
              </p>
            </div>
          )}
        </div>

        {/* Sayfalama */}
        {filteredReviews.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex shadow-sm rounded-lg overflow-hidden">
              <button className="px-4 py-2 border-r border-gray-200 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 transition-colors">
                Önceki
              </button>
              <span className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border-r border-gray-200">
                1
              </span>
              <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 transition-colors">
                Sonraki
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 