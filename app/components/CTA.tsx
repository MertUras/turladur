"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowRightIcon, StarIcon, ShieldCheckIcon, CurrencyDollarIcon, TicketIcon } from "@heroicons/react/24/outline";

export default function CTA() {
  // Geri sayım için state'ler
  const [days, setDays] = useState(10);
  const [hours, setHours] = useState(8);
  const [minutes, setMinutes] = useState(45);
  const [seconds, setSeconds] = useState(0);
  const [isHoveredPrimary, setIsHoveredPrimary] = useState(false);
  const [isHoveredSecondary, setIsHoveredSecondary] = useState(false);

  // Geri sayım hesaplaması
  useEffect(() => {
    // Kampanya bitiş tarihi - örneğin 30 Nisan 2024
    const endDate = new Date("April 30, 2024 23:59:59").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance < 0) {
        // Kampanya sona erdi
        clearInterval(timer);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      } else {
        // Geri sayım hesaplama
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // İki basamaklı formatlama
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-800 via-indigo-800 to-blue-900 text-white relative overflow-hidden">
      {/* Animasyonlu arka plan desenleri */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      
      {/* Parlayan noktalar animasyonu */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-pulse absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-400/20 blur-3xl"></div>
        <div className="animate-pulse absolute bottom-1/3 right-1/4 w-40 h-40 rounded-full bg-purple-400/20 blur-3xl" style={{ animationDelay: "1s" }}></div>
        <div className="animate-pulse absolute top-2/3 left-1/3 w-24 h-24 rounded-full bg-indigo-400/20 blur-3xl" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium text-sm mb-6 border border-white/20 shadow-lg animate-float">
              <span className="animate-pulse inline-block mr-2 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="mr-2">Sınırlı Süre Teklifi</span>
              <div className="flex items-center space-x-1 text-yellow-400 text-xs">
                <StarIcon className="w-3 h-3" />
                <StarIcon className="w-3 h-3" />
                <StarIcon className="w-3 h-3" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              İlk Rezervasyonunuza <span className="text-gradient bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">%15 İndirim</span> Fırsatını Kaçırmayın!
            </h2>
            
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Yeni üyelere özel indirim kodu ve ek avantajlar için şimdi kaydolun. Tarihler arasında gerçekleştireceğiniz ilk rezervasyonda geçerli kampanyadan yararlanmak için acele edin!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link 
                href="/auth/register" 
                className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 shadow-lg inline-flex items-center justify-center transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                onMouseEnter={() => setIsHoveredPrimary(true)}
                onMouseLeave={() => setIsHoveredPrimary(false)}
              >
                <span className="mr-2">İNDRM15 Kodunu Kullan</span>
                <ArrowRightIcon className={`w-5 h-5 transition-transform duration-300 ${isHoveredPrimary ? 'translate-x-1' : ''}`} />
              </Link>
              <Link 
                href="/tours/featured" 
                className="border-2 border-white/50 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center transform hover:-translate-y-1 cursor-pointer"
                onMouseEnter={() => setIsHoveredSecondary(true)}
                onMouseLeave={() => setIsHoveredSecondary(false)}
              >
                <span className="mr-2">İndirimli Turları Keşfet</span>
                <ArrowRightIcon className={`w-5 h-5 transition-transform duration-300 ${isHoveredSecondary ? 'translate-x-1' : ''}`} />
              </Link>
            </div>
            
            {/* Kampanya Geri Sayım */}
            <div className="border border-white/20 backdrop-blur-sm bg-white/5 rounded-xl p-5 shadow-xl mb-8 w-fit mx-auto lg:mx-0">
              <div className="text-sm uppercase tracking-wider mb-3 font-medium">Kampanya Bitimine Kalan Süre:</div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="bg-white/10 backdrop-blur-sm w-18 p-3 rounded-lg text-center">
                  <div className="text-xl md:text-2xl font-bold text-yellow-400">{formatTime(days)}</div>
                  <div className="text-xs mt-1">Gün</div>
                </div>
                <div className="text-xl font-light text-white/70">:</div>
                <div className="bg-white/10 backdrop-blur-sm w-18 p-3 rounded-lg text-center">
                  <div className="text-xl md:text-2xl font-bold text-yellow-400">{formatTime(hours)}</div>
                  <div className="text-xs mt-1">Saat</div>
                </div>
                <div className="text-xl font-light text-white/70">:</div>
                <div className="bg-white/10 backdrop-blur-sm w-18 p-3 rounded-lg text-center">
                  <div className="text-xl md:text-2xl font-bold text-yellow-400">{formatTime(minutes)}</div>
                  <div className="text-xs mt-1">Dakika</div>
                </div>
              </div>
            </div>
            
            {/* Avantajlar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg transition-transform hover:transform hover:-translate-y-1 hover:bg-white/15">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-2 rounded-md text-blue-900 mr-3 flex-shrink-0">
                  <TicketIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">Ücretsiz İptal</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg transition-transform hover:transform hover:-translate-y-1 hover:bg-white/15">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-2 rounded-md text-blue-900 mr-3 flex-shrink-0">
                  <CurrencyDollarIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">En İyi Fiyat Garantisi</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 shadow-lg transition-transform hover:transform hover:-translate-y-1 hover:bg-white/15">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-2 rounded-md text-blue-900 mr-3 flex-shrink-0">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">VIP Deneyimler</span>
              </div>
            </div>
          </div>
          
          {/* Kampanya Görsel Alanı - Geliştirilmiş */}
          <div className="relative hidden lg:block">
            <div className="relative h-[450px] w-full">
              {/* Ana kart */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-sm"></div>
                <div className="absolute inset-x-0 bottom-0 top-1/4 bg-black/40 backdrop-blur-sm"></div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="bg-white/20 w-fit px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm border border-white/30 shadow-lg animate-pulse">
                    SINIRLI SÜRE FIRSATI
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-white drop-shadow-lg">%15</div>
                    <div className="text-2xl font-medium text-white">İNDİRİM</div>
                    <div className="bg-white/20 w-fit px-6 py-3 rounded-full mx-auto backdrop-blur-sm font-bold border border-white/30 shadow-lg text-white">
                      Kod: İNDRM15
                    </div>
                  </div>
                  
                  <div className="text-center text-sm">
                    <div className="mb-2 text-white font-medium">Kalan Süre:</div>
                    <div className="flex justify-center gap-2">
                      <div className="bg-white/20 backdrop-blur-sm w-14 p-2 rounded-lg shadow-lg border border-white/20">
                        <div className="text-lg font-bold text-white">{formatTime(days)}</div>
                        <div className="text-xs text-white/80">Gün</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm w-14 p-2 rounded-lg shadow-lg border border-white/20">
                        <div className="text-lg font-bold text-white">{formatTime(hours)}</div>
                        <div className="text-xs text-white/80">Saat</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm w-14 p-2 rounded-lg shadow-lg border border-white/20">
                        <div className="text-lg font-bold text-white">{formatTime(minutes)}</div>
                        <div className="text-xs text-white/80">Dakika</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Alt kart - sol */}
              <div className="absolute bottom-10 -left-10 w-64 h-28 bg-white rounded-xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-500 overflow-hidden flex p-3 hover:scale-105">
                <div className="relative w-22 h-full rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1570654230464-9e63b3497a1e" 
                    alt="Kapadokya"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 px-3 flex flex-col justify-center">
                  <div className="text-blue-800 font-bold text-sm">Kapadokya Turu</div>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 line-through mr-2">2500₺</span>
                    <span className="text-red-600 font-bold text-sm">2125₺</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full mt-1 w-fit shadow">
                    %15 İndirim
                  </div>
                </div>
              </div>
              
              {/* Üst kart - sol */}
              <div className="absolute top-10 -left-5 w-52 h-24 bg-white rounded-xl shadow-2xl transform rotate-12 hover:rotate-0 transition-all duration-500 overflow-hidden flex p-3 hover:scale-105">
                <div className="relative w-18 h-full rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200" 
                    alt="İstanbul"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 px-2 flex flex-col justify-center">
                  <div className="text-blue-800 font-bold text-xs">İstanbul Turu</div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 line-through mr-1">1200₺</span>
                    <span className="text-red-600 font-bold text-xs">1020₺</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full mt-1 w-fit shadow">
                    %15 İndirim
                  </div>
                </div>
              </div>
              
              {/* Yeni kart - sağ üst */}
              <div className="absolute top-20 right-[340px] w-48 h-24 bg-white rounded-xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-500 overflow-hidden flex p-3 hover:scale-105">
                <div className="relative w-18 h-full rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1596941248238-0d49dcaa4263" 
                    alt="Bodrum"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 px-2 flex flex-col justify-center">
                  <div className="text-blue-800 font-bold text-xs">Bodrum Tekne Turu</div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 line-through mr-1">3500₺</span>
                    <span className="text-red-600 font-bold text-xs">2975₺</span>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full mt-1 w-fit shadow">
                    %15 İndirim
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobil kampanya kartı */}
        <div className="lg:hidden mt-10 bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-xl shadow-xl max-w-sm mx-auto">
          <div className="text-center mb-5">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm mb-3">
              SINIRLI SÜRE
            </div>
            <div className="text-4xl font-bold text-white mb-2">%15 İNDİRİM</div>
            <div className="bg-white/20 inline-block px-4 py-2 rounded-lg backdrop-blur-sm font-bold">
              Kod: İNDRM15
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <div className="text-lg font-bold text-white">{formatTime(days)}</div>
              <div className="text-xs">Gün</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <div className="text-lg font-bold text-white">{formatTime(hours)}</div>
              <div className="text-xs">Saat</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <div className="text-lg font-bold text-white">{formatTime(minutes)}</div>
              <div className="text-xs">Dk</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <div className="text-lg font-bold text-white">{formatTime(seconds)}</div>
              <div className="text-xs">Sn</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blob arka plan öğeleri */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full filter blur-3xl opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
      
      {/* Orta kısım dekorasyon */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full opacity-20 pointer-events-none"></div>
    </section>
  );
} 