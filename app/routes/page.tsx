'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const popularRoutes = [
  {
    id: 1,
    name: 'Kapadokya',
    description: 'Peri bacaları, yeraltı şehirleri ve balon turlarıyla unutulmaz bir deneyim.',
    image: 'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    duration: '3-4 gün',
    bestTimeToVisit: 'Nisan - Ekim',
    highlights: ['Balon Turu', 'Yeraltı Şehirleri', 'Şarap Tadımı', 'At Turu'],
    priceRange: '₺2,500 - ₺4,000',
    tourCount: 12,
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 2,
    name: 'Likya Yolu',
    description: 'Antik Likya uygarlığının izlerini takip eden, deniz manzaralı yürüyüş rotası.',
    image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    duration: '7-8 gün',
    bestTimeToVisit: 'Mart - Mayıs, Eylül - Kasım',
    highlights: ['Antik Kentler', 'Deniz Manzarası', 'Doğa Yürüyüşü', 'Plajlar'],
    priceRange: '₺3,500 - ₺5,000',
    tourCount: 8,
    rating: 4.7,
    reviews: 78,
  },
  {
    id: 3,
    name: 'Pamukkale & Hierapolis',
    description: 'Travertenler ve antik havuzuyla dünyaca ünlü doğa harikası.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    duration: '1-2 gün',
    bestTimeToVisit: 'Mart - Kasım',
    highlights: ['Travertenler', 'Antik Havuz', 'Hierapolis', 'Kleopatra Havuzu'],
    priceRange: '₺1,500 - ₺2,500',
    tourCount: 15,
    rating: 4.6,
    reviews: 92,
  },
  {
    id: 4,
    name: 'Efes Antik Kenti',
    description: 'Roma İmparatorluğu\'nun en önemli antik kentlerinden biri.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    duration: '1 gün',
    bestTimeToVisit: 'Mart - Kasım',
    highlights: ['Celsus Kütüphanesi', 'Büyük Tiyatro', 'Hadrian Tapınağı', 'Antik Agora'],
    priceRange: '₺1,200 - ₺2,000',
    tourCount: 10,
    rating: 4.9,
    reviews: 145,
  },
  {
    id: 5,
    name: 'Fethiye - Ölüdeniz',
    description: 'Muhteşem koylar ve plajlarla çevrili doğa cenneti.',
    image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    duration: '2-3 gün',
    bestTimeToVisit: 'Mayıs - Ekim',
    highlights: ['Ölüdeniz Plajı', 'Kelebekler Vadisi', 'Paragliding', 'Tekne Turu'],
    priceRange: '₺2,000 - ₺3,500',
    tourCount: 18,
    rating: 4.8,
    reviews: 167,
  },
];

export default function RoutesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
            alt="Routes Hero"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Türkiye'nin En Popüler Rotaları
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Keşfetmek istediğiniz rotayı seçin, size en uygun turu bulun.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rota ara... (örn: Kapadokya, Likya Yolu)"
            />
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularRoutes.map((route) => (
            <Link
              key={route.id}
              href={`/routes/${route.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-64">
                <Image
                  src={route.image}
                  alt={route.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {route.name}
                </h3>
                <p className="mt-2 text-gray-600 line-clamp-2">{route.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {route.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {route.bestTimeToVisit}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {route.priceRange}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {route.highlights.slice(0, 3).map((highlight, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(route.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({route.reviews})</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">Detayları Gör →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                En güncel tur fırsatlarından haberdar olun
              </h2>
              <p className="mt-3 text-lg text-blue-100">
                Özel indirimler, yeni rotalar ve öneriler için bültenimize kaydolun.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <form className="sm:flex">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-5 py-3 placeholder-gray-500 focus:ring-white focus:border-white sm:max-w-xs border-white rounded-md"
                  placeholder="E-posta adresiniz"
                />
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                  >
                    Kaydol
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 