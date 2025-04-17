"use client";

import { useState } from 'react';
import Image from 'next/image';

// Özellik verilerini oluştur
const featureData = [
  {
    id: 'hotels',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    title: 'Oteller',
    description: 'Rezervasyon yönetimi, oda envanteri ve müşteri ilişkileri için kapsamlı çözümler',
    color: 'blue',
    features: [
      'Akıllı oda yönetimi',
      'Dinamik fiyatlandırma',
      'Çoklu kanal entegrasyonu',
      'Kişiselleştirilmiş misafir deneyimi'
    ],
    cta: 'Otel Çözümlerini Keşfet',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80'
  },
  {
    id: 'tours',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
      </svg>
    ),
    title: 'Tur Operatörleri',
    description: 'Tur planlama, rota optimizasyonu ve grup yönetimi için akıllı araçlar',
    color: 'green',
    features: [
      'Etkinlik planlaması ve takvimi',
      'Rehber ve araç yönetimi',
      'Rota optimizasyonu',
      'Grup rezervasyonları'
    ],
    cta: 'Turlarını Yönet',
    image: 'https://images.unsplash.com/photo-1534777367038-9404f45b869a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'agencies',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    title: 'Acenteler',
    description: 'Satış yönetimi, komisyon takibi ve müşteri hizmetleri için entegre çözümler',
    color: 'purple',
    features: [
      'Çoklu tedarikçi entegrasyonu',
      'Komisyon hesaplama ve takibi',
      'Satış analizi ve raporlama',
      'Müşteri veri yönetimi'
    ],
    cta: 'Acente Çözümleri',
    image: 'https://images.unsplash.com/photo-1556761175-129418cb2dfe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
  },
  {
    id: 'experiences',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: 'Deneyimler',
    description: 'Yerel deneyimlerin keşfi, rezervasyonu ve yönetimi için yenilikçi platform',
    color: 'amber',
    features: [
      'Yerel deneyim keşfi',
      'Anlık rezervasyon',
      'Puanlama ve yorum sistemi',
      'Deneyim sağlayıcı paneli'
    ],
    cta: 'Deneyimleri Keşfet',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  }
];

export default function Features() {
  const [activeTab, setActiveTab] = useState('hotels');
  const [isHovering, setIsHovering] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Aktif özelliği bul
  const activeFeature = featureData.find(feature => feature.id === activeTab);

  const getColorClass = (color: string, isActive: boolean = false, element: 'bg' | 'text' | 'border' = 'bg') => {
    const prefix = element === 'bg' ? 'bg' : element === 'text' ? 'text' : 'border';
    const intensity = isActive ? '600' : element === 'bg' ? '50' : '500';
    return `${prefix}-${color}-${intensity}`;
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            ÖZELLİKLERİMİZ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            Neden TurlaDur?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Turizm ekosisteminin tüm bileşenlerini tek bir platformda buluşturuyoruz.
            <br className="hidden md:inline" />
            Sektörün her alanında dijital dönüşümün öncüsüyüz.
          </p>
        </div>
        
        {/* Navigasyon Sekmeleri */}
        <div className="flex flex-wrap justify-center mb-10 gap-2">
          {featureData.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
              className={`px-5 py-3 rounded-full transition-all duration-300 font-medium flex items-center gap-2 cursor-pointer ${
                activeTab === feature.id
                  ? `${getColorClass(feature.color, true)} text-white shadow-lg shadow-${feature.color}-200`
                  : `${getColorClass(feature.color, false)} hover:bg-${feature.color}-100 text-gray-700`
              }`}
            >
              <span className={`transition-all duration-300 ${
                hoveredFeature === feature.id && activeTab !== feature.id ? 'scale-110' : ''
              }`}>
                {feature.title}
              </span>
            </button>
          ))}
        </div>
        
        {/* Ana İçerik Alanı */}
        {activeFeature && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mt-10">
            {/* Özellik Görsel Tarafı */}
            <div 
              className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Image
                src={activeFeature.image}
                alt={activeFeature.title}
                fill
                className={`object-cover transition-transform duration-700 ${isHovering ? 'scale-110' : 'scale-100'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className={`w-16 h-16 ${getColorClass(activeFeature.color, true)} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                  {activeFeature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{activeFeature.title}</h3>
                <p className="text-white/80">{activeFeature.description}</p>
              </div>
            </div>
            
            {/* Özellik Açıklama Tarafı */}
            <div className="p-6 lg:p-10">
              <h3 className={`text-2xl font-bold mb-6 ${getColorClass(activeFeature.color, false, 'text')}`}>
                {activeFeature.title} İçin Çözümlerimiz
              </h3>
              
              <div className="space-y-5 mb-8">
                {activeFeature.features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                  >
                    <div className={`w-8 h-8 flex-shrink-0 ${getColorClass(activeFeature.color, false)} ${getColorClass(activeFeature.color, false, 'text')} rounded-full flex items-center justify-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{feature}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className={`px-6 py-3 ${getColorClass(activeFeature.color, true)} text-white rounded-lg font-medium hover:shadow-lg hover:shadow-${activeFeature.color}-200 transition-all duration-300 flex items-center gap-2`}
              >
                <span>{activeFeature.cta}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Sayaç Bölümü */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
            <p className="text-gray-600">Aktif Otel</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
            <p className="text-gray-600">Tur Operatörü</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="text-4xl font-bold text-purple-600 mb-2">750+</div>
            <p className="text-gray-600">Seyahat Acentesi</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="text-4xl font-bold text-amber-600 mb-2">10M+</div>
            <p className="text-gray-600">Aylık Rezervasyon</p>
          </div>
        </div>
      </div>
    </section>
  );
} 