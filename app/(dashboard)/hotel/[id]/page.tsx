import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { 
  MapPinIcon, StarIcon, CheckIcon, UserIcon, PhotoIcon, 
  ArrowsPointingOutIcon, RectangleGroupIcon, UserGroupIcon,
  PhoneIcon, EnvelopeIcon, GlobeAltIcon, ClockIcon, MapIcon,
  ChatBubbleLeftRightIcon, BeakerIcon, BoltIcon, CakeIcon,
  CheckBadgeIcon, CloudIcon, FireIcon, SparklesIcon,
  TruckIcon, TvIcon, WifiIcon, ChevronDownIcon,
  QuestionMarkCircleIcon, BuildingLibraryIcon
} from '@heroicons/react/24/outline';

// Sabit veriler (normalde API'den gelecek)
const nearbyAttractions = [
  { name: "Tarihi Merkez", distance: "1.2 km", type: "Kültürel" },
  { name: "Plaj", distance: "0.5 km", type: "Doğal Güzellik" },
  { name: "Alışveriş Merkezi", distance: "2.3 km", type: "Alışveriş" },
  { name: "Restoran Bölgesi", distance: "0.8 km", type: "Yeme-İçme" }
];

// Sık sorulan sorular
const faqs = [
  {
    question: "Evcil hayvan kabul ediliyor mu?",
    answer: "Evet, küçük boyutlu evcil hayvanlar için ekstra ücret ile kabul edilmektedir. Rezervasyon sırasında lütfen bildiriniz."
  },
  {
    question: "Ücretsiz otopark var mı?",
    answer: "Evet, otelimizde misafirlerimiz için ücretsiz otopark bulunmaktadır."
  },
  {
    question: "Check-in/check-out saatleri nelerdir?",
    answer: "Check-in saat 14:00'ten itibaren, check-out ise en geç saat 12:00'a kadardır."
  },
  {
    question: "İptal politikası nedir?",
    answer: "Konaklamadan 48 saat öncesine kadar yapılan iptallerde herhangi bir ücret alınmaz. Daha sonra yapılan iptallerde bir gecelik konaklama bedeli tahsil edilir."
  }
];

interface HotelPageProps {
  params: {
    id: string;
  };
}

// Otel ve oda tipleri
interface Room {
  id: string;
  name: string;
  description?: string;
  type?: string;
  capacity?: number;
  price: number;
  discount?: number;
  size?: number;
  images: string[] | string;
  amenities: string[] | string;
  hotelId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    name: string;
    image: string;
  };
}

interface Hotel {
  id: string;
  name: string;
  description: string;
  images: string[] | string;
  address: string;
  city: string;
  country: string;
  stars: number;
  amenities: string[] | string;
  phone?: string;
  email?: string;
  website?: string;
  checkInTime?: string;
  checkOutTime?: string;
  rooms: Room[];
  reviews: Review[];
  user?: User;
}

// Dinamik metadata
export async function generateMetadata({ params }: HotelPageProps): Promise<Metadata> {
  try {
    const hotel = await getHotel(params.id);
    
    return {
      title: `${hotel.name} | TourTech`,
      description: hotel.description,
      openGraph: {
        title: `${hotel.name} | TourTech`,
        description: hotel.description,
        images: [
          {
            url: Array.isArray(hotel.images) && hotel.images.length > 0 
              ? hotel.images[0] 
              : '/placeholder-hotel.jpg',
            width: 1200,
            height: 630,
            alt: hotel.name
          }
        ]
      }
    };
  } catch (error) {
    return {
      title: 'Otel Detayı | TourTech',
      description: 'Otel detay sayfası'
    };
  }
}

// Otel verilerini getir
async function getHotel(id: string): Promise<Hotel> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/hotels/${id}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error('Otel yüklenirken hata oluştu');
    }
    
    return res.json();
  } catch (error) {
    console.error('Otel detayları getirilirken hata:', error);
    throw error;
  }
}

export default async function HotelPage({ params }: HotelPageProps) {
  const hotel = await getHotel(params.id);
  
  // Resimleri işle
  let hotelImages: string[] = [];
  let firstImageUrl = '';
  
  try {
    if (typeof hotel.images === 'string') {
      try {
        // String olarak gelen JSON'ı parse et
        const parsedImages = JSON.parse(hotel.images);
        console.log('Parse edilmiş resimler:', parsedImages);
        
        if (Array.isArray(parsedImages)) {
          // Dizi içindeki her bir öğeyi kontrol et
          hotelImages = parsedImages.filter((img: unknown) => typeof img === 'string');
        }
      } catch (parseError) {
        console.error('JSON parse hatası:', parseError);
      }
    } else if (Array.isArray(hotel.images)) {
      // Dizi içindeki her bir öğeyi kontrol et
      hotelImages = hotel.images.filter((img: unknown) => typeof img === 'string');
    }
    
    // Sonuçları kontrol et
    console.log('İşlenmiş otel resimleri:', hotelImages);
    
    // İlk geçerli resmi bul
    if (hotelImages.length > 0) {
      firstImageUrl = hotelImages[1];
    }
  } catch (error) {
    console.error('Otel resimleri işleme hatası:', error);
  }
  
  // İlk resim URL'sini kontrol et
  console.log('İlk resim URL:', firstImageUrl, typeof firstImageUrl);
  
  // Otel özelliklerini işle
  let hotelAmenities: string[] = [];
  try {
    if (typeof hotel.amenities === 'string') {
      const parsedAmenities = JSON.parse(hotel.amenities);
      
      // Eğer bir obje ise (key-value pairs)
      if (typeof parsedAmenities === 'object' && !Array.isArray(parsedAmenities)) {
        hotelAmenities = Object.keys(parsedAmenities).filter(key => parsedAmenities[key]);
      } 
      // Eğer bir dizi ise
      else if (Array.isArray(parsedAmenities)) {
        hotelAmenities = parsedAmenities.filter((amenity: unknown) => typeof amenity === 'string');
      }
    } else if (Array.isArray(hotel.amenities)) {
      hotelAmenities = hotel.amenities.filter((amenity: unknown) => typeof amenity === 'string');
    }
  } catch (error) {
    console.error('Otel özellikleri işleme hatası:', error);
  }

  // Odaları işle
  const rooms = hotel.rooms.map((room: Room) => {
    let roomImages: string[] = [];
    let roomAmenities: string[] = [];

    // Oda resimlerini işle
    if (typeof room.images === 'string') {
      try {
        const parsedImages = JSON.parse(room.images);
        if (Array.isArray(parsedImages)) {
          roomImages = parsedImages.filter((img: unknown) => typeof img === 'string');
        }
      } catch (e) {
        console.error(`Oda ${room.id} resimleri işleme hatası:`, e);
      }
    } else if (Array.isArray(room.images)) {
      roomImages = room.images.filter((img: unknown) => typeof img === 'string');
    }

    // Oda özelliklerini işle
    if (typeof room.amenities === 'string') {
      try {
        const parsedAmenities = JSON.parse(room.amenities);
        if (Array.isArray(parsedAmenities)) {
          roomAmenities = parsedAmenities.filter((a: unknown) => typeof a === 'string');
        } else if (typeof parsedAmenities === 'object') {
          roomAmenities = Object.keys(parsedAmenities).filter(key => parsedAmenities[key]);
        }
      } catch (e) {
        console.error(`Oda ${room.id} özellikleri işleme hatası:`, e);
      }
    } else if (Array.isArray(room.amenities)) {
      roomAmenities = room.amenities.filter((a: unknown) => typeof a === 'string');
    }

    return {
      ...room,
      parsedImages: roomImages,
      parsedAmenities: roomAmenities
    };
  });

  // Ortalama puanı hesapla
  const avgRating = hotel.reviews.length 
    ? hotel.reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / hotel.reviews.length 
    : 0;
  
  const formattedRating = avgRating.toFixed(1);

  // Yardımcı fonksiyonlar
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency', 
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2; // En yakın 0.5'e yuvarla
    
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        // Tam yıldız
        stars.push(
          <StarIcon key={i} className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        );
      } else if (i - 0.5 === roundedRating) {
        // Yarım yıldız (tam yıldız kullanıp opacity ile ayarlıyoruz)
        stars.push(
          <StarIcon key={i} className="h-5 w-5 text-yellow-400 opacity-50" aria-hidden="true" />
        );
      } else {
        // Boş yıldız
        stars.push(
          <StarIcon key={i} className="h-5 w-5 text-gray-300" aria-hidden="true" />
        );
      }
    }
    
    return stars;
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityIcons: Record<string, React.ReactNode> = {
      wifi: <WifiIcon className="h-5 w-5 text-gray-500" />,
      parking: <TruckIcon className="h-5 w-5 text-gray-500" />,
      breakfast: <CakeIcon className="h-5 w-5 text-gray-500" />,
      pool: <BeakerIcon className="h-5 w-5 text-gray-500" />,
      spa: <SparklesIcon className="h-5 w-5 text-gray-500" />,
      gym: <BoltIcon className="h-5 w-5 text-gray-500" />,
      restaurant: <FireIcon className="h-5 w-5 text-gray-500" />,
      bar: <GlobeAltIcon className="h-5 w-5 text-gray-500" />,
      airConditioner: <CloudIcon className="h-5 w-5 text-gray-500" />,
      tv: <TvIcon className="h-5 w-5 text-gray-500" />,
      // Diğer özellikler için varsayılan ikon
    };

    const lowerCaseAmenity = amenity.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return amenityIcons[lowerCaseAmenity] || <CheckBadgeIcon className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="bg-white">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex space-x-8">
              <a href="#overview" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Genel Bakış
              </a>
              <a href="#rooms" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Odalar
              </a>
              <a href="#amenities" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Özellikler
              </a>
              <a href="#nearby" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Yakın Yerler
              </a>
              <a href="#faq" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                SSS
              </a>
              <a href="#reviews" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Değerlendirmeler
              </a>
            </div>
            <Link href={`/booking?hotelId=${hotel.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Rezervasyon Yap
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero bölümü */}
      <div className="relative h-[60vh] md:h-[70vh] bg-gray-900">
        {firstImageUrl ? (
          <Image
            src={firstImageUrl}
            alt={hotel.name}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <PhotoIcon className="h-24 w-24 text-gray-500" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <MapPinIcon className="h-5 w-5 text-white" />
                <p className="text-white text-sm md:text-base">{hotel.city}, {hotel.country}</p>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{hotel.name}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white">
                <div className="flex items-center">
                  {[...Array(hotel.stars)].map((_, i) => (
                    <StarIcon key={i} className="h-6 w-6 text-yellow-400" />
                  ))}
                </div>
                
                {hotel.reviews.length > 0 && (
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="flex items-center gap-1">
                      {renderStars(avgRating)}
                      <span className="ml-2 text-sm font-medium">
                        {formattedRating} ({hotel.reviews.length} değerlendirme)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sol sütun - Otel detayları */}
          <div className="lg:col-span-2 space-y-12">
            {/* Açıklama */}
            <section id="overview" className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Otel Hakkında</h2>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">{hotel.description}</p>
              </div>
            </section>

            {/* Özellikler */}
            <section id="amenities" className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Otel Özellikleri</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {hotelAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-700 capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Yakındaki Yerler */}
            <section id="nearby" className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Yakındaki Yerler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nearbyAttractions.map((attraction, index) => (
                  <div key={index} className="flex items-start space-x-4 p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    <BuildingLibraryIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{attraction.name}</h3>
                      <p className="text-gray-600 mt-1">Uzaklık: {attraction.distance}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                        {attraction.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Otel Resimleri */}
            <section className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri</h2>
              {hotelImages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {hotelImages.map((image, index) => (
                    <div key={index} className="aspect-[4/3] relative rounded-xl overflow-hidden group">
                      <Image
                        src={image}
                        alt={`${hotel.name} resim ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-100 rounded-xl p-10 text-center">
                  <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Galeri resimleri mevcut değil</p>
                </div>
              )}
            </section>

            {/* SSS */}
            <section id="faq" className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sık Sorulan Sorular</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group rounded-xl border border-gray-200 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <QuestionMarkCircleIcon className="h-6 w-6 text-blue-500" />
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                      </div>
                      <ChevronDownIcon className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Odalar */}
            <section id="rooms" className="scroll-mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Odalarımız</h2>
              <div className="space-y-8">
                {rooms.map((room) => (
                  <div key={room.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                      {/* Oda resmi */}
                      <div className="relative h-72 md:h-full group">
                        {room.parsedImages && room.parsedImages.length > 0 ? (
                          <Image
                            src={room.parsedImages[0]}
                            alt={room.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <PhotoIcon className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Oda bilgileri */}
                      <div className="p-8 md:col-span-2">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{room.name}</h3>
                            <p className="text-gray-700 text-lg mb-6">{room.description}</p>
                            
                            {/* Oda özellikleri */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              {room.type && (
                                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                                  <RectangleGroupIcon className="h-5 w-5 text-gray-500" />
                                  <span className="text-gray-700">Tip: {room.type}</span>
                                </div>
                              )}
                              
                              {room.capacity && (
                                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                                  <UserGroupIcon className="h-5 w-5 text-gray-500" />
                                  <span className="text-gray-700">Kapasite: {room.capacity} kişi</span>
                                </div>
                              )}
                              
                              {room.size && (
                                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                                  <ArrowsPointingOutIcon className="h-5 w-5 text-gray-500" />
                                  <span className="text-gray-700">Boyut: {room.size} m²</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Oda özellikleri */}
                            {room.parsedAmenities && room.parsedAmenities.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-6">
                                {room.parsedAmenities.slice(0, 5).map((amenity, index) => (
                                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                    <CheckIcon className="mr-1.5 h-4 w-4" /> 
                                    {amenity}
                                  </span>
                                ))}
                                
                                {room.parsedAmenities.length > 5 && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                    +{room.parsedAmenities.length - 5} daha
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Fiyat ve buton */}
                          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                            <div>
                              <span className="text-3xl font-bold text-blue-600">
                                {formatPrice(room.price)}
                              </span>
                              <span className="text-gray-500 text-sm ml-2">/ gece</span>
                            </div>
                            
                            <Link href={`/booking?hotelId=${hotel.id}&roomId=${room.id}`}
                              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                              Rezervasyon Yap
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Değerlendirmeler */}
            <section id="reviews" className="scroll-mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Değerlendirmeler</h2>
                <div className="flex items-center gap-4">
                  <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    {hotel.reviews.length} değerlendirme
                  </span>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full">
                      <StarIcon className="h-5 w-5" />
                      <span className="font-medium">{formattedRating}</span>
                    </div>
                  )}
                </div>
              </div>

              {hotel.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hotel.reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          {review.user.image ? (
                            <Image
                              src={review.user.image}
                              alt={review.user.name}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-blue-600" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{review.user.name}</h4>
                              <div className="flex items-center mt-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 prose prose-sm max-w-none text-gray-700">
                            <p className="text-base">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Henüz değerlendirme yok</h3>
                  <p className="text-gray-500 text-lg max-w-md mx-auto">
                    Bu otel için henüz değerlendirme yapılmamış. Konaklamanızdan sonra ilk değerlendirmeyi siz yapabilirsiniz.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sağ sütun - Yan bilgiler */}
          <div className="space-y-6">
            {/* İletişim kartı */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Otel Bilgileri</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPinIcon className="h-6 w-6 text-blue-500 mt-0.5 mr-4" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Adres</h4>
                    <address className="text-base text-gray-600 not-italic mt-1">
                      {hotel.address}<br />
                      {hotel.city}, {hotel.country}
                    </address>
                  </div>
                </div>
                
                {hotel.phone && (
                  <div className="flex items-start">
                    <PhoneIcon className="h-6 w-6 text-blue-500 mt-0.5 mr-4" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Telefon</h4>
                      <p className="text-base text-gray-600 mt-1">{hotel.phone}</p>
                    </div>
                  </div>
                )}
                
                {hotel.email && (
                  <div className="flex items-start">
                    <EnvelopeIcon className="h-6 w-6 text-blue-500 mt-0.5 mr-4" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">E-posta</h4>
                      <p className="text-base text-gray-600 mt-1">{hotel.email}</p>
                    </div>
                  </div>
                )}
                
                {hotel.website && (
                  <div className="flex items-start">
                    <GlobeAltIcon className="h-6 w-6 text-blue-500 mt-0.5 mr-4" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Website</h4>
                      <a href={hotel.website} target="_blank" rel="noopener noreferrer" 
                        className="text-base text-blue-600 hover:text-blue-800 mt-1 block">
                        {hotel.website}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <ClockIcon className="h-6 w-6 text-blue-500 mt-0.5 mr-4" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Giriş/Çıkış</h4>
                    <p className="text-base text-gray-600 mt-1">
                      Giriş: {hotel.checkInTime || '14:00'}<br />
                      Çıkış: {hotel.checkOutTime || '12:00'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link href={`/booking?hotelId=${hotel.id}`} 
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  Oda Rezervasyonu Yap
                </Link>
              </div>
            </div>
            
            {/* Harita */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-square relative">
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-base">Harita burada gösterilecek</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
