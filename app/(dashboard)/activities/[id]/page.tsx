"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Users, Clock, Calendar, Car, Hotel, Map, Phone, ChevronRight, Edit, X } from "lucide-react";

export default function ExperienceDetailPage({ params }: { params: { id: string } }) {
    const [selectedDates, setSelectedDates] = useState<string>("");
    const [travelerCount, setTravelerCount] = useState<number>(1);
    const [roomCount, setRoomCount] = useState<number>(1);
    const [showAllItinerary, setShowAllItinerary] = useState<boolean>(false);
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [selectedActivityDetails, setSelectedActivityDetails] = useState<any>(null);
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleDateSelect = (date: string) => {
        setSelectedDates(date);
    };

    const handleTravelerCount = (count: number) => {
        setTravelerCount(count);
    };

    const handleRoomCount = (count: number) => {
        setRoomCount(count);
    };

    const handleActivitySelect = (activityId: string) => {
        if (selectedActivities.includes(activityId)) {
            setSelectedActivities(selectedActivities.filter(id => id !== activityId));
        } else {
            setSelectedActivities([...selectedActivities, activityId]);
        }
    };

    const handleActivityClick = (activity: any) => {
        setSelectedActivityDetails(activity);
        setShowModal(true);
    };

    // Örnek tur verisi
    const tour = {
        id: params.id,
        title: "Madrid Şehir Turu ve Aktiviteleri",
        description: "Madrid'in en güzel yerlerini keşfedin ve unutulmaz aktivitelere katılın.",
        longDescription: "Madrid'in büyüleyici sokaklarında yürüyüş, bisiklet turu ve yerel lezzetleri tadabileceğiniz gastronomi deneyimleri sizi bekliyor. Royal Palace, Prado Müzesi, Retiro Parkı ve daha fazlası...",
        location: "Madrid, İspanya",
        duration: "1-3 gün",
        price: 36,
        rating: 4.8,
        reviews: 423,
        included: [
            { title: "Bisiklet Turu", duration: "3 saat", price: "36 EUR" },
            { title: "Madrid Şehir Turu", duration: "9 saat", price: "238 EUR" },
            { title: "Tuk Tuk Turu", duration: "3 saat", price: "240 EUR" }
        ],
        features: [
            { title: "Ücretsiz iptal", description: "24 saat öncesine kadar" },
            { title: "Anında onay", description: "Hemen rezervasyon" },
            { title: "Mobil bilet", description: "Telefonda göster" }
        ],
        images: [
            "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1558642084-fd07fae5282e?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1562666956-333b9db8ed04?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1549867679-1d76c6634d19?q=80&w=2070&auto=format&fit=crop"
        ],
        activities: [
            {
                title: "Madrid Bisiklet Turu",
                rating: 10,
                reviews: 28,
                duration: "3 Saat",
                price: 36,
                image: "https://images.unsplash.com/photo-1558642084-fd07fae5282e",
                features: ["Ücretsiz iptal"]
            },
            {
                title: "Madrid Şehir Turu",
                rating: 9.5,
                reviews: 15,
                duration: "9 Saat",
                price: 238,
                image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4",
                features: ["Ücretsiz iptal"]
            },
            {
                title: "Madrid Tuk Tuk Turu",
                rating: 9.0,
                reviews: 8,
                duration: "3 Saat",
                price: 240,
                image: "https://images.unsplash.com/photo-1562666956-333b9db8ed04",
                features: ["Ücretsiz iptal"]
            },
            {
                title: "Tapas ve Şarap Turu",
                rating: 9.8,
                reviews: 42,
                duration: "4 Saat",
                price: 85,
                image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b",
                features: ["Ücretsiz iptal"]
            },
            {
                title: "Flamenco Gösterisi",
                rating: 9.6,
                reviews: 36,
                duration: "2 Saat",
                price: 45,
                image: "https://images.unsplash.com/photo-1583445095874-5e06f1dfc841",
                features: ["Ücretsiz iptal"]
            }
        ],
        itinerary: [
            { day: 1, title: "Madrid", description: "Madrid'e varış ve şehir turu" },
            { day: 2, title: "Madrid & Toledo", description: "Toledo'ya günübirlik gezi" },
            { day: 3, title: "Retiro Park", description: "Park gezisi ve sokak lezzetleri" },
            { day: 4, title: "Royal Palace", description: "Kraliyet Sarayı ve çevresi" },
            { day: 5, title: "Prado Museum", description: "Müze ziyareti ve sanat turu" }
        ]
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <span>Madrid</span>
                <ChevronRight className="w-4 h-4" />
                <span>Aktiviteler</span>
            </div>

            {/* Title Section */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{tour.title}</h1>

            {/* Photo Gallery and Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-4 gap-4 h-[400px]">
                        <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden">
                            <Image
                                src={tour.images[0]}
                                alt="Ana görsel"
                                fill
                                className="object-cover"
                            />
                            <button className="absolute left-4 bottom-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                                <Map className="w-4 h-4" />
                                Fotoğraflar
                            </button>
                        </div>
                        {tour.images.slice(1, 5).map((image, index) => (
                            <div key={index} className="relative rounded-xl overflow-hidden">
                                <Image
                                    src={image}
                                    alt={`Aktivite görseli ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fiyat Kartı */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">Başlangıç fiyatı</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-gray-900">{tour.price}</span>
                                    <span className="text-gray-500">EUR</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">★</span>
                                    <span className="font-medium">{tour.rating}</span>
                                </div>
                                <p className="text-sm text-gray-500">{tour.reviews} değerlendirme</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDateSelect(selectedDates)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors mb-3">
                            {selectedDates ? "Rezervasyon Yap" : "Tarih Seç"}
                        </button>
                        <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-200">
                            Seyahat Danışmanını Ara
                        </button>
                    </div>
                </div>
            </div>

            {/* Seyahat Detayları */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Description */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Tur Hakkında</h2>
                    <p className="text-gray-600">{tour.longDescription}</p>
                </div>

                {/* Dahil Olanlar */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none">
                                <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Seyahat Paketiniz
                        </span>
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { 
                                icon: (
                                    <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20.77 11.54L14.27 8.79L13.04 3.03C12.99 2.71 12.69 2.5 12.37 2.5H11.63C11.31 2.5 11.01 2.71 10.96 3.03L9.73 8.79L3.23 11.54C2.93 11.67 2.75 11.99 2.75 12.33V12.89C2.75 13.37 3.21 13.71 3.66 13.53L10.01 11.05L11.21 15.68L7.6 18.63C7.44 18.76 7.35 18.96 7.35 19.17V19.77C7.35 20.17 7.71 20.47 8.09 20.37L11.63 19.45C11.87 19.38 12.13 19.38 12.37 19.45L15.91 20.37C16.29 20.47 16.65 20.17 16.65 19.77V19.17C16.65 18.96 16.56 18.76 16.4 18.63L12.79 15.68L13.99 11.05L20.34 13.53C20.79 13.71 21.25 13.37 21.25 12.89V12.33C21.25 11.99 21.07 11.67 20.77 11.54Z" />
                                    </svg>
                                ),
                                title: "Uçak Bileti",
                                action: "Tarih seçin"
                            },
                            { 
                                icon: (
                                    <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 21H21" />
                                        <path d="M5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21" />
                                        <path d="M9 21V17C9 16.4696 9.21071 15.9609 9.58579 15.5858C9.96086 15.2107 10.4696 15 11 15H13C13.5304 15 14.0391 15.2107 14.4142 15.5858C14.7893 15.9609 15 16.4696 15 17V21" />
                                        <path d="M8 9H16" />
                                        <path d="M8 13H16" />
                                    </svg>
                                ),
                                title: "Konaklama",
                                action: "Tarih seçin"
                            },
                            { 
                                icon: (
                                    <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M7 17H17M5 17H19C20.1046 17 21 16.1046 21 15V11C21 9.89543 20.1046 9 19 9H5C3.89543 9 3 9.89543 3 11V15C3 16.1046 3.89543 17 5 17ZM8 17V19M16 17V19" />
                                        <path d="M7 9V7C7 5.89543 7.89543 5 9 5H15C16.1046 5 17 5.89543 17 7V9" />
                                        <circle cx="7" cy="13" r="1" />
                                        <circle cx="17" cy="13" r="1" />
                                    </svg>
                                ),
                                title: "Araç Kiralama",
                                action: "Tarih seçin"
                            },
                            { 
                                icon: (
                                    <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 5V7" />
                                        <path d="M9 5V7" />
                                        <path d="M15 17V19" />
                                        <path d="M9 17V19" />
                                        <path d="M5 9H19" />
                                        <path d="M5 15H19" />
                                        <rect x="3" y="5" width="18" height="14" rx="2" />
                                        <path d="M9 12H15" />
                                    </svg>
                                ),
                                title: "Turlar ve Biletler",
                                action: "Tarih seçin"
                            }
                        ].map((item, index) => (
                            <div key={index} 
                                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors bg-white cursor-pointer group"
                            >
                                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                    <p className="text-sm text-blue-500">{item.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {tour.features.map((feature, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-start gap-3">
                            <Map className="w-5 h-5 text-green-500 mt-1" />
                            <div>
                                <h3 className="font-medium text-gray-900">{feature.title}</h3>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Activities Grid */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Bu Rotadaki Aktiviteler</h2>
                        <p className="text-gray-600">Seyahatinizde yapabileceğiniz en popüler aktiviteler</p>
                    </div>
                </div>

                <div className="relative">
                    <button 
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-[2px] shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors border border-gray-200"
                        onClick={() => {
                            const container = document.querySelector('.activities-scroll');
                            if (container) {
                                container.scrollBy({ left: -300, behavior: 'smooth' });
                            }
                        }}
                    >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>

                    <div className="flex overflow-x-auto pb-4 gap-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 activities-scroll">
                        {tour.activities.map((activity, index) => (
                            <div 
                                key={index} 
                                className="flex-none w-[300px] snap-start"
                                onClick={() => handleActivityClick(activity)}
                            >
                                <div className="relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer h-full">
                                    <div className="relative h-[160px]">
                                        <Image
                                            src={activity.image}
                                            alt={activity.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-[2px] rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                                            <span className="text-yellow-400 text-sm">★</span>
                                            <span className="font-medium text-gray-900">{activity.rating}</span>
                                            <span className="text-gray-600 text-xs">({activity.reviews})</span>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-[2px] ${
                                                selectedActivities.includes(activity.title) 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-white/90 text-gray-700'
                                            }`}>
                                                {selectedActivities.includes(activity.title) ? (
                                                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : '+'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 mb-3">{activity.title}</h3>
                                        <div className="flex items-center justify-between text-sm mb-3">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                {activity.duration}
                                            </div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="font-bold text-gray-900">{activity.price}</span>
                                                <span className="text-gray-500">EUR</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {activity.features.map((feature, i) => (
                                                <span key={i} className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-[2px] shadow-lg flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors border border-gray-200"
                        onClick={() => {
                            const container = document.querySelector('.activities-scroll');
                            if (container) {
                                container.scrollBy({ left: 300, behavior: 'smooth' });
                            }
                        }}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Activity Detail Modal */}
            {showModal && selectedActivityDetails && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="relative h-[300px]">
                            <Image
                                src={selectedActivityDetails.image}
                                alt={selectedActivityDetails.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-[2px] flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute bottom-4 left-4">
                                <h2 className="text-2xl font-bold text-white mb-2">{selectedActivityDetails.title}</h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-white/90">
                                        <Clock className="w-4 h-4" />
                                        <span>{selectedActivityDetails.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white/90">
                                        <span className="text-yellow-400">★</span>
                                        <span>{selectedActivityDetails.rating}</span>
                                        <span>({selectedActivityDetails.reviews} değerlendirme)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {selectedActivityDetails.features.map((feature: string, i: number) => (
                                        <span key={i} className="text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-gray-900">{selectedActivityDetails.price}</span>
                                    <span className="text-gray-500">EUR</span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aktivite Hakkında</h3>
                                    <p className="text-gray-600">
                                        Madrid'in tarihi ve kültürel zenginliklerini keşfedin. Profesyonel rehber eşliğinde şehrin en önemli noktalarını ziyaret edin. Bu turda size özel bir deneyim sunuyoruz.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Dahil Olanlar</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-gray-600">
                                            <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Profesyonel rehber eşliğinde tur
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-600">
                                            <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Giriş biletleri
                                        </li>
                                        <li className="flex items-center gap-2 text-gray-600">
                                            <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Ekipman ve güvenlik malzemeleri
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-6 border-t border-gray-100">
                                    <button 
                                        onClick={() => {
                                            handleActivitySelect(selectedActivityDetails.title);
                                            setShowModal(false);
                                        }}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                    >
                                        {selectedActivities.includes(selectedActivityDetails.title) ? 'Aktiviteyi Çıkar' : 'Aktiviteyi Seç'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Selected Activities */}
            {selectedActivities.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Seçilen Aktiviteler</h2>
                    <div className="space-y-4">
                        {tour.activities
                            .filter(activity => selectedActivities.includes(activity.title))
                            .map((activity, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex items-start gap-6">
                                        <div className="relative w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={activity.image}
                                                alt={activity.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-medium text-gray-900">{activity.title}</h3>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <span className="text-yellow-400">★</span>
                                                    <span className="font-medium">{activity.rating}</span>
                                                    <span className="text-gray-500">({activity.reviews} reviews)</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mb-4">
                                                Madrid'in tarihi ve kültürel zenginliklerini keşfedin. Profesyonel rehber eşliğinde şehrin en önemli noktalarını ziyaret edin.
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        {activity.duration}
                                                    </div>
                                                    {activity.features.map((feature, i) => (
                                                        <span key={i} className="text-green-600">{feature}</span>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-xl font-bold text-gray-900">{activity.price}</span>
                                                            <span className="text-gray-500">EUR</span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">Kişi başı</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleActivitySelect(activity.title)}
                                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        {selectedActivities.includes(activity.title) ? 'Çıkar' : 'Ekle'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Itinerary Table */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tur Rotası</h2>
                <div className="grid grid-cols-1 gap-4">
                    {tour.itinerary.slice(0, showAllItinerary ? undefined : 3).map((day, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
                            <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                                <span className="text-blue-500 font-bold">{day.day}. Gün</span>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{day.title}</h3>
                                <p className="text-sm text-gray-500">{day.description}</p>
                            </div>
                        </div>
                    ))}
                    {!showAllItinerary && tour.itinerary.length > 3 && (
                        <button 
                            className="mx-auto py-2 px-4 flex items-center justify-center gap-1.5 text-blue-500 hover:text-blue-600 text-sm font-medium border border-gray-100 rounded-lg hover:border-blue-100 transition-colors"
                            onClick={() => setShowAllItinerary(true)}
                        >
                            Tüm rotayı görüntüle
                            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                        </button>
                    )}
                    {showAllItinerary && (
                        <button 
                            className="mx-auto py-2 px-4 flex items-center justify-center gap-1.5 text-blue-500 hover:text-blue-600 text-sm font-medium border border-gray-100 rounded-lg hover:border-blue-100 transition-colors"
                            onClick={() => setShowAllItinerary(false)}
                        >
                            Daha az göster
                            <ChevronRight className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
