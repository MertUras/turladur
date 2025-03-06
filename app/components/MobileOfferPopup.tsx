"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MobileOfferPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  
  // Popup'ı sadece mobil cihazlarda ve belirli bir süre sonra göster
  useEffect(() => {
    // Tarayıcıda mıyız kontrol et
    if (typeof window === 'undefined') return;
    
    // Mobil cihaz kontrolü - 768px altı mobil kabul edilir
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Kullanıcı daha önce kapatmış mı?
      const popupClosed = localStorage.getItem("mobileOfferPopupClosed");
      
      if (!popupClosed) {
        // 5 saniye sonra popup'ı göster
        const timer = setTimeout(() => {
          setIsVisible(true);
          setAnimationClass("animate-in");
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, []);
  
  const closePopup = () => {
    setAnimationClass("animate-out");
    
    // Animasyonun tamamlanmasını bekle, sonra popup'ı gizle
    setTimeout(() => {
      setIsVisible(false);
      
      // Kullanıcı tercihini kaydet - 7 gün boyunca tekrar gösterme
      localStorage.setItem("mobileOfferPopupClosed", Date.now().toString());
    }, 300);
  };
  
  // Popup görünür değilse, hiçbir şey render etme
  if (!isVisible) return null;
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${animationClass}`}>
      {/* Overlay - Popup dışı tıklandığında kapat */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={closePopup}
      />
      
      {/* Popup içeriği */}
      <div className="relative bg-white rounded-xl overflow-hidden w-full max-w-xs shadow-2xl">
        {/* Kapat butonu */}
        <button 
          onClick={closePopup}
          className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 text-gray-700 hover:bg-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Üst bölüm - görsel + yazı */}
        <div className="relative h-40 w-full">
          <Image
            src="https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1925"
            alt="Sınırlı zaman teklifi"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
            <div className="flex items-center bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full w-max mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              SINIRLI SÜRE
            </div>
            <h3 className="text-white text-xl font-bold">Mobil'e Özel Fırsat!</h3>
            <p className="text-white/90 text-sm">İndirim kodunu hemen kullanın.</p>
          </div>
        </div>
        
        {/* Alt bölüm - kupon ve buton */}
        <div className="p-4">
          <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-dashed border-blue-300 text-center relative">
            <div className="absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-white transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-white transform -translate-y-1/2"></div>
            <span className="text-xs text-blue-700 block font-medium">KUPON KODU</span>
            <div className="flex items-center justify-center mt-1 gap-2">
              <span className="text-xl font-bold text-blue-950 tracking-wider">MOBIL25</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText("MOBIL25");
                  alert("Kupon kodu kopyalandı!");
                }}
                className="text-blue-700 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
              </button>
            </div>
            <span className="text-xs text-blue-700 block font-medium mt-1">%25 indirim kazanın</span>
          </div>
          
          <Link href="/deals" 
            onClick={closePopup}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors mb-2"
          >
            Fırsatları Keşfedin
          </Link>
          
          <p className="text-xs text-gray-500 text-center px-2">
            Kupon, 31 Ağustos 2024 tarihine kadar geçerlidir. Diğer kampanyalarla birleştirilemez.
          </p>
        </div>
      </div>
    </div>
  );
} 