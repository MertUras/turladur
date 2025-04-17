'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function HelpTab() {
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([0]);

  // Sıkça sorulan sorular için açılıp kapanma işlevi
  const toggleFAQ = (index: number) => {
    setExpandedFAQs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Yardım ve Destek</h2>
      </div>
      
      {/* Sık Sorulan Sorular */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sık Sorulan Sorular</h3>
        
        <div className="space-y-4">
          <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
            <button 
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFAQ(0)}
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Rezervasyonumu nasıl iptal edebilirim?</h4>
              <svg 
                className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedFAQs.includes(0) ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedFAQs.includes(0) && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Rezervasyonunuzu iptal etmek için "Rezervasyonlarım" sekmesinden ilgili rezervasyonu bulun ve "İptal Et" butonuna tıklayın. İptal koşulları, rezervasyon tarihinize ve seçtiğiniz hizmetin iptal politikasına göre değişiklik gösterebilir.
              </p>
            )}
          </div>
          
          <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
            <button 
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFAQ(1)}
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Ödeme yöntemimi nasıl değiştirebilirim?</h4>
              <svg 
                className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedFAQs.includes(1) ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedFAQs.includes(1) && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                "Ödeme Bilgileri" sekmesinden mevcut kartlarınızı yönetebilir ve yeni kart ekleyebilirsiniz. Onaylanmış bir rezervasyon için ödeme yöntemini değiştirmek isterseniz, müşteri hizmetleri ile iletişime geçmeniz gerekebilir.
              </p>
            )}
          </div>
          
          <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
            <button 
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFAQ(2)}
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Puanlarımı nasıl kullanabilirim?</h4>
              <svg 
                className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedFAQs.includes(2) ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedFAQs.includes(2) && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Biriktirdiğiniz puanları yeni rezervasyonlarda indirim olarak kullanabilirsiniz. Ödeme sayfasında "Puanlarımı Kullan" seçeneğini işaretleyerek mevcut puanlarınızı kullanabilirsiniz. Her 100 puan 10₺ değerinde indirim sağlar.
              </p>
            )}
          </div>
          
          <div>
            <button 
              className="flex justify-between items-center w-full text-left"
              onClick={() => toggleFAQ(3)}
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Rezervasyon tarihimi değiştirebilir miyim?</h4>
              <svg 
                className={`h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedFAQs.includes(3) ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedFAQs.includes(3) && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Evet, çoğu rezervasyonun tarihini değiştirebilirsiniz. "Rezervasyonlarım" sekmesinden ilgili rezervasyonu bulun ve "Değişiklik Talebi" butonuna tıklayın. Değişiklik politikaları ve ek ücretler, rezervasyon tipine ve ilgili otelin veya turun politikalarına göre değişiklik gösterebilir.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* İletişim Kanalları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">E-posta</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Sorularınız için bize yazın</p>
          <a 
            href="mailto:destek@tourtech.com"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            destek@tourtech.com
          </a>
        </div>
        
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 dark:bg-green-900/40 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Telefon</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">7/24 müşteri hizmetleri</p>
          <a 
            href="tel:+908502123456"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            0850 212 34 56
          </a>
        </div>
        
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Canlı Destek</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Hemen yardım alın</p>
          <button 
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            onClick={() => toast.success('Canlı destek başlatılıyor...')}
          >
            Sohbet Başlat
          </button>
        </div>
      </div>
      
      {/* Destek Talebi Oluştur */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Destek Talebi Oluştur</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Konu
            </label>
            <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Konu Seçin</option>
              <option value="reservation">Rezervasyon İşlemleri</option>
              <option value="payment">Ödeme Sorunları</option>
              <option value="account">Hesap İşlemleri</option>
              <option value="other">Diğer</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mesajınız
            </label>
            <textarea 
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              rows={4}
              placeholder="Sorunuzu veya sorununuzu detaylı bir şekilde açıklayın..."
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Ekler (İsteğe Bağlı)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                    <span>Dosya Yükle</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">veya sürükleyip bırakın</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, PDF en fazla 10MB
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              onClick={() => toast.success('Destek talebiniz başarıyla oluşturuldu!')}
            >
              Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 