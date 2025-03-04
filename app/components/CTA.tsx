import Link from "next/link";
import Image from "next/image";

export default function CTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-700 to-indigo-800 text-white relative overflow-hidden">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-white font-medium text-sm mb-4">
              <span className="animate-pulse inline-block mr-2 w-2 h-2 bg-red-500 rounded-full"></span>
              Sınırlı Süre Teklifi
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              İlk Rezervasyonunuza <span className="text-yellow-400">%15 İndirim</span> Fırsatını Kaçırmayın!
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto lg:mx-0">
              Yeni üyelere özel indirim kodu ve ek avantajlar için şimdi kaydolun. 30 Nisan'a kadar geçerli kampanyadan yararlanmak için acele edin!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/auth/register" className="bg-white text-blue-800 hover:bg-blue-50 px-8 py-4 text-base font-semibold rounded-lg transition-all duration-300 shadow-lg inline-flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>
                İNDRM15 Kodunu Kullan
              </Link>
              <Link href="/tours/featured" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-base font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                İndirimli Turları Keşfet
              </Link>
            </div>
            
            {/* Avantajlar */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center bg-white/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
                <span className="text-sm">Ücretsiz İptal</span>
              </div>
              <div className="flex items-center bg-white/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
                <span className="text-sm">En İyi Fiyat Garantisi</span>
              </div>
              <div className="flex items-center bg-white/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
                <span className="text-sm">VIP Deneyimler</span>
              </div>
            </div>
          </div>
          
          {/* Kampanya Görsel Alanı */}
          <div className="relative hidden lg:block">
            <div className="relative h-[400px] w-full">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl overflow-hidden shadow-2xl transform rotate-3">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="absolute inset-x-0 bottom-0 top-1/4 bg-black/60"></div>
                
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div className="bg-white/20 w-fit px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
                    SON FIRSATLAR
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="text-5xl font-bold">%15</div>
                    <div className="text-2xl font-medium">İNDİRİM</div>
                    <div className="text-sm bg-white/20 w-fit px-4 py-2 rounded-full mx-auto backdrop-blur-sm">
                      Kod: İNDRM15
                    </div>
                  </div>
                  
                  <div className="text-center text-sm">
                    <div className="mb-2">Kalan Süre:</div>
                    <div className="flex justify-center gap-2">
                      <div className="bg-white/20 backdrop-blur-sm w-12 p-2 rounded">
                        <div className="text-lg font-bold">10</div>
                        <div className="text-xs">Gün</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm w-12 p-2 rounded">
                        <div className="text-lg font-bold">08</div>
                        <div className="text-xs">Saat</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm w-12 p-2 rounded">
                        <div className="text-lg font-bold">45</div>
                        <div className="text-xs">Dakika</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-10 -left-10 w-60 h-24 bg-white rounded-lg shadow-xl transform -rotate-6 overflow-hidden flex p-2">
                <div className="relative w-20 h-full rounded overflow-hidden flex-shrink-0">
                  <Image 
                    src="https://images.unsplash.com/photo-1570654230464-9e63b3497a1e" 
                    alt="Kapadokya"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 px-2 flex flex-col justify-center">
                  <div className="text-blue-800 font-bold text-sm">Kapadokya Turu</div>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500 line-through mr-1">2500₺</span>
                    <span className="text-red-600 font-bold text-sm">2125₺</span>
                  </div>
                  <div className="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded mt-1 w-fit">%15 İndirim</div>
                </div>
              </div>
              
              <div className="absolute top-10 -left-5 w-48 h-20 bg-white rounded-lg shadow-xl transform rotate-12 overflow-hidden flex p-2">
                <div className="relative w-16 h-full rounded overflow-hidden flex-shrink-0">
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
                  <div className="bg-blue-100 text-blue-800 text-xs px-1 py-0.5 rounded mt-1 w-fit">%15 İndirim</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Arka plan desenleri */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full">
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
    </section>
  );
} 