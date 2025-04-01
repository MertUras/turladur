"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2, MapPin, Clock, ArrowLeft } from "lucide-react";
import Footer from "../../../components/Footer";

interface Experience {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
    location: string;
    duration: string;
    features: string[];
    popularityRate: number;
    recommendedClimate: {
        season: string;
        temperature: string;
        conditions: string;
    };
    routeDetails: {
        startPoint: string;
        endPoint: string;
        stops: string[];
        difficulty: string;
    };
}

export default function ExperienceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [experience, setExperience] = useState<Experience | null>(null);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                setLoading(true);
                // For demo purposes, use sample data based on ID
                const experiences = {
                    1: {
                        id: 1,
                        title: "Kapadokya Balon Turu",
                        description: "Eşsiz peri bacaları manzarasında unutulmaz bir balon deneyimi yaşayın. Sabah gün doğumunda yapılan balon turları, vadiler üzerinde unutulmaz bir deneyim sunar. Ayrıca bölgedeki yeraltı şehirleri, açık hava müzeleri ve kaya oyma kiliseler görülmeye değerdir. Göreme Açık Hava Müzesi, Paşabağı Vadisi ve Uçhisar Kalesi mutlaka görülmesi gereken yerlerdir.",
                        imageUrl: "https://picsum.photos/1920/1080?random=1",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        location: "Kapadokya",
                        duration: "3 saat",
                        popularityRate: 95,
                        features: [
                            "Profesyonel rehber eşliğinde tur",
                            "Klimalı araçlarla ulaşım",
                            "Tüm giriş ücretleri dahil",
                            "Açık büfe kahvaltı dahil"
                        ],
                        recommendedClimate: {
                            season: "İlkbahar ve Sonbahar",
                            temperature: "10-20°C",
                            conditions: "Rüzgarsız ve açık hava"
                        },
                        routeDetails: {
                            startPoint: "Göreme Balon Kalkış Noktası",
                            endPoint: "Göreme Balon İniş Noktası",
                            stops: [
                                "Kızıl Vadi üzerinden uçuş",
                                "Aşk Vadisi panoramik görüntüleme",
                                "Güvercinlik Vadisi üzerinden geçiş",
                                "Uçhisar Kalesi etrafında tur"
                            ],
                            difficulty: "Kolay - Herkes için uygun"
                        }
                    },
                    2: {
                        id: 2,
                        title: "Pamukkale & Hierapolis Turu",
                        description: "Dünyaca ünlü travertenler ve antik kent Hierapolis'i keşfedin. Beyaz travertenlerin oluşturduğu doğal havuzlarda yürüyüş yapın ve antik Roma havuzunda yüzme deneyimi yaşayın. 2000 yıllık tarihi tiyatro, nekropol ve arkeolojik müzede tarihe yolculuk yapın.",
                        imageUrl: "https://picsum.photos/1920/1080?random=2",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        location: "Denizli",
                        duration: "8 saat",
                        popularityRate: 85,
                        features: [
                            "Profesyonel rehber eşliğinde tur",
                            "Lüks araçlarla ulaşım",
                            "Öğle yemeği dahil",
                            "Müze giriş ücretleri dahil",
                            "Antik havuz kullanımı opsiyonel"
                        ],
                        recommendedClimate: {
                            season: "Tüm yıl boyunca",
                            temperature: "15-30°C",
                            conditions: "Güneşli ve açık hava tercih edilir"
                        },
                        routeDetails: {
                            startPoint: "Pamukkale Otopark",
                            endPoint: "Hierapolis Antik Kenti Çıkışı",
                            stops: [
                                "Travertenler gezisi",
                                "Antik Roma Havuzu",
                                "Hierapolis Antik Tiyatro",
                                "Nekropol bölgesi",
                                "Arkeoloji Müzesi"
                            ],
                            difficulty: "Orta - Yürüyüş gerektirir"
                        }
                    },
                    3: {
                        id: 3,
                        title: "Efes Antik Kenti Turu",
                        description: "Dünyanın en iyi korunmuş antik kentlerinden birini keşfedin. Roma İmparatorluğu'nun en önemli şehirlerinden olan Efes'te, Celcius Kütüphanesi, Büyük Tiyatro, Hadrian Tapınağı ve antik caddelerde 2000 yıllık tarihe tanıklık edin.",
                        imageUrl: "https://picsum.photos/1920/1080?random=3",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        location: "İzmir",
                        duration: "6 saat",
                        popularityRate: 90,
                        features: [
                            "Uzman arkeolog rehber eşliğinde tur",
                            "Klimalı araçlarla ulaşım",
                            "Öğle yemeği dahil",
                            "Tüm giriş ücretleri dahil",
                            "Rehberli Meryem Ana Evi ziyareti"
                        ],
                        recommendedClimate: {
                            season: "İlkbahar ve Sonbahar",
                            temperature: "15-25°C",
                            conditions: "Güneşli, şapka önerilir"
                        },
                        routeDetails: {
                            startPoint: "Efes Antik Kenti Kuzey Kapısı",
                            endPoint: "Efes Antik Kenti Güney Kapısı",
                            stops: [
                                "Celcius Kütüphanesi",
                                "Büyük Tiyatro",
                                "Hadrian Tapınağı",
                                "Mermer Cadde",
                                "Meryem Ana Evi"
                            ],
                            difficulty: "Orta - Düzenli yürüyüş gerektirir"
                        }
                    },
                    4: {
                        id: 4,
                        title: "İstanbul Boğaz Turu",
                        description: "Tekne ile İstanbul Boğazı'nın eşsiz güzelliklerini keşfedin. Avrupa ve Asya kıtaları arasında, tarihi yalılar, köprüler ve saraylar eşliğinde unutulmaz bir deniz yolculuğu yapın. Boğaz'ın en güzel manzaralarını fotoğraflama fırsatı yakalayın.",
                        imageUrl: "https://picsum.photos/1920/1080?random=4",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        location: "İstanbul",
                        duration: "4 saat",
                        popularityRate: 88,
                        features: [
                            "Türkçe ve İngilizce rehber",
                            "Lüks tekne ile seyahat",
                            "Sınırsız çay servisi",
                            "Atıştırmalıklar dahil",
                            "Canlı müzik (akşam turlarında)"
                        ],
                        recommendedClimate: {
                            season: "Nisan-Ekim arası",
                            temperature: "15-28°C",
                            conditions: "Açık ve sakin deniz tercih edilir"
                        },
                        routeDetails: {
                            startPoint: "Kabataş İskelesi",
                            endPoint: "Kabataş İskelesi",
                            stops: [
                                "Dolmabahçe Sarayı görüntüleme",
                                "Ortaköy Camii ve Köprüsü",
                                "Rumeli Hisarı",
                                "Anadolu Hisarı",
                                "Beylerbeyi Sarayı"
                            ],
                            difficulty: "Kolay - Tekne turu"
                        }
                    }
                };

                const id = parseInt(params.id as string);
                const selectedExperience = experiences[id as keyof typeof experiences];

                if (!selectedExperience) {
                    throw new Error("Experience not found");
                }

                setExperience(selectedExperience);
            } catch (error) {
                console.error("Error fetching experience:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    if (!experience) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Deneyim bulunamadı</h2>
                    <p className="mt-2 text-gray-600">İstediğiniz deneyim mevcut değil.</p>
                    <Link
                        href="/experience"
                        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
                    >
                        <button className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1e4ed8] transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Tüm Deneyimlere Dön
                        </button>

                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Hero Section */}
            <div className="relative w-full h-[70vh] mt-16">
                <Image
                    src={experience.imageUrl}
                    alt={experience.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 z-20">
                    <Link href="/experience">
                        <button className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1e4ed8] transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Tüm Deneyimlere Dön
                        </button>
                    </Link>
                </div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
                    <h1 className="text-5xl font-bold mb-4">{experience.title}</h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-1" />
                            <span>{experience.location}</span>
                        </div>
                        <span className="text-white/60">•</span>
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-1" />
                            <span>{experience.duration}</span>
                        </div>
                    </div>
                </div>
                {experience.featured && (
                    <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white">
                            %{experience.popularityRate} Gezginin Rotasında
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {experience.description}
                </p>

                <div className="bg-gray-50 rounded-xl p-8 space-y-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Tur Detayları</h2>

                    {/* Recommended Climate */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tavsiye Edilen İklim Koşulları</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <span className="block text-sm font-medium text-gray-500">Sezon</span>
                                <span className="mt-1 block text-gray-900">{experience.recommendedClimate.season}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500">Sıcaklık</span>
                                <span className="mt-1 block text-gray-900">{experience.recommendedClimate.temperature}</span>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500">Hava Koşulları</span>
                                <span className="mt-1 block text-gray-900">{experience.recommendedClimate.conditions}</span>
                            </div>
                        </div>
                    </div>

                    {/* Route Details */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Rota Detayları</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-sm font-medium text-gray-500">Başlangıç Noktası</span>
                                    <span className="mt-1 block text-gray-900">{experience.routeDetails.startPoint}</span>
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-gray-500">Bitiş Noktası</span>
                                    <span className="mt-1 block text-gray-900">{experience.routeDetails.endPoint}</span>
                                </div>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500 mb-2">Rota Üzerindeki Duraklar</span>
                                <ul className="space-y-2">
                                    {experience.routeDetails.stops.map((stop, index) => (
                                        <li key={index} className="flex items-center text-gray-900">
                                            <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            {stop}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <span className="block text-sm font-medium text-gray-500">Zorluk Seviyesi</span>
                                <span className="mt-1 block text-gray-900">{experience.routeDetails.difficulty}</span>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Turladur Özel</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {experience.features.map((feature, index) => (
                                <div key={index} className="flex items-center text-gray-600">
                                    <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
