'use client';

import { useState } from 'react';
import { StarIcon, MapPinIcon, CalendarIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface Tour {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  bookedCount: number;
  rating: number;
  status: 'active' | 'draft' | 'completed' | 'cancelled';
  category: string;
  image: string;
}

const mockTours: Tour[] = [
  {
    id: '1',
    name: 'Kapadokya Balon Turu',
    location: 'Nevşehir, Kapadokya',
    startDate: '2024-04-15',
    endDate: '2024-04-17',
    price: 2500,
    capacity: 20,
    bookedCount: 15,
    rating: 4.8,
    status: 'active',
    category: 'Doğa',
    image: 'https://images.unsplash.com/photo-1533619043865-1f0c0b5b0b5b'
  },
  {
    id: '2',
    name: 'Ege Turu',
    location: 'İzmir, Çeşme',
    startDate: '2024-05-01',
    endDate: '2024-05-05',
    price: 3500,
    capacity: 30,
    bookedCount: 25,
    rating: 4.6,
    status: 'active',
    category: 'Deniz',
    image: 'https://images.unsplash.com/photo-1533619043865-1f0c0b5b0b5b'
  },
  {
    id: '3',
    name: 'Doğu Anadolu Turu',
    location: 'Van, İshak Paşa Sarayı',
    startDate: '2024-06-10',
    endDate: '2024-06-15',
    price: 4200,
    capacity: 25,
    bookedCount: 18,
    rating: 4.9,
    status: 'active',
    category: 'Kültür',
    image: 'https://images.unsplash.com/photo-1533619043865-1f0c0b5b0b5b'
  }
];

const TourList = () => {
  const [selectedTours, setSelectedTours] = useState<string[]>([]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getStatusColor = (status: Tour['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  const handleSelectTour = (tourId: string) => {
    setSelectedTours(prev =>
      prev.includes(tourId)
        ? prev.filter(id => id !== tourId)
        : [...prev, tourId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTours(prev =>
      prev.length === mockTours.length
        ? []
        : mockTours.map(tour => tour.id)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedTours.length === mockTours.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tur Bilgileri
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiyat
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kapasite
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puan
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockTours.map((tour) => (
              <tr key={tour.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedTours.includes(tour.id)}
                    onChange={() => handleSelectTour(tour.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-lg object-cover"
                        src={tour.image}
                        alt={tour.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{tour.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {tour.location}
                      </div>
                      <div className="text-xs text-gray-500">{tour.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {formatDate(tour.startDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(tour.endDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    {formatCurrency(tour.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    {tour.bookedCount} / {tour.capacity}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(tour.bookedCount / tour.capacity) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tour.status)}`}>
                    {tour.status === 'active' && 'Aktif'}
                    {tour.status === 'draft' && 'Taslak'}
                    {tour.status === 'completed' && 'Tamamlandı'}
                    {tour.status === 'cancelled' && 'İptal Edildi'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-900">{tour.rating}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TourList; 