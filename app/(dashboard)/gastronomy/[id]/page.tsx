"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2, MapPin, Clock, ArrowLeft } from "lucide-react";

interface GastronomyExperience {
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

export default function GastronomyDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [experience, setExperience] = useState<GastronomyExperience | null>(null);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                setLoading(true);
                // Demo data for gastronomy experiences
                const experiences = {
                    1: {
                        id: 1,
                        title: "Gaziantep Mutfak Turu",
                        description: "UNESCO Yaratıcı Şehirler Ağı'nda gastronomi dalında yer alan Gaziantep'in zengin mutfak kültürünü keşfedin. Yöresel lezzetleri tadın, baharatçıları gezin ve geleneksel yemek yapım tekniklerini öğrenin.",
                        imageUrl: "https://picsum.photos/1920/1080?random=1",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        location: "Gaziantep",
                        duration: "6 saat",
                        popularityRate: 97,
                        features: [
                            "Profesyonel gastronomi rehberi",
                            "6 farklı restoranda tadım",
                            "Baharatçı ve baklavacı ziyareti",
                            "Yemek yapım demonstrasyonu",
                            "Tüm tadımlar dahil"
                        ],
                        recommendedClimate: {
                            season: "Tüm yıl boyunca",
                            temperature: "15-30°C",
                            conditions: "Kapalı ve açık mekanlar"
                        },
                        routeDetails: {
                            startPoint: "Gaziantep Kalesi",
                            endPoint: "Bakırcılar Çarşısı",
                            stops: [
                                "Tarihi Tahmis Kahvesi",
                                "Elmacı Pazarı",
                                "Zincirli Bedesten",
                                "Küşleme Restoran",
                                "İmam Çağdaş"
                            ],
                            difficulty: "Kolay - Yürüyüş gerektirir"
                        }
                    },
                    2: {
                        id: 2,
                        title: "Karadeniz Yemek Atölyesi",
                        description: "Karadeniz'in eşsiz mutfağını deneyimleyin. Hamsi, mısır ekmeği ve muhlama yapımını öğrenin, yerel şeflerle birlikte pişirin ve tadına bakın.",
                        imageUrl: "https://picsum.photos/1920/1080?random=2",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        location: "Trabzon",
                        duration: "4 saat",
                        popularityRate: 92,
                        features: [
                            "Yerel şef eşliğinde workshop",
                            "Tüm malzemeler dahil",
                            "Yemek tarifleri kitapçığı",
                            "Karadeniz kahvaltısı",
                            "Sertifika"
                        ],
                        recommendedClimate: {
                            season: "Sonbahar ve Kış",
                            temperature: "10-20°C",
                            conditions: "Kapalı mekan"
                        },
                        routeDetails: {
                            startPoint: "Trabzon Mutfak Akademisi",
                            endPoint: "Trabzon Mutfak Akademisi",
                            stops: [
                                "Yerel Pazar Ziyareti",
                                "Malzeme Seçimi",
                                "Yemek Yapım Atölyesi",
                                "Tadım Seansı"
                            ],
                            difficulty: "Kolay - Mutfakta çalışma"
                        }
                    },
                    3: {
                        id: 3,
                        title: "Ege Zeytinyağı Rotası",
                        description: "Ege'nin altın sıvısı zeytinyağının üretimini öğrenin, farklı zeytinyağlarının tadımını yapın ve yerel üreticilerle tanışın.",
                        imageUrl: "https://picsum.photos/1920/1080?random=3",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        location: "Ayvalık",
                        duration: "5 saat",
                        popularityRate: 95,
                        features: [
                            "Zeytin bahçesi turu",
                            "Zeytinyağı üretim tesisi ziyareti",
                            "Profesyonel tadım eğitimi",
                            "Zeytinyağlı ikramlar",
                            "Zeytinyağı hediyesi"
                        ],
                        recommendedClimate: {
                            season: "İlkbahar ve Sonbahar",
                            temperature: "15-25°C",
                            conditions: "Açık hava aktivitesi"
                        },
                        routeDetails: {
                            startPoint: "Ayvalık Merkez",
                            endPoint: "Zeytinyağı Müzesi",
                            stops: [
                                "Zeytin Bahçeleri",
                                "Üretim Tesisi",
                                "Tadım Atölyesi",
                                "Yerel Üretici Pazarı"
                            ],
                            difficulty: "Orta - Arazi yürüyüşü"
                        }
                    },
                    4: {
                        id: 4,
                        title: "Hatay Sokak Lezzetleri",
                        description: "UNESCO Gastronomi Şehri Hatay'ın meşhur sokak lezzetlerini keşfedin. Künefe, zahter, oruk gibi yerel tatları deneyimleyin.",
                        imageUrl: "https://picsum.photos/1920/1080?random=4",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        location: "Hatay",
                        duration: "4 saat",
                        popularityRate: 96,
                        features: [
                            "Yerel rehber eşliğinde tur",
                            "8 farklı sokak lezzeti",
                            "Tarihi çarşı turu",
                            "Künefe yapım gösterisi",
                            "Tüm tadımlar dahil"
                        ],
                        recommendedClimate: {
                            season: "İlkbahar ve Sonbahar",
                            temperature: "20-30°C",
                            conditions: "Açık hava yürüyüşü"
                        },
                        routeDetails: {
                            startPoint: "Uzun Çarşı",
                            endPoint: "Künefeciler Çarşısı",
                            stops: [
                                "Zahterci",
                                "Orukçu",
                                "Humus Dükkanı",
                                "Künefe Ustası"
                            ],
                            difficulty: "Kolay - Kısa yürüyüşler"
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
                        href="/gastronomi"
                        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
                    >
                        <button className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1e4ed8] transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Tüm Gastronomi Deneyimlerine Dön
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
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
                    <Link href="/gastronomi">
                        <button className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1e4ed8] transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Tüm Gastronomi Deneyimlerine Dön
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
                    <h2 className="text-2xl font-semibold text-gray-900">Aktivite Detayları</h2>

                    {/* Recommended Climate */}
                    <div className="border-b border-gray-200 pb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Tavsiye Edilen Koşullar</h3>
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
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Program Detayları</h3>
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
                                <span className="block text-sm font-medium text-gray-500 mb-2">Program Akışı</span>
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
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Aktiviteye Dahil Olanlar</h3>
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
        </div>
    );
} 