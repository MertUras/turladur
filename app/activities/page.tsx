'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Search } from 'lucide-react';
import Image from 'next/image';

// Ana kategoriler
const activityTypes = [
  { id: 'all', name: 'Tümü', icon: '🌟' },
  { id: 'nature', name: 'Doğa', icon: '🌲' },
  { id: 'adventure', name: 'Macera', icon: '🏃' },
  { id: 'culture', name: 'Kültür', icon: '🏛️' },
  { id: 'food', name: 'Yemek', icon: '🍽️' },
  { id: 'sea', name: 'Deniz', icon: '🌊' }
];

// Detaylı turistik aktivite türleri
const touristActivityTypes = [
  { id: 'historical-sites', name: 'Tarihi Yerler' },
  { id: 'museums', name: 'Müzeler' },
  { id: 'boat-tours', name: 'Tekne Turları' },
  { id: 'food-tours', name: 'Yemek Turları' },
  { id: 'water-sports', name: 'Su Sporları' },
  { id: 'hiking', name: 'Doğa Yürüyüşü' },
  { id: 'photography', name: 'Fotoğraf Turları' },
  { id: 'shopping', name: 'Alışveriş Turları' },
  { id: 'local-experiences', name: 'Yerel Deneyimler' },
  { id: 'workshops', name: 'Workshop & Atölyeler' }
];

// Örnek aktiviteler
const activities = [
  {
    id: 1,
    title: 'Türk Mutfağı Workshop',
    type: 'food',
    category: 'Yemek',
    touristType: 'workshops',
    duration: '4 saat',
    location: 'Eminönü Mutfak Atölyesi',
    price: 800,
    capacity: '10 kişi',
    image: '/activities/turkish-cuisine.webp',
    description: 'Geleneksel Türk yemeklerini öğrenin ve pişirin'
  },
  {
    id: 2,
    title: 'Kapadokya Balon Turu',
    type: 'adventure',
    category: 'Macera',
    touristType: 'local-experiences',
    duration: '3 saat',
    location: 'Göreme Balon Kalkış Alanı',
    price: 2500,
    capacity: '16 kişi',
    image: '/activities/cappadocia-balloon.webp',
    description: `Güneş doğarken Kapadokya'nın eşsiz manzarasını havadan görün`
  },
  {
    id: 3,
    title: 'Boğaz Tekne Turu',
    type: 'sea',
    category: 'Deniz',
    touristType: 'boat-tours',
    duration: '2 saat',
    location: 'Beşiktaş İskele',
    price: 1200,
    capacity: '30 kişi',
    image: '/activities/bosphorus-tour.webp',
    description: 'İstanbul Boğazı\'nın muhteşem manzarasını tekne ile keşfedin'
  },
  {
    id: 4,
    title: 'Jet Ski Safari',
    type: 'sea',
    category: 'Deniz',
    touristType: 'water-sports',
    duration: '1 saat',
    location: 'Antalya Marina',
    price: 1500,
    capacity: '2 kişi',
    image: '/activities/jet-ski.webp',
    description: 'Akdeniz\'in berrak sularında jet ski deneyimi yaşayın'
  },
  {
    id: 5,
    title: 'Efes Antik Kenti Turu',
    type: 'culture',
    category: 'Kültür',
    touristType: 'historical-sites',
    duration: '6 saat',
    location: 'Efes Antik Kenti',
    price: 900,
    capacity: '20 kişi',
    image: '/activities/ephesus-tour.webp',
    description: 'Antik dünyanın en iyi korunmuş şehrini profesyonel rehber eşliğinde keşfedin'
  },
  {
    id: 6,
    title: 'Paraşüt Deneyimi',
    type: 'adventure',
    category: 'Macera',
    touristType: 'local-experiences',
    duration: '30 dakika',
    location: 'Fethiye Babadağ',
    price: 1800,
    capacity: '1 kişi',
    image: '/activities/paragliding.webp',
    description: 'Babadağ\'dan Ölüdeniz manzaralı yamaç paraşütü deneyimi'
  }
];

export default function ActivitiesPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTouristType, setSelectedTouristType] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtreleme fonksiyonu
  const filteredActivities = activities.filter(activity => {
    const mainTypeMatch = selectedType === 'all' || activity.type === selectedType;
    const touristTypeMatch = selectedTouristType === 'all' || activity.touristType === selectedTouristType;
    const priceMatch = (!minPrice || activity.price >= Number(minPrice)) && 
                      (!maxPrice || activity.price <= Number(maxPrice));
    const searchMatch = !searchQuery || 
                       activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return mainTypeMatch && touristTypeMatch && priceMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src="/images/activities-hero.jpg"
          alt="Aktiviteler"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-blue-800/80 to-blue-900/70" />
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-20" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Türkiye'nin En İyi Aktiviteleri
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/90 max-w-2xl mb-8"
          >
            Unutulmaz deneyimler ve eşsiz aktiviteler için doğru adrestesiniz.
          </motion.p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 mb-12 z-20">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Turistik Aktivite Türü */}
              <div className="md:col-span-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Turistik Aktivite Türü</label>
                <div className="relative">
                  <select
                    value={selectedTouristType}
                    onChange={(e) => setSelectedTouristType(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
                  >
                    <option value="all">Tüm Aktiviteler</option>
                    {touristActivityTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Fiyat Filtresi */}
              <div className="md:col-span-3 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Fiyat Aralığı</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="Min ₺"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full h-12 pl-4 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="Max ₺"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full h-12 pl-4 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Şehir Filtresi */}
              <div className="md:col-span-3 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Şehir</label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none"
                  >
                    <option value="all">Tüm Şehirler</option>
                    <option value="istanbul">İstanbul</option>
                    <option value="ankara">Ankara</option>
                    <option value="izmir">İzmir</option>
                    <option value="antalya">Antalya</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Arama */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Ara</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Aktivite ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ana Kategori Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {activityTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedType === type.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>

        {/* Activities Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map(activity => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Öne Çıkan
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>{activity.duration}</span>
                    <MapPin className="h-4 w-4 ml-2" />
                    <span>{activity.location}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{activity.capacity}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-blue-600">₺{activity.price}</span>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                        Detaylar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 