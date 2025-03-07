import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyTourOperators, dummyTours } from "@/app/lib/dummy-data";
import { parseJsonString } from "@/app/utils/format";
import {
  MapPinIcon,
  StarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";

interface TourOperatorPageProps {
  params: {
    id: string;
  };
}

export default async function TourOperatorPage({ params }: TourOperatorPageProps) {
  // Tur operatörü verilerini al
  const tourOperator = dummyTourOperators.find((operator) => operator.id === params.id);
  
  // Tur operatörü bulunamazsa 404 sayfasına yönlendir
  if (!tourOperator) {
    notFound();
  }
  
  // Tur operatörüne ait turları al
  const operatorTours = dummyTours.filter((tour) => tour.tourOperatorId === tourOperator.id);
  
  // Rating stars oluşturma fonksiyonu
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="w-5 h-5 text-gray-300 fill-gray-300" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-gray-300" />
      );
    }
    
    return stars;
  };

  // Özellikleri ve onlara ait ikonları tanımlama
  const features = [
    { name: "Profesyonel Rehberler", icon: <UserGroupIcon className="w-5 h-5 text-blue-600" /> },
    { name: "Konforlu Ulaşım", icon: <ArrowTrendingUpIcon className="w-5 h-5 text-blue-600" /> },
    { name: "Kaliteli Konaklama", icon: <CheckCircleIcon className="w-5 h-5 text-blue-600" /> },
    { name: "Lisanslı Operatör", icon: <CheckCircleIcon className="w-5 h-5 text-blue-600" /> },
    { name: "7/24 Destek", icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-600" /> },
    { name: "En İyi Fiyat Garantisi", icon: <CheckCircleIcon className="w-5 h-5 text-blue-600" /> }
  ];

  // Çalışma saatleri
  const workingHours = [
    { day: "Pazartesi - Cuma", hours: "09:00 - 18:00" },
    { day: "Cumartesi", hours: "10:00 - 16:00" },
    { day: "Pazar", hours: "Kapalı" }
  ];
  
  return (
    <div className="bg-gray-50">
      {/* Üst Banner */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <Image
          src={tourOperator.logo || '/placeholder-image.jpg'}
          alt={tourOperator.name}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70"></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center">
            <div className="inline-block mb-2 sm:mb-4 animate-float">
              <div className="h-1 w-16 sm:w-24 bg-blue-400 mb-1 mx-auto"></div>
              <div className="h-1 w-8 sm:w-12 bg-blue-500 mx-auto"></div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-6 drop-shadow-lg">
              {tourOperator.name}
            </h1>
            <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-0 md:flex-row md:space-x-4 lg:space-x-6 text-white mb-4 sm:mb-6 md:mb-8">
              <div className="flex items-center bg-black/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base w-full max-w-xs md:max-w-none md:w-auto">
                <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-blue-300 flex-shrink-0" />
                <span className="truncate">{tourOperator.city || 'İstanbul'}, {tourOperator.country || 'Türkiye'}</span>
              </div>
              
              <div className="flex items-center bg-black/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base w-full max-w-xs md:max-w-none md:w-auto">
                <div className="flex items-center text-yellow-400 mr-1.5 sm:mr-2 flex-shrink-0">
                  {renderStars(4.8)}
                </div>
                <span>(24 değerlendirme)</span>
              </div>
              
              <div className="flex items-center bg-black/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base w-full max-w-xs md:max-w-none md:w-auto">
                <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-blue-300 flex-shrink-0" />
                <span>{operatorTours.length} Aktif Tur</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 relative z-30">
              <Link 
                href="#tours" 
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all transform hover:translate-y-[-2px] shadow-lg hover:shadow-blue-500/25 flex items-center justify-center w-full sm:w-auto"
              >
                <span>Turları Görüntüle</span>
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#contact" 
                className="group bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all transform hover:translate-y-[-2px] shadow-lg flex items-center justify-center w-full sm:w-auto"
              >
                <span>İletişime Geç</span>
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Dalga Efekti Alt Kısmı */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path 
              fill="#f9fafb" 
              fillOpacity="1" 
              d="M0,192L60,176C120,160,240,128,360,138.7C480,149,600,203,720,213.3C840,224,960,192,1080,160C1200,128,1320,96,1380,80L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container px-4 py-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol Kolon - Tur Operatörü Bilgileri */}
          <div className="lg:col-span-2">
            {/* Tur Operatörü Açıklaması */}
            <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-10 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-900">Tur Operatörü Hakkında</h2>
              </div>
              
              <div className="prose prose-lg text-gray-700 mb-8 leading-relaxed">
                <p>{tourOperator.description || 'Bu tur operatörü hakkında henüz detaylı bilgi bulunmamaktadır.'}</p>
                
                <p className="mt-4">
                  Turlarımızda en iyi deneyimi yaşamanız için profesyonel rehberlerimiz, konforlu ulaşım araçlarımız ve özenle seçilmiş konaklama imkanlarıyla hizmet veriyoruz. Her turumuzu en ince detayına kadar planlıyor ve misafirlerimizin unutulmaz anılarla dönmelerini sağlıyoruz.
                </p>
              </div>
              
              {/* Tur Operatörü Özellikleri */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircleIcon className="w-6 h-6 text-blue-600 mr-2" />
                  <span>Neden Bizi Tercih Etmelisiniz?</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]"
                    >
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        {feature.icon}
                      </div>
                      <span className="text-gray-800 font-medium">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Turlar */}
            <div id="tours" className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-100 scroll-mt-24">
              <div className="flex items-center mb-8">
                <div className="h-10 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-900">Turlarımız</h2>
              </div>
              
              {operatorTours.length > 0 ? (
                <div className="space-y-8">
                  {operatorTours.map((tour, index) => {
                    const tourImages = parseJsonString<string[]>(tour.images, []);
                    const destinations = parseJsonString<string[]>(tour.destinations, []);
                    
                    return (
                      <div 
                        key={tour.id} 
                        className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                        style={{ 
                          animationDelay: `${index * 150}ms`,
                          opacity: 0,
                          animation: 'fadeIn 0.5s ease-out forwards' 
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="relative h-72 md:h-auto overflow-hidden">
                            <Image
                              src={tourImages[0] || '/placeholder-image.jpg'}
                              alt={tour.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              style={{ objectFit: "cover" }}
                              className="group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex flex-wrap gap-2">
                                {destinations.slice(0, 3).map((destination, idx) => (
                                  <span key={idx} className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                                    {destination}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="p-6 md:col-span-2">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{tour.name}</h3>
                                <div className="flex flex-wrap items-center text-sm text-gray-600 gap-2 mb-3">
                                  <div className="flex items-center">
                                    <CalendarDaysIcon className="w-4 h-4 mr-1 text-blue-600" />
                                    <span>{tour.duration} gün</span>
                                  </div>
                                  <span>•</span>
                                  <div className="flex items-center">
                                    <UserGroupIcon className="w-4 h-4 mr-1 text-blue-600" />
                                    <span>Maks. {tour.maxParticipants || 10} kişi</span>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-inner">
                                <div className="text-right">
                                  {tour.discount && tour.discount > 0 ? (
                                    <>
                                      <div className="flex items-center justify-end mb-1">
                                        <span className="line-through text-gray-400 text-lg mr-2">{tour.price} ₺</span>
                                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">%{tour.discount} İndirim</span>
                                      </div>
                                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{(tour.price - (tour.price * (tour.discount || 0) / 100)).toLocaleString('tr-TR')} ₺</span>
                                    </>
                                  ) : (
                                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{tour.price.toLocaleString('tr-TR')} ₺</span>
                                  )}
                                  <p className="text-gray-500 text-sm">kişi başı</p>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-gray-700 mb-4 line-clamp-3">{tour.description}</p>
                            
                            <div className="mb-5">
                              <h4 className="text-sm font-semibold text-gray-900 mb-3">Tur Özellikleri</h4>
                              <div className="flex flex-wrap gap-2">
                                {parseJsonString<string[]>(tour.inclusions, []).slice(0, 5).map((feature, index) => (
                                  <span key={index} className="pill-tag bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center">
                                    <CheckCircleIcon className="w-3 h-3 mr-1 text-green-600" />
                                    {feature}
                                  </span>
                                ))}
                                {parseJsonString<string[]>(tour.inclusions, []).length > 5 && (
                                  <span className="pill-tag bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                    +{parseJsonString<string[]>(tour.inclusions, []).length - 5} daha
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <Link 
                                href={`/tour/${tour.id}`} 
                                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:translate-y-[-2px] shadow-md hover:shadow-blue-500/25 flex items-center"
                              >
                                <span>Detayları Gör</span>
                                <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-blue-50 text-blue-800 p-6 rounded-xl border border-blue-100">
                  <p className="font-medium text-center">Bu tur operatörüne ait aktif tur bulunmamaktadır.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kolon - İletişim ve Harita */}
          <div>
            {/* İletişim Bilgileri */}
            <div id="contact" className="bg-white rounded-2xl p-8 mb-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 scroll-mt-24">
              <div className="flex items-center mb-6">
                <div className="h-8 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-900">İletişim Bilgileri</h2>
              </div>
              
              <ul className="space-y-5">
                <li className="flex p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4 text-blue-800">
                    <MapPinIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Adres</p>
                    <p className="text-gray-700">{tourOperator.address || 'Adres bilgisi bulunmamaktadır.'}, {tourOperator.city || 'İstanbul'}, {tourOperator.country || 'Türkiye'}</p>
                  </div>
                </li>
                <li className="flex p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4 text-blue-800">
                    <PhoneIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Telefon</p>
                    <p className="text-gray-700">{tourOperator.phone || '+90 (212) 123 45 67'}</p>
                  </div>
                </li>
                <li className="flex p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4 text-blue-800">
                    <EnvelopeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">E-posta</p>
                    <p className="text-gray-700">{tourOperator.email || 'info@touroperator.com'}</p>
                  </div>
                </li>
                <li className="flex p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4 text-blue-800">
                    <GlobeAltIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Web Sitesi</p>
                    <p className="text-gray-700">{tourOperator.website || 'www.touroperator.com'}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Çalışma Saatleri */}
            <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-8 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-900">Çalışma Saatleri</h2>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-inner border border-blue-100">
                <ul className="space-y-4">
                  {workingHours.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-blue-100/50">
                      <div className="flex items-center">
                        <ClockIcon className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-gray-700">{item.day}</span>
                      </div>
                      <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full text-sm shadow-sm">
                        {item.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Konum ve Harita */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="h-8 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-900">Konum</h2>
              </div>
              
              <div className="relative h-64 rounded-xl overflow-hidden border border-gray-200">
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPinIcon className="w-10 h-10 text-blue-600 mx-auto mb-2 animate-bounce-subtle" />
                    <p className="text-gray-500">Harita görüntüsü</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center">
                  <MapPinIcon className="w-5 h-5 text-blue-700 mr-2" />
                  <p className="text-blue-700 font-medium">
                    {tourOperator.address || 'Adres Bilgisi Yok'}, {tourOperator.city || 'İstanbul'}, {tourOperator.country || 'Türkiye'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Müşteri Temsilcisiyle Görüşme - CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mt-8 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10"></div>
              
              <h3 className="text-xl font-bold text-white mb-4 relative z-10">Yardıma mı ihtiyacınız var?</h3>
              <p className="text-white/90 mb-6 relative z-10">Müşteri temsilcilerimiz tüm sorularınızı yanıtlamak için hazır.</p>
              
              <Link 
                href="#contact" 
                className="group bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold inline-flex items-center shadow-lg hover:bg-blue-50 transition-all transform hover:translate-y-[-2px] relative z-10"
              >
                <span>Hemen İletişime Geçin</span>
                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
