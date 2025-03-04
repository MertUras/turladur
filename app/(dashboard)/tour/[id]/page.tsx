import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyTours, dummyTourOperators } from "@/app/lib/dummy-data";
import { parseJsonString } from "@/app/utils/format";
import BottomBookingBar from "@/app/components/BottomBookingBar";

interface TourPageProps {
  params: {
    id: string;
  };
}

export default async function TourPage({ params }: TourPageProps) {
  // Tur verilerini al
  const tour = dummyTours.find((tour) => tour.id === params.id);
  
  // Tur bulunamazsa 404 sayfasına yönlendir
  if (!tour) {
    notFound();
  }
  
  // Tur operatörü bilgilerini al
  const tourOperator = dummyTourOperators.find((operator) => operator.id === tour.tourOperatorId);
  
  // Tur resimlerini parse et
  const tourImages = parseJsonString<string[]>(tour.images, []);
  
  // Tur dahil olanlar ve olmayanlar
  const inclusions = parseJsonString<string[]>(tour.inclusions, []);
  const exclusions = parseJsonString<string[]>(tour.exclusions, []);
  
  // Tur destinasyonları
  const destinations = parseJsonString<string[]>(tour.destinations, []);
  
  // Tur programını parse et
  const itinerary = parseJsonString<Record<string, string>>(tour.itinerary || '{}', {});

  return (
    <div className="bg-white">
      {/* Üst Banner */}
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <Image
          src={tourImages[0] || '/placeholder-image.jpg'}
          alt={tour.name}
          fill
          priority
          style={{ objectFit: "cover" }}
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/50"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center">
            <div className="inline-block mb-6">
              <div className="h-1 w-32 bg-white/80 mb-2 mx-auto"></div>
              <div className="h-1 w-16 bg-white/60 mx-auto"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{tour.name}</h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white mb-8">
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <span className="font-medium">{destinations.join(', ')}</span>
              </div>
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="font-medium">{tour.duration} gün</span>
              </div>
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                <span className="font-medium">Maks. {tour.maxParticipants || 10} kişi</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="#itinerary" 
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                Tur Programı
              </Link>
              <Link 
                href="#booking" 
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
              >
                Rezervasyon Yap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol Kolon - Tur Bilgileri */}
          <div className="lg:col-span-2 space-y-16">
            {/* Tur Açıklaması */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Tur Hakkında</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">{tour.description}</p>
              
              {/* Tur Özellikleri */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Tur Özellikleri</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {inclusions.map((feature, index) => (
                    <div key={index} className="flex items-center bg-white p-4 rounded-xl shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tur Resimleri */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Fotoğraf Galerisi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tourImages.map((image, index) => (
                  <div key={index} className="relative h-64 rounded-2xl overflow-hidden group">
                    <Image
                      src={image}
                      alt={`${tour.name} - Resim ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tur Programı */}
            <div id="itinerary">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 mr-3 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                </svg>
                Tur Programı
              </h2>
              <div className="space-y-6">
                {Object.entries(itinerary).map(([day, description], index) => {
                  const dayNumber = day.replace('day', '');
                  return (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                      <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 flex items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-10 -mr-10 opacity-50"></div>
                        <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-white text-xl font-bold">{dayNumber}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Gün {dayNumber}: {destinations[index] || ''}</h3>
                      </div>
                      <div className="p-8 group-hover:bg-blue-50/50 transition-colors duration-300">
                        <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
                        
                        {/* Her günün alt kısmına aktiviteler ve beklentiler eklenebilir */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <div className="flex flex-wrap gap-3">
                            {['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği'].map((meal, i) => (
                              <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 8 8">
                                  <circle cx="4" cy="4" r="3" />
                                </svg>
                                {meal}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Rezervasyon ve Bilgiler */}
          <div>
            {/* Rezervasyon Kartı */}
            <div id="booking" className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-xl transform transition-all duration-300 hover:shadow-2xl md:relative">
              {/* Üst Banner */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-16 -mr-16"></div>
                <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -mt-10 -ml-10"></div>
              </div>
              
              {/* İçerik */}
              <div className="relative pt-12 mt-8">
                <h2 className="text-2xl font-bold text-white mb-6 bg-blue-600 px-6 py-3 rounded-xl inline-block -mt-20 shadow-lg">Rezervasyon</h2>
                
                {/* Fiyat bilgisi */}
                <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium">Fiyat</span>
                    <div className="text-right">
                      {tour.discount && tour.discount > 0 ? (
                        <>
                          <div className="flex items-center justify-end mb-1">
                            <span className="line-through text-gray-400 text-lg mr-2">{tour.price} ₺</span>
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">%{tour.discount} İndirim</span>
                          </div>
                          <span className="text-3xl font-bold text-blue-600">{(tour.price - (tour.price * (tour.discount || 0) / 100)).toLocaleString('tr-TR')} ₺</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-blue-600">{tour.price.toLocaleString('tr-TR')} ₺</span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm text-right">kişi başı</p>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div>
                    <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
                      </svg>
                      Tarih Seçin
                    </label>
                    <div className="relative group">
                      <select 
                        id="date" 
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700 pr-10 transition-all group-hover:border-blue-400"
                      >
                        <option value="">Tarih Seçin</option>
                        {tour.startDate && (
                          <>
                            <option value={tour.startDate.toISOString()}>
                              {tour.startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </option>
                            <option value={new Date(tour.startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()}>
                              {new Date(tour.startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </option>
                            <option value={new Date(tour.startDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()}>
                              {new Date(tour.startDate.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </option>
                          </>
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                        <svg className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="people" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 text-blue-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                      </svg>
                      Kişi Sayısı
                    </label>
                    <div className="relative">
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, "6+"].map((count, index) => (
                          <div key={index} className="relative">
                            <input 
                              type="radio" 
                              name="people" 
                              id={`people-${count}`} 
                              className="sr-only peer" 
                              defaultChecked={count === 2}
                            />
                            <label 
                              htmlFor={`people-${count}`} 
                              className="flex flex-col items-center justify-center p-2 bg-white border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50 transition-all text-center h-full text-gray-700"
                            >
                              <span className="text-lg font-semibold">{count}</span>
                              <span className="text-xs text-gray-500">Kişi</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    Rezervasyon Yap
                  </button>
                  
                  <button className="w-full bg-white text-blue-600 border-2 border-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    Fiyat Bilgisi Al
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 font-medium">Ödeme şimdi yapılmayacak</p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <div className="p-1 bg-green-100 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <span className="font-medium">Ücretsiz iptal</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-1 bg-green-100 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <span className="font-medium">Anında onay</span>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Mobil Rezervasyon Kartı (Yalnızca Mobilde Görünür) */}
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-xl md:hidden">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rezervasyon</h2>
              
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <span className="block text-gray-500 text-sm">Kişi başı</span>
                  {tour.discount && tour.discount > 0 ? (
                    <>
                      <span className="line-through text-gray-400 text-sm">{tour.price} ₺</span>
                      <span className="ml-2 text-2xl font-bold text-blue-600">{(tour.price - (tour.price * (tour.discount || 0) / 100)).toLocaleString('tr-TR')} ₺</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">{tour.price.toLocaleString('tr-TR')} ₺</span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all">
                    Rezervasyon
                  </button>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 justify-center">
                <div className="p-1 bg-green-100 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <span>Ücretsiz iptal</span>
                <span className="mx-2">•</span>
                <div className="p-1 bg-green-100 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <span>Anında onay</span>
              </div>
            </div>

            {/* Diğer Bilgiler ve Kartlar */}
            <div className="space-y-8">
              {/* Tur Operatörü Bilgileri */}
              {tourOperator && (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Tur Operatörü</h2>
                  <div className="flex items-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mr-4 border-4 border-gray-100">
                      <Image
                        src={tourOperator.logo || '/placeholder-image.jpg'}
                        alt={tourOperator.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{tourOperator.name}</h3>
                      <div className="flex items-center text-sm">
                        <div className="flex items-center text-yellow-400 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                          </svg>
                          <span className="font-bold text-gray-900 ml-1">4.8</span>
                        </div>
                        <span className="text-gray-600">(24 değerlendirme)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">{tourOperator.description?.substring(0, 150) || 'Tur operatörü hakkında bilgi bulunmamaktadır.'}...</p>
                  <Link 
                    href={`/tour-operator/${tourOperator.id}`} 
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center group"
                  >
                    Tur operatörü hakkında daha fazla bilgi
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              )}

              {/* Dahil Olanlar / Olmayanlar */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dahil Olanlar / Olmayanlar</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dahil Olanlar</h3>
                  <ul className="space-y-3">
                    {inclusions.map((item, index) => (
                      <li key={index} className="flex items-start bg-green-50 p-4 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-green-600 mr-3 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dahil Olmayanlar</h3>
                  <ul className="space-y-3">
                    {exclusions.map((item, index) => (
                      <li key={index} className="flex items-start bg-red-50 p-4 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-red-600 mr-3 flex-shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Client componenti ekliyoruz */}
      <BottomBookingBar tour={tour} />
    </div>
  );
} 