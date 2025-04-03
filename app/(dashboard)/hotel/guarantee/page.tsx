import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function GuaranteePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Üst Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/hotel" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeftIcon className="w-5 h-5" />
            Otellere Dön
          </Link>
        </div>
      </div>

      {/* İçerik */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">En İyi Fiyat Garantisi</h1>
          
          <div className="prose prose-sm sm:prose-base max-w-none">
            <p className="text-gray-600 mb-6">
              TourTech olarak, size en iyi fiyatı sunmak için elimizden geleni yapıyoruz. Eğer aynı otel için daha uygun bir fiyat bulursanız, farkı size iade ediyoruz.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-4">Nasıl Çalışır?</h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-600">
              <li>TourTech üzerinden bir otel rezervasyonu yapın</li>
              <li>Aynı otel için daha uygun bir fiyat bulun</li>
              <li>Fiyat farkı talebinizi bize iletin</li>
              <li>Farkı size iade edelim</li>
            </ol>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-4">Şartlar</h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-600">
              <li>Karşılaştırılan fiyat aynı otel, aynı oda tipi ve aynı tarihler için olmalıdır</li>
              <li>Fiyat farkı talebi, rezervasyon tarihinden itibaren 24 saat içinde yapılmalıdır</li>
              <li>Karşılaştırılan fiyat güvenilir ve doğrulanabilir bir kaynaktan olmalıdır</li>
              <li>Fiyat farkı talebi, rezervasyonunuzun iptal edilmemesi şartıyla geçerlidir</li>
            </ul>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-4">Fiyat Farkı Talebi İçin Gerekli Bilgiler</h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-600">
              <li>Rezervasyon numaranız</li>
              <li>Daha uygun fiyatın bulunduğu web sitesinin linki</li>
              <li>Karşılaştırılan fiyatın ekran görüntüsü</li>
              <li>İletişim bilgileriniz</li>
            </ul>
          </div>

          <div className="mt-8">
            <Link 
              href="/hotel" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Otellere Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 