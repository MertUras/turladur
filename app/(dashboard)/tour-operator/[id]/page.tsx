import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyTours, dummyTourOperators } from "@/app/lib/dummy-data";
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
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
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
          <StarIcon className="w-5 h-5 text-neutral-300 fill-neutral-300" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="w-5 h-5 text-neutral-300 fill-neutral-300" />
      );
    }
    
    return stars;
  };

  // Özellikleri ve onlara ait ikonları tanımlama
  const features = [
    { name: "Profesyonel Rehberler", icon: <UserGroupIcon className="w-5 h-5 text-sky-600" /> },
    { name: "Konforlu Ulaşım", icon: <ArrowTrendingUpIcon className="w-5 h-5 text-sky-600" /> },
    { name: "Kaliteli Konaklama", icon: <CheckCircleIcon className="w-5 h-5 text-sky-600" /> },
    { name: "Lisanslı Operatör", icon: <CheckCircleIcon className="w-5 h-5 text-sky-600" /> },
    { name: "7/24 Destek", icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-sky-600" /> },
    { name: "En İyi Fiyat Garantisi", icon: <CheckCircleIcon className="w-5 h-5 text-sky-600" /> }
  ];

  // Çalışma saatleri
  const workingHours = [
    { day: "Pazartesi - Cuma", hours: "09:00 - 18:00" },
    { day: "Cumartesi", hours: "10:00 - 16:00" },
    { day: "Pazar", hours: "Kapalı" }
  ];
  
  return (
    <main className="bg-neutral-50 text-neutral-800">
      {/* Hero Section - Refined */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <Image
          src={tourOperator.logo || '/placeholder-image.jpg'}
          alt={tourOperator.name}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="brightness-[0.75]" /* Slightly adjusted brightness */
        />
        {/* Subtler gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div> 
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center"> 
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 !leading-tight drop-shadow-lg">
              {tourOperator.name}
            </h1>
            {/* Refined info badges - Simpler background, no border/shadow */}
            <div className="flex flex-col items-center justify-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 text-neutral-200 mb-12 text-sm"> {/* Increased bottom margin */}
              <div className="flex items-center bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg"> {/* Simplified style */}
                <MapPinIcon className="w-4 h-4 mr-1.5 text-sky-300 flex-shrink-0" /> 
                <span className="truncate text-neutral-200">{tourOperator.city || 'İstanbul'}, {tourOperator.country || 'Türkiye'}</span> {/* Adjusted text color */}
              </div>
              <div className="flex items-center bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg"> {/* Simplified style */}
                <div className="flex items-center text-yellow-400 mr-1.5 flex-shrink-0"> 
                  {renderStars(4.8)} 
                </div>
                <span className="text-neutral-200">(24 değerlendirme)</span> {/* Adjusted text color */}
              </div>
              <div className="flex items-center bg-black/20 backdrop-blur-md px-4 py-2 rounded-lg"> {/* Simplified style */}
                <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-sky-300 flex-shrink-0" /> 
                <span className="text-neutral-200">{operatorTours.length} Aktif Tur</span> {/* Adjusted text color */}
              </div>
            </div>
            {/* Buttons remain the same as previous update */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 relative z-30"> 
              <Link 
                href="#tours" 
                 className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-sm inline-flex items-center text-sm"
              >
                <span>Turları Görüntüle</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" /> 
              </Link>
              <Link 
                href="#contact" 
                 className="px-6 py-3 bg-white hover:bg-neutral-100 text-sky-600 font-medium rounded-lg transition-colors shadow-sm border border-neutral-200 inline-flex items-center text-sm"
              >
                <span>İletişime Geç</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" /> 
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ana İçerik */}
      <div className="container mx-auto px-6 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol Kolon - Tur Operatörü Bilgileri */}
          <div className="lg:col-span-2 space-y-12">
            {/* Tur Operatörü Açıklaması */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50">
              <h2 className="text-3xl font-bold text-neutral-900 mb-6">Tur Operatörü Hakkında</h2>
              
              <div className="prose prose-lg max-w-none text-neutral-700 mb-8 leading-relaxed">
                <p>{tourOperator.description || 'Bu tur operatörü hakkında henüz detaylı bilgi bulunmamaktadır.'}</p>
                
                <p className="mt-4">
                  Turlarımızda en iyi deneyimi yaşamanız için profesyonel rehberlerimiz, konforlu ulaşım araçlarımız ve özenle seçilmiş konaklama imkanlarıyla hizmet veriyoruz. Her turumuzu en ince detayına kadar planlıyor ve misafirlerimizin unutulmaz anılarla dönmelerini sağlıyoruz.
                </p>
              </div>
              
              {/* Tur Operatörü Özellikleri - Simplified List */}
              <div className="mt-8 pt-6 border-t border-neutral-200"> {/* Added top border for separation */}
                <h3 className="text-xl font-bold text-neutral-900 mb-5 flex items-center"> {/* Adjusted margin */}
                  <CheckCircleIcon className="w-6 h-6 text-sky-600 mr-2" /> 
                  <span>Neden Bizi Tercih Etmelisiniz?</span>
                </h3>
                {/* Replaced grid of cards with a simpler list */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4"> 
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                       {/* Use a colored circle/icon container for visual interest but keep it simple */}
                       <div className="flex-shrink-0 mr-3">
                         {/* feature.icon already has text-sky-600 */} 
                         {feature.icon} 
                       </div>
                      <span className="text-neutral-700">{feature.name}</span> {/* Simple text */}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Turlar - Updated container and heading */}
            <div id="tours" className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50 scroll-mt-24"> {/* Updated styles */}
              {/* Removed colored bar, updated heading style */}
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">Turlarımız</h2>
              
              {operatorTours.length > 0 ? (
                <div className="space-y-8">
                  {operatorTours.map((tour, index) => {
                    const tourImages = parseJsonString<string[]>(tour.images, []);
                    
                    // Destinasyonları doğru şekilde parse et
                    const rawDestinations = parseJsonString<any[]>(tour.destinations, []);
                    const destinations = rawDestinations.map(dest => {
                      if (typeof dest === 'string') return dest;
                      if (typeof dest === 'object' && dest.city) return dest.city;
                      return '';
                    }).filter(dest => dest !== '');
                    
                    return (
                      <div 
                        key={tour.id} 
                        className="bg-white rounded-xl overflow-hidden shadow-md border border-neutral-200/50" 
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="relative h-72 md:h-auto overflow-hidden">
                            <Image
                              src={tourImages[0] || '/placeholder-image.jpg'}
                              alt={tour.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              style={{ objectFit: "cover" }}
                              className="transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex flex-wrap gap-2">
                                {destinations.slice(0, 3).map((destination, idx) => (
                                  <span key={idx} className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-xs font-medium border border-neutral-200/80">
                                    {destination}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="p-6 md:col-span-2 flex flex-col justify-between"> {/* Added flex flex-col */}
                            <div> {/* Content container */}
                              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                                <div className="flex-grow"> {/* Allow title to take space */}
                                  <h3 className="text-xl font-bold text-neutral-900 mb-2 transition-colors">{tour.name}</h3>
                                  <div className="flex flex-wrap items-center text-sm text-neutral-600 gap-x-4 gap-y-1 mb-3"> 
                                    <div className="flex items-center">
                                      <CalendarDaysIcon className="w-4 h-4 mr-1 text-sky-600" /> 
                                      <span>{tour.duration} gün</span>
                                    </div>
                                    <div className="flex items-center">
                                      <UserGroupIcon className="w-4 h-4 mr-1 text-sky-600" /> 
                                      <span>Maks. {tour.maxParticipants || 10} kişi</span>
                                    </div>
                                  </div>
                                </div>
                                {/* Price - Simplified display */}
                                <div className="text-right flex-shrink-0 md:pt-1"> 
                                  {tour.discount && tour.discount > 0 ? (
                                    <>
                                      <div className="flex items-center justify-end gap-2 mb-0.5">
                                        <span className="line-through text-neutral-400 text-base">{tour.price.toLocaleString('tr-TR')} ₺</span>
                                        <span className="bg-red-50 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-100">%{tour.discount}</span>
                                      </div>
                                      <span className="text-2xl font-bold text-sky-600">{(tour.price - (tour.price * (tour.discount || 0) / 100)).toLocaleString('tr-TR')} ₺</span>
                                    </>
                                  ) : (
                                    <span className="text-2xl font-bold text-sky-600">{tour.price.toLocaleString('tr-TR')} ₺</span>
                                  )}
                                  <p className="text-neutral-500 text-xs">kişi başı</p> {/* Smaller text */}
                                </div>
                              </div>
                              
                              <p className="text-neutral-700 mb-5 line-clamp-3">{tour.description}</p> 
                              
                              <div className="mb-6"> 
                                <h4 className="text-sm font-semibold text-neutral-900 mb-3">Tur Özellikleri</h4>
                                <div className="flex flex-wrap gap-2">
                                  {parseJsonString<string[]>(tour.inclusions, []).slice(0, 5).map((feature, index) => (
                                    <span key={index} className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs flex items-center border border-neutral-200">
                                      <CheckCircleIcon className="w-3 h-3 mr-1.5 text-green-600" /> {/* Adjusted margin */}
                                      {feature}
                                    </span>
                                  ))}
                                  {parseJsonString<string[]>(tour.inclusions, []).length > 5 && (
                                    <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-medium border border-sky-200">
                                      +{parseJsonString<string[]>(tour.inclusions, []).length - 5} daha
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Button aligned to bottom */}
                            <div className="flex justify-end mt-auto pt-4 border-t border-neutral-100"> 
                              <Link 
                                href={`/tour/${tour.id}`} 
                                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors shadow-sm inline-flex items-center text-sm"
                              >
                                <span>Detayları Gör</span>
                                <ArrowRightIcon className="w-4 h-4 ml-2" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-neutral-100 text-neutral-600 p-6 rounded-xl border border-neutral-200/80">
                  <p className="font-medium text-center">Bu tur operatörüne ait aktif tur bulunmamaktadır.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sağ Kolon - İletişim ve Harita - Updated Styles */}
          <div className="space-y-8">
            {/* İletişim Bilgileri - Updated */}
            <div id="contact" className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50 scroll-mt-24"> {/* Updated styles */}
              {/* Removed colored bar, updated heading style */}
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">İletişim Bilgileri</h2>
              
              <ul className="space-y-4"> {/* Adjusted spacing */}
                <li className="flex pt-4 border-t border-neutral-100 first:border-t-0 first:pt-0"> {/* Simplified list item */}
                  <div className="flex-shrink-0 p-2 bg-sky-100 rounded-lg mr-4 text-sky-700"> {/* Updated styles */}
                    <MapPinIcon className="w-5 h-5" /> {/* Slightly smaller icon */}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 mb-0.5">Adres</p> {/* Adjusted margin */}
                    <p className="text-neutral-600 text-sm">{tourOperator.address || '-'}, {tourOperator.city || '-'}, {tourOperator.country || '-'}</p> {/* Adjusted text color/size */}
                  </div>
                </li>
                <li className="flex pt-4 border-t border-neutral-100 first:border-t-0 first:pt-0"> {/* Updated styles, removed hover */}
                  <div className="p-2 bg-sky-100 rounded-lg mr-4 text-sky-700"> {/* Updated styles */}
                    <PhoneIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 mb-0.5">Telefon</p>
                    <p className="text-neutral-600 text-sm">{tourOperator.phone || '-'}</p>
                  </div>
                </li>
                <li className="flex pt-4 border-t border-neutral-100 first:border-t-0 first:pt-0"> {/* Updated styles, removed hover */}
                  <div className="p-2 bg-sky-100 rounded-lg mr-4 text-sky-700"> {/* Updated styles */}
                    <EnvelopeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 mb-0.5">E-posta</p>
                    <p className="text-neutral-600 text-sm">{tourOperator.email || '-'}</p>
                  </div>
                </li>
                <li className="flex pt-4 border-t border-neutral-100 first:border-t-0 first:pt-0"> {/* Updated styles, removed hover */}
                  <div className="p-2 bg-sky-100 rounded-lg mr-4 text-sky-700"> {/* Updated styles */}
                    <GlobeAltIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 mb-0.5">Web Sitesi</p>
                    <p className="text-neutral-600 text-sm">{tourOperator.website ? <Link href={tourOperator.website} target="_blank" className="hover:text-sky-600 transition-colors">{tourOperator.website}</Link> : '-'}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Çalışma Saatleri - Updated */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50"> {/* Updated styles */}
              {/* Removed colored bar, updated heading style */}
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Çalışma Saatleri</h2>
              
              {/* Updated inner container style */}
              <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200"> 
                <ul className="space-y-3"> {/* Adjusted spacing */}
                  {workingHours.map((item, index) => (
                    // Updated list item style
                    <li key={index} className="flex justify-between items-center pt-3 border-t border-neutral-100 first:border-t-0 first:pt-0">
                      <div className="flex items-center">
                        <ClockIcon className="w-5 h-5 text-sky-600 mr-2.5" /> {/* Adjusted margin */}
                        <span className="text-neutral-700 text-sm">{item.day}</span> {/* Updated text color */}
                      </div>
                      <span className="font-medium text-neutral-700 text-sm px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200/80"> {/* Adjusted badge style */}
                        {item.hours}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Konum ve Harita - Updated */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-neutral-200/50"> {/* Updated styles, added mb-8 */}
              {/* Removed colored bar, updated heading style */}
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Konum</h2>
              
              {/* Updated map placeholder style */}
              <div className="relative h-64 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100"> 
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4"> {/* Added padding */}
                    <MapPinIcon className="w-8 h-8 text-sky-500 mx-auto mb-2" /> {/* Adjusted size */}
                    <p className="text-neutral-500 text-sm">Harita Görüntüsü Burada Yer Alacak</p> {/* Adjusted text */}
                  </div>
                </div>
                {/* TODO: Add actual map component here */}
              </div>
              
              {/* Updated address display style */}
              {tourOperator.address && (
                <div className="mt-4 p-3 bg-neutral-100 rounded-lg border border-neutral-200/80">
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 text-sky-600 mr-2 flex-shrink-0" /> {/* Adjusted icon color */}
                    <p className="text-neutral-700 font-medium text-xs"> {/* Adjusted text */}
                      {tourOperator.address}, {tourOperator.city || 'İstanbul'}, {tourOperator.country || 'Türkiye'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Müşteri Temsilcisiyle Görüşme - CTA - Updated */}
            <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-2xl p-8 shadow-md relative overflow-hidden"> {/* Updated gradient, removed mt */}
              {/* Removed decorative circles */}
              
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Yardıma mı ihtiyacınız var?</h3> {/* Adjusted margin */}
              <p className="text-sky-100 mb-6 relative z-10 text-sm">Müşteri temsilcilerimiz tüm sorularınızı yanıtlamak için hazır.</p>
              
              {/* Updated button style */} 
              <Link 
                href="#contact" 
                className="px-6 py-3 bg-white hover:bg-neutral-100 text-sky-700 font-semibold rounded-lg transition-colors shadow-sm inline-flex items-center text-sm relative z-10" /* Adjusted button text color */
              >
                <span>Hemen İletişime Geçin</span>
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
