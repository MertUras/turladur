'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const routes = [
  {
    id: 1,
    name: 'Akdeniz Kıyıları',
    description: 'Antalya\'dan Mersin\'e uzanan muhteşem koylar, antik kentler ve eşsiz plajlar.',
    image: 'https://images.unsplash.com/photo-1605217613423-0ebe71a1f71f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    region: 'Akdeniz',
    popularTours: 25,
    averagePrice: '₺3,500',
  },
  {
    id: 2,
    name: 'İstanbul - Kapadokya',
    description: 'Boğaz manzarasından peri bacalarına uzanan kültür ve tarih dolu bir rota.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    region: 'Marmara - İç Anadolu',
    popularTours: 30,
    averagePrice: '₺4,500',
  },
  {
    id: 3,
    name: 'Ege Kıyıları',
    description: 'Fethiye\'den Bodrum\'a uzanan muhteşem koylar ve doğal güzelliklerle dolu bir rota.',
    image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
    region: 'Ege',
    popularTours: 20,
    averagePrice: '₺3,000',
  },
  {
    id: 4,
    name: 'Kapadokya - Pamukkale',
    description: 'Peri bacaları ve travertenler arasında doğa harikalarını keşfedeceğiniz bir rota.',
    image: 'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    region: 'İç Anadolu - Ege',
    popularTours: 18,
    averagePrice: '₺2,800',
  },
  {
    id: 5,
    name: 'Karadeniz Yaylaları',
    description: 'Yemyeşil yaylalar, şelaleler ve dağ manzaralarıyla dolu nefes kesici bir rota.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    region: 'Karadeniz',
    popularTours: 15,
    averagePrice: '₺2,800',
  },
  {
    id: 6,
    name: 'Güneydoğu Kültür Rotası',
    description: 'Gaziantep, Şanlıurfa ve Mardin\'in kültürel zenginliklerini keşfedeceğiniz bir rota.',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    region: 'Güneydoğu Anadolu',
    popularTours: 12,
    averagePrice: '₺2,500',
  },
];

const regions = ['Tümü', 'Akdeniz', 'Marmara', 'Ege', 'İç Anadolu', 'Karadeniz', 'Güneydoğu Anadolu'];

export default function RoutesPage() {
  const [selectedRegion, setSelectedRegion] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutes = routes.filter(route => {
    const matchesRegion = selectedRegion === 'Tümü' || route.region.includes(selectedRegion);
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-blue-600">
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
            Türkiye'nin En Güzel Rotaları
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Keşfedilmeyi bekleyen muhteşem yerler, unutulmaz deneyimler ve eşsiz manzaralar.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Rota Ara
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Akdeniz, İstanbul - Kapadokya, Ege..."
                />
              </div>
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                Bölge
              </label>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <button
                    key={region}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedRegion === region
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredRoutes.length}</span> rota bulundu
          </p>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Sırala:</span>
            <select className="border-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none focus:ring-0">
              <option>Önerilen</option>
              <option>Fiyata göre (Artan)</option>
              <option>Fiyata göre (Azalan)</option>
              <option>Popülerlik</option>
            </select>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRoutes.map((route) => (
            <Link
              key={route.id}
              href={`/routes/${route.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative h-56">
                <Image
                  src={route.image}
                  alt={route.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{route.name}</h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {route.region}
                  </span>
                </div>
                <p className="mt-3 text-gray-600 line-clamp-2">{route.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    {route.popularTours} popüler tur
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Ortalama {route.averagePrice}
                  </span>
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
                En güncel rota fırsatlarından haberdar olun
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