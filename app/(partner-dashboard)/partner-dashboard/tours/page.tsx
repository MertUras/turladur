'use client';

import { useState } from 'react';
import TourCard, { TourCardProps } from '@/app/components/partner-dashboard/TourCard';
import CreateTourButton from '@/app/components/partner-dashboard/CreateTourButton';
import TourFilters, { TourFilters as TourFiltersType } from '@/app/components/partner-dashboard/TourFilters';
import { PlusIcon } from '@heroicons/react/24/outline';

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
      // Tarih sıralaması için gerçek bir API'den alınan veriye ihtiyaç var
      // Şimdilik id'ye göre sıralıyoruz
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
    setFilteredTours(updatedTours);
  };

  // Tur düzenleme - gerçek uygulamada sayfa yönlendirmesi yapılır
  const handleEditTour = (id: string) => {
    console.log(`Editing tour ${id}`);
    // Router'a yönlendirme burada yapılabilir
    // router.push(`/partner-dashboard/tours/edit/${id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Turlarım</h1>
        <div className="mt-3 sm:mt-0">
          <CreateTourButton />
        </div>
      </div>
      
      {/* Filtreler */}
      <TourFilters onFilterChange={handleFilterChange} />
      
      {/* Turlar */}
      {filteredTours.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTours.map((tour) => (
            <TourCard
              key={tour.id}
              {...tour}
              onEdit={handleEditTour}
              onDelete={handleDeleteTour}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <PlusIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Hiç tur bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Filtreleri temizleyin veya yeni bir tur oluşturun
          </p>
          <div className="mt-6">
            <CreateTourButton />
          </div>
        </div>
      )}
    </div>
  );
} 