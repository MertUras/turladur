'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MobileOfferPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    // Kullanıcının mobil cihaz kullanıp kullanmadığını kontrol et
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Sayfa ilk yüklendiğinde mobil kontrolü
    checkIfMobile();

    // Ekran boyutu değiştiğinde kontrol et
    window.addEventListener('resize', checkIfMobile);

    // Daha önce teklifi gördü mü kontrol et
    const hasSeenOffer = localStorage.getItem('hasSeenMobileOffer');
    if (hasSeenOffer) return;

    // Kullanıcı en az 30% sayfayı kaydırdığında göster
    const handleScroll = () => {
      if (hasScrolled) return;
      
      const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage > 30) {
        setHasScrolled(true);
        
        // Kullanıcının en az 30% scroll etmesinden 2 saniye sonra göster
        setTimeout(() => {
          if (isMobile) {
            setIsVisible(true);
          }
        }, 2000);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, hasScrolled]);

  const handleClose = () => {
    setIsVisible(false);
    // Kullanıcı teklifi gördüğünü localStorage'a kaydet
    localStorage.setItem('hasSeenMobileOffer', 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('MOBIL25');
    alert('İndirim kodu kopyalandı!');
  };

  // Eğer popup görünür değilse veya mobil cihaz değilse hiçbir şey render etme
  if (!isVisible || !isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-2 z-40 animate-slide-up">
      <div className="bg-white rounded-lg shadow-xl p-3 border border-blue-100 relative">
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600"
          aria-label="Kapat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center">
          <div className="relative flex-shrink-0 w-14 h-14 mr-3 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
              alt="Seyahat Teklifi"
              fill
              className="object-cover"
            />
            <div className="absolute top-0 left-0 bg-gradient-to-br from-blue-600/60 to-indigo-700/60 w-full h-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-yellow-500 text-white font-bold py-0.5 px-1.5 rounded text-[10px] transform rotate-12 shadow-sm">
                %25
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-800">
              Mobil Özel İndirim
            </h3>
            <div className="flex items-center mt-1">
              <div className="bg-blue-50 py-1 px-2 rounded text-xs font-mono font-bold text-blue-700 mr-2">
                MOBIL25
              </div>
              <button 
                className="text-xs text-blue-600 underline"
                onClick={handleCopyCode}
              >
                Kopyala
              </button>
            </div>
          </div>
          
          <Link 
            href="/special-tours" 
            className="ml-2 bg-blue-600 text-white font-medium py-2 px-3 rounded-lg text-xs whitespace-nowrap"
            onClick={handleClose}
          >
            Teklifi Gör
          </Link>
        </div>
      </div>
    </div>
  );
} 