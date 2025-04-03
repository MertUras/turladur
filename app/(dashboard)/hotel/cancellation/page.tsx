import React from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CancellationPage() {
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">İptal Politikası</h1>
          
          <div className="prose prose-sm sm:prose-base max-w-none">
            <p className="text-gray-600 mb-6">
              TourTech olarak, rezervasyonlarınızı esnek ve güvenli bir şekilde yönetmenizi sağlıyoruz. İptal politikamız, farklı rezervasyon tipleri için farklı seçenekler sunmaktadır.
            </p>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-4">İptal Seçenekleri</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ücretsiz İptal</h3>
                <p className="text-gray-600">
                  Çoğu rezervasyonda, check-in tarihinden 24 saat öncesine kadar ücretsiz iptal hakkı sunuyoruz. Bu süre içinde yapılan iptallerde herhangi bir ücret talep edilmez.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Kısmi İade</h3>
                <p className="text-gray-600">
                  Bazı rezervasyonlarda, belirli bir süre sonrasında yapılan iptallerde kısmi iade seçeneği sunulmaktadır. İade oranı, iptal tarihine göre değişiklik gösterebilir.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">İptal Edilemeyen Rezervasyonlar</h3>
                <p className="text-gray-600">
                  Özel fiyatlar veya promosyonlu teklifler için iptal seçeneği sunulmayabilir. Bu durumda, rezervasyon detaylarında "İptal Edilemez" olarak belirtilir.
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-4">İptal Süreci</h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-600">
              <li>Hesabınıza giriş yapın veya rezervasyon numaranızı kullanın</li>
              <li>İptal etmek istediğiniz rezervasyonu bulun</li>
              <li>"İptal Et" butonuna tıklayın</li>
              <li>İptal işlemini onaylayın</li>
              <li>İptal onayınızı e-posta ile alacaksınız</li>
            </ol>

            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-8 mb-4">Sık Sorulan Sorular</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">İade ne kadar sürede gerçekleşir?</h3>
                <p className="text-gray-600">
                  İadeler, ödeme yönteminize bağlı olarak 5-7 iş günü içinde gerçekleştirilir.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">Kısmi iptal yapabilir miyim?</h3>
                <p className="text-gray-600">
                  Evet, bazı rezervasyonlarda kısmi iptal seçeneği sunulmaktadır. Detaylar için rezervasyon sayfanızı kontrol edin.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">İptal ücreti nedir?</h3>
                <p className="text-gray-600">
                  İptal ücreti, rezervasyon tipine ve iptal tarihine göre değişiklik gösterir. Ücretsiz iptal seçeneği olan rezervasyonlarda herhangi bir ücret talep edilmez.
                </p>
              </div>
            </div>
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