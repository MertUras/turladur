import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyTours, dummyTourOperators } from "@/app/lib/dummy-data";
import { parseJsonString } from "@/app/utils/format";
import BottomBookingBar from "@/app/components/BottomBookingBar";

// Heroicons bileşenlerini içe aktarıyoruz
import {
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  MapIcon,
  HeartIcon,
  ShareIcon,
  CurrencyDollarIcon,
  StarIcon,
  CheckIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

// Solid ikonları
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

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

  // Yıldızları render et
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          return star <= Math.floor(rating) ? (
            <StarIconSolid key={star} className="h-5 w-5 text-yellow-400" />
          ) : star <= rating ? (
            <div key={star} className="relative">
              <StarIcon className="h-5 w-5 text-gray-300" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                <StarIconSolid className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          ) : (
            <StarIcon key={star} className="h-5 w-5 text-gray-300" />
          );
        })}
      </div>
    );
  };

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
        
        {/* Sosyal Paylaşım ve Favori Düğmeleri */}
        <div className="absolute top-6 right-6 flex space-x-3 z-50">
          <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all p-3 rounded-full text-white">
            <HeartIcon className="h-6 w-6" />
          </button>
          <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all p-3 rounded-full text-white">
            <ShareIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Öne Çıkan Özellikler - Yatay Bant */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md py-4 border-t border-white/10">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center text-white gap-3">
                <div className="p-2 bg-blue-500/30 rounded-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <p className="text-xs text-blue-200">Süre</p>
                  <p className="font-medium">{tour.duration} Gün</p>
                </div>
              </div>
              
              <div className="flex items-center text-white gap-3">
                <div className="p-2 bg-green-500/30 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-green-200" />
                </div>
                <div>
                  <p className="text-xs text-green-200">Grup Boyutu</p>
                  <p className="font-medium">Maks. {tour.maxParticipants || 10} kişi</p>
                </div>
              </div>
              
              <div className="flex items-center text-white gap-3">
                <div className="p-2 bg-amber-500/30 rounded-lg">
                  <MapPinIcon className="h-6 w-6 text-amber-200" />
                </div>
                <div>
                  <p className="text-xs text-amber-200">Destinasyon</p>
                  <p className="font-medium truncate max-w-[140px]">{destinations[0]}{destinations.length > 1 ? ` +${destinations.length - 1}` : ''}</p>
                </div>
              </div>
              
              <div className="flex items-center text-white gap-3">
                <div className="p-2 bg-purple-500/30 rounded-lg">
                  <StarIcon className="h-6 w-6 text-purple-200" />
                </div>
                <div>
                  <p className="text-xs text-purple-200">Zorluk</p>
                  <p className="font-medium">Orta Seviye</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center">
            <div className="inline-flex items-center mb-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              <div className="h-1 w-16 bg-white/80 mr-2"></div>
              <span className="text-white/90 font-medium uppercase tracking-wider text-sm">Premium Tur</span>
              <div className="h-1 w-16 bg-white/80 ml-2"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fadeIn">{tour.name}</h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white mb-8">
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <MapPinIcon className="w-5 h-5 mr-2 text-blue-400" />
                <span className="font-medium">{destinations.join(', ')}</span>
              </div>
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <ClockIcon className="w-5 h-5 mr-2 text-blue-400" />
                <span className="font-medium">{tour.duration} gün</span>
              </div>
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <UserGroupIcon className="w-5 h-5 mr-2 text-blue-400" />
                <span className="font-medium">Maks. {tour.maxParticipants || 10} kişi</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="#itinerary" 
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center"
              >
                <MapIcon className="h-5 w-5 mr-2" />
                <span>Tur Programı</span>
                <ChevronRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#booking" 
                className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg flex items-center"
              >
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                <span>Rezervasyon Yap</span>
                <ChevronRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
              <div className="flex items-center mb-8">
                <div className="h-10 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-900">Tur Hakkında</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">{tour.description}</p>
              
              {/* Tur Özellikleri */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CheckCircleIcon className="h-7 w-7 text-blue-600 mr-3" />
                  <span>Tur Özellikleri</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {inclusions.map((feature, index) => (
                    <div key={index} className="flex items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 duration-300">
                      <CheckCircleIcon className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tur Resimleri */}
            <div>
              <div className="flex items-center mb-8">
                <div className="h-10 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <PhotoIcon className="h-7 w-7 text-blue-600 mr-3" />
                  <span>Fotoğraf Galerisi</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tourImages.map((image, index) => (
                  <div key={index} className="relative h-64 rounded-2xl overflow-hidden group shadow-lg gallery-overlay">
                    <Image
                      src={image}
                      alt={`${tour.name} - Resim ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      className="group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                      <div className="p-4 w-full text-white">
                        <p className="font-medium">Tur Görüntüsü {index + 1}</p>
                        <p className="text-sm opacity-80">{destinations[index % destinations.length] || 'Tur Lokasyonu'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tur Programı */}
            <div id="itinerary" className="scroll-mt-24">
              <div className="flex items-center mb-8">
                <div className="h-10 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <MapIcon className="h-7 w-7 text-blue-600 mr-3" />
                  <span>Tur Programı</span>
                </h2>
              </div>
              
              {/* Tur Programı için Görsel Zaman Çizelgesi - Mobil Cihazlarda Görünür */}
              <div className="flex overflow-x-auto pb-4 mb-8 space-x-4 hide-scrollbar md:hidden">
                {Object.entries(itinerary).map(([day, description], index) => {
                  const dayNumber = day.replace('day', '');
                  return (
                    <div key={index} className="flex-shrink-0 w-48 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-white">
                        <h3 className="font-bold">Gün {dayNumber}</h3>
                        <p className="text-xs text-white/80">{destinations[index % destinations.length] || 'Tur Lokasyonu'}</p>
                      </div>
                      <div className="p-3">
                        <p className="text-sm text-gray-700 line-clamp-3">{description.substring(0, 80)}...</p>
                        <a href={`#day-${dayNumber}`} className="text-blue-600 text-xs font-medium flex items-center mt-2">
                          <span>Detaylar</span>
                          <ChevronRightIcon className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-6">
                {Object.entries(itinerary).map(([day, description], index) => {
                  const dayNumber = day.replace('day', '');
                  return (
                    <div id={`day-${dayNumber}`} key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group scroll-mt-24">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-10 -mr-10 opacity-50"></div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-white text-xl font-bold">{dayNumber}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Gün {dayNumber}: {destinations[index % destinations.length] || ''}</h3>
                      </div>
                      <div className="p-8 group-hover:bg-blue-50/50 transition-colors duration-300">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="md:w-3/4">
                            <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
                          </div>
                          <div className="md:w-1/4 flex-shrink-0">
                            {index < tourImages.length && (
                              <div className="relative h-48 rounded-xl overflow-hidden shadow-md">
                                <Image
                                  src={tourImages[index]}
                                  alt={`Gün ${dayNumber} - ${destinations[index % destinations.length] || ''}`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                  style={{ objectFit: "cover" }}
                                  className="hover:scale-110 transition-transform duration-700"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Her günün alt kısmına aktiviteler ve beklentiler eklenebilir */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <h4 className="font-medium text-gray-900 mb-3">Günün Öne Çıkanları</h4>
                          <div className="flex flex-wrap gap-3">
                            {['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği'].map((meal, i) => (
                              <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckIcon className="h-3 w-3 mr-1" />
                                {meal}
                              </span>
                            ))}
                            {/* Aktivite etiketleri */}
                            {['Sanat ve Kültür', 'Doğa Yürüyüşü', 'Alışveriş', 'Plaj Aktiviteleri', 'Tarihi Gezi', 'Yerel Deneyim'].slice(0, (index % 4) + 2).map((activity, i) => (
                              <span key={`act-${i}`} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <CheckIcon className="h-3 w-3 mr-1" />
                                {activity}
                              </span>
                            ))}
                          </div>
                          
                          {/* Günlük Program Saatleri */}
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start">
                              <div className="p-1.5 bg-amber-100 rounded-lg mr-3 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Sabah</span>
                                <p className="text-sm text-gray-700">08:00 - 12:00</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="p-1.5 bg-blue-100 rounded-lg mr-3 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Öğle</span>
                                <p className="text-sm text-gray-700">12:00 - 16:00</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="p-1.5 bg-indigo-100 rounded-lg mr-3 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Akşam</span>
                                <p className="text-sm text-gray-700">16:00 - 20:00</p>
                              </div>
                            </div>
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
            <div id="booking" className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-xl transform transition-all duration-300 hover:shadow-2xl scroll-mt-24">
              {/* Üst Banner */}
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-16 -mr-16"></div>
                <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -mt-10 -ml-10"></div>
              </div>
              
              {/* İçerik */}
              <div className="relative pt-16 mt-8">
                <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-xl inline-block -mt-24 shadow-lg">Rezervasyon</h2>
                
                {/* Fiyat bilgisi */}
                <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-medium flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-600" />
                      Fiyat
                    </span>
                    <div className="text-right">
                      {tour.discount && tour.discount > 0 ? (
                        <>
                          <div className="flex items-center justify-end mb-1">
                            <span className="line-through text-gray-400 text-lg mr-2">{tour.price} ₺</span>
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">%{tour.discount} İndirim</span>
                          </div>
                          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{(tour.price - (tour.price * (tour.discount || 0) / 100)).toLocaleString('tr-TR')} ₺</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{tour.price.toLocaleString('tr-TR')} ₺</span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm text-right">kişi başı</p>
                  
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Toplam tutar ({tour.duration} gün):</span>
                      <span className="font-semibold text-gray-800">
                        {tour.discount && tour.discount > 0 
                          ? ((tour.price - (tour.price * (tour.discount || 0) / 100)) * tour.duration).toLocaleString('tr-TR') 
                          : (tour.price * tour.duration).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-gray-600 text-sm mb-6 bg-amber-50 border border-amber-100 rounded-lg p-3">
                  Bu sayfadan hızlı ön rezervasyon yapabilirsiniz. BottomBookingBar'ı kullanarak detaylı rezervasyon seçeneklerine ulaşabilirsiniz.
                </p>
                
                <div className="space-y-4">
                  <button className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all transform hover:translate-y-[-2px] shadow-lg hover:shadow-blue-500/25 flex items-center justify-center">
                    <CalendarDaysIcon className="w-6 h-6 mr-2" />
                    <span>Hızlı Rezervasyon</span>
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button className="group w-full bg-white text-blue-600 border-2 border-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:translate-y-[-2px] shadow-lg flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 mr-2" />
                    <span>Fiyat Bilgisi Al</span>
                    <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <div className="p-1 bg-green-100 rounded-full mr-3">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">Ücretsiz iptal</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-1 bg-green-100 rounded-full mr-3">
                      <CheckCircleIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">Anında onay</span>
                  </div>
                  <div className="mt-3 text-center border-t border-gray-100 pt-3">
                    <p className="text-sm text-gray-500 font-medium">Ödeme şimdi yapılmayacak</p>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Mobil Rezervasyon Kartı (Yalnızca Mobilde Görünür) */}
            <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-xl md:hidden">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <CalendarDaysIcon className="h-6 w-6 mr-2 text-blue-600" />
                Rezervasyon
              </h2>
              
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <span className="block text-gray-500 text-sm">Kişi başı</span>
                  {tour.discount && tour.discount > 0 ? (
                    <>
                      <span className="line-through text-gray-400 text-sm">{tour.price} ₺</span>
                      <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{(tour.price - (tour.price * (tour.discount || 0) / 100)).toLocaleString('tr-TR')} ₺</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{tour.price.toLocaleString('tr-TR')} ₺</span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                    Rezervasyon
                  </button>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 justify-center">
                <div className="p-1 bg-green-100 rounded-full mr-2">
                  <CheckCircleIcon className="w-3 h-3 text-green-600" />
                </div>
                <span>Ücretsiz iptal</span>
                <span className="mx-2">•</span>
                <div className="p-1 bg-green-100 rounded-full mr-2">
                  <CheckCircleIcon className="w-3 h-3 text-green-600" />
                </div>
                <span>Anında onay</span>
              </div>
            </div>

            {/* Diğer Bilgiler ve Kartlar */}
            <div className="space-y-8">
              {/* Tur Operatörü Bilgileri */}
              {tourOperator && (
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-blue-600" />
                    <span>Tur Operatörü</span>
                  </h2>
                  <div className="flex items-center mb-6">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden mr-4 border-4 border-gray-100 shadow-md">
                      <Image
                        src={tourOperator.logo || '/placeholder-image.jpg'}
                        alt={tourOperator.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{tourOperator.name}</h3>
                      <div className="flex items-center text-sm">
                        <div className="flex items-center text-yellow-400 mr-2">
                          {renderStars(4.8)}
                        </div>
                        <span className="text-gray-600">(24 değerlendirme)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 mb-6">
                    <p className="text-gray-700 leading-relaxed">{tourOperator.description?.substring(0, 150) || 'Tur operatörü hakkında bilgi bulunmamaktadır.'}...</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Sertifikalı
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tour.duration}+ yıl deneyim
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      Çok dilli rehberler
                    </div>
                  </div>
                  
                  <Link 
                    href={`/tour-operator/${tourOperator.id}`} 
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center group"
                  >
                    <span>Tur operatörü hakkında daha fazla bilgi</span>
                    <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Dahil Olanlar / Olmayanlar */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircleIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Dahil Olanlar / Olmayanlar
                </h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                    Dahil Olanlar
                  </h3>
                  <ul className="space-y-3">
                    {inclusions.map((item, index) => (
                      <li key={index} className="flex items-start bg-green-50 p-4 rounded-xl hover:bg-green-100 transition-colors">
                        <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <XCircleIcon className="w-5 h-5 mr-2 text-red-600" />
                    Dahil Olmayanlar
                  </h3>
                  <ul className="space-y-3">
                    {exclusions.map((item, index) => (
                      <li key={index} className="flex items-start bg-red-50 p-4 rounded-xl hover:bg-red-100 transition-colors">
                        <XCircleIcon className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
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
      
      {/* Animasyonlu Scroll İndikatörü */}
      <div className="fixed bottom-28 right-8 hidden md:flex flex-col items-center animate-bounce-subtle z-30">
        <div className="text-xs font-medium text-blue-600 mb-1">Daha Fazla</div>
        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      
      {/* Video Tour Düğmesi */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 hidden lg:block z-30">
        <button className="group relative w-16 h-16 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 transition-colors">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="absolute -left-24 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded">Video Turu</span>
        </button>
      </div>
      
      {/* Client componenti ekliyoruz */}
      <BottomBookingBar tour={tour} />
    </div>
  );
} 