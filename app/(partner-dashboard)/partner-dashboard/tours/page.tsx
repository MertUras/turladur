'use client';

import { useState, useEffect } from 'react';
import TourCard, { TourCardProps } from '@/app/components/partner-dashboard/TourCard';
import CreateTourButton from '@/app/components/partner-dashboard/CreateTourButton';
import TourFilters, { TourFilters as TourFiltersType } from '@/app/components/partner-dashboard/TourFilters';
import { 
  PlusIcon, 
  ArrowLongRightIcon, 
  ChartBarIcon, 
  CalendarDaysIcon, 
  ClipboardDocumentCheckIcon, 
  DocumentTextIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

// Örnek veri
const demoTours: Omit<TourCardProps, 'onEdit' | 'onDelete'>[] = [
  {
    id: '1',
    title: 'Kapadokya Balon Turu',
    price: '1.200₺',
    location: 'Kapadokya, Nevşehir',
    duration: '4 saat',
    maxParticipants: 6,
    imageUrl: 'https://source.unsplash.com/random/800x600/?cappadocia,balloon',
    status: 'active',
    rating: 4.8,
    reservationCount: 42
  },
  {
    id: '2',
    title: 'Pamukkale ve Hierapolis Turu',
    price: '850₺',
    location: 'Pamukkale, Denizli',
    duration: '1 gün',
    maxParticipants: 15,
    imageUrl: 'https://source.unsplash.com/random/800x600/?pamukkale',
    status: 'active',
    rating: 4.5,
    reservationCount: 36
  },
  {
    id: '3',
    title: 'Efes Antik Kenti Turu',
    price: '750₺',
    location: 'Selçuk, İzmir',
    duration: '1 gün',
    maxParticipants: 20,
    imageUrl: 'https://source.unsplash.com/random/800x600/?ephesus,ruins',
    status: 'active',
    rating: 4.7,
    reservationCount: 28
  },
  {
    id: '4',
    title: 'Boğaz Turu ve Yemek',
    price: '1.300₺',
    location: 'İstanbul',
    duration: '3 saat',
    maxParticipants: 10,
    imageUrl: 'https://source.unsplash.com/random/800x600/?istanbul,bosphorus',
    status: 'draft',
    rating: 4.6,
    reservationCount: 0
  },
  {
    id: '5',
    title: 'Kapadokya ATV Safari Turu',
    price: '600₺',
    location: 'Kapadokya, Nevşehir',
    duration: '2 saat',
    maxParticipants: 8,
    imageUrl: 'https://source.unsplash.com/random/800x600/?cappadocia,atv',
    status: 'active',
    rating: 4.9,
    reservationCount: 32
  },
  {
    id: '6',
    title: 'Safranbolu Kültür Turu',
    price: '1.100₺',
    location: 'Safranbolu, Karabük',
    duration: '2 gün 1 gece',
    maxParticipants: 12,
    imageUrl: 'https://source.unsplash.com/random/800x600/?safranbolu',
    status: 'archived',
    rating: 4.4,
    reservationCount: 18
  }
];

export default function ToursPage() {
  const [tours, setTours] = useState(demoTours);
  const [filteredTours, setFilteredTours] = useState(demoTours);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // İstatistikler
  const totalTours = tours.length;
  const activeTours = tours.filter(tour => tour.status === 'active').length;
  const draftTours = tours.filter(tour => tour.status === 'draft').length;
  const archivedTours = tours.filter(tour => tour.status === 'archived').length;
  const totalReservations = tours.reduce((acc, tour) => acc + (tour.reservationCount || 0), 0);
  const avgRating = tours.filter(tour => tour.rating).reduce((acc, tour) => acc + (tour.rating || 0), 0) / 
                    tours.filter(tour => tour.rating).length;

  useEffect(() => {
    // API'den veri çekme simülasyonu
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        // Gerçek API çağrısı burada yapılacak
        await new Promise(resolve => setTimeout(resolve, 500)); // Gecikme simülasyonu
        setIsLoading(false);
      } catch (error) {
        console.error('Turlar yüklenirken hata oluştu:', error);
        setIsLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Filtreleme işlemi
  const handleFilterChange = (filters: TourFiltersType) => {
    let filtered = [...tours];
    
    // Arama filtreleme
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        tour => 
          tour.title.toLowerCase().includes(searchLower) || 
          tour.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Durum filtreleme
    if (filters.status.length > 0) {
      filtered = filtered.filter(tour => filters.status.includes(tour.status));
    }
    
    // Sıralama
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, '')));
        break;
      case 'price_high':
        filtered.sort((a, b) => parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, '')));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.reservationCount || 0) - (a.reservationCount || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'oldest':
        filtered.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
    }
    
    setFilteredTours(filtered);
  };

  // Tur silme
  const handleDeleteTour = (id: string) => {
    const updatedTours = tours.filter(tour => tour.id !== id);
    setTours(updatedTours);
    setFilteredTours(prevFiltered => prevFiltered.filter(tour => tour.id !== id));
  };

  // Tur düzenleme - gerçek uygulamada sayfa yönlendirmesi yapılır
  const handleEditTour = (id: string) => {
    console.log(`Editing tour ${id}`);
    // Router'a yönlendirme burada yapılabilir
    // router.push(`/partner-dashboard/tours/edit/${id}`);
  };

  // Yenileme işlemi
  const handleRefresh = () => {
    setIsLoading(true);
    // API'den veri çekme simülasyonu
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Turlarım</h1>
          <p className="text-gray-500 mt-1 text-sm">Tüm turlarınızı görüntüleyin, düzenleyin ve yönetin</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
            aria-label="Yenile"
          >
            <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <CreateTourButton />
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2.5 bg-indigo-50 rounded-lg">
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-500">Toplam Tur</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">{totalTours}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-emerald-600 font-medium">{activeTours} aktif</span>
                <span className="text-xs text-gray-400 mx-1">•</span>
                <span className="text-xs text-amber-600 font-medium">{draftTours} taslak</span>
                <span className="text-xs text-gray-400 mx-1">•</span>
                <span className="text-xs text-gray-500 font-medium">{archivedTours} arşiv</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2.5 bg-amber-50 rounded-lg">
              <CalendarDaysIcon className="h-5 w-5 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-500">Toplam Rezervasyon</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">{totalReservations}</p>
              <p className="text-xs text-gray-400 mt-1">
                Tur başına {(totalReservations / (activeTours || 1)).toFixed(1)} rezervasyon
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2.5 bg-emerald-50 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-500">Ortalama Puan</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">{isNaN(avgRating) ? '-' : avgRating.toFixed(1)}</p>
              <div className="flex items-center mt-1">
                {!isNaN(avgRating) && (
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-3 h-3 ${i < Math.round(avgRating) ? 'text-amber-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2.5 bg-blue-50 rounded-lg">
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-500">Yeni Taslak</p>
              <p className="text-xl font-semibold text-gray-800 mt-1">{draftTours}</p>
              <p className="text-xs text-gray-400 mt-1">
                {draftTours > 0 ? 'Tamamlanmayı bekliyor' : 'Taslak tur bulunmuyor'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtreler */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <TourFilters onFilterChange={handleFilterChange} />
      </div>
      
      {/* Tur sayısı gösterimi */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          {filteredTours.length} tur gösteriliyor
          {isLoading && <span className="ml-2 inline-block w-4 h-4 border-2 border-t-indigo-600 border-indigo-200 rounded-full animate-spin"></span>}
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                view === 'grid' 
                  ? 'bg-indigo-50 text-indigo-700 border-r border-gray-200' 
                  : 'bg-white text-gray-700 border-r border-gray-200 hover:bg-gray-50'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                view === 'list' 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Liste
            </button>
          </div>
          {filteredTours.length > 0 && (
            <a href="/partner-dashboard/tours/create" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center transition-colors">
              Yeni Tur Oluştur
              <ArrowLongRightIcon className="h-4 w-4 ml-1" />
            </a>
          )}
        </div>
      </div>
      
      {/* Turlar */}
      {filteredTours.length > 0 ? (
        <div className={view === 'grid' 
          ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" 
          : "grid grid-cols-1 gap-3"
        }>
          {filteredTours.map((tour) => (
            <TourCard
              key={tour.id}
              {...tour}
              onEdit={handleEditTour}
              onDelete={handleDeleteTour}
              listView={view === 'list'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <PlusIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mt-4 text-base font-medium text-gray-800">Hiç tur bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
            {tours.length === 0 
              ? 'Henüz hiç tur oluşturmadınız. İlk turunuzu oluşturmak için aşağıdaki butona tıklayın.'
              : 'Filtreleri temizleyin veya yeni bir tur oluşturun'
            }
          </p>
          <div className="mt-6">
            <CreateTourButton variant={tours.length === 0 ? 'primary' : 'secondary'} />
          </div>
        </div>
      )}

      {/* Sayfalama */}
      {filteredTours.length > 0 && (
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
  );
} 