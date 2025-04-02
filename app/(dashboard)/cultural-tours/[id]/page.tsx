"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2, MapPin, Clock, ArrowLeft } from "lucide-react";

interface CultureExperience {
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

export default function CultureDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [experience, setExperience] = useState<CultureExperience | null>(null);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                setLoading(true);
                // Demo data for culture experiences
                const experiences = {
                    1: {
                        id: 1,
                        title: "Kapadokya Yeraltı Şehirleri",
                        description: "Derinkuyu ve Kaymaklı yeraltı şehirlerinin gizemli dünyasını keşfedin. Binlerce yıllık tarihe sahip bu yeraltı şehirlerinde, antik yaşamın izlerini sürerken, inanılmaz mimari ve mühendislik harikalarına tanık olun.",
                        imageUrl: "https://picsum.photos/1920/1080?random=5",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        location: "Nevşehir",
                        duration: "7 saat",
                        popularityRate: 94,
                        features: [
                            "Profesyonel rehber eşliğinde tur",
                            "Yeraltı şehirlerine giriş ücretleri",
                            "Öğle yemeği",
                            "Ulaşım",
                            "Sigorta"
                        ],
                        recommendedClimate: {
                            season: "Tüm yıl boyunca",
                            temperature: "12-22°C",
                            conditions: "Yeraltında sabit sıcaklık"
                        },
                        routeDetails: {
                            startPoint: "Nevşehir Merkez",
                            endPoint: "Nevşehir Merkez",
                            stops: [
                                "Derinkuyu Yeraltı Şehri",
                                "Yerel Çömlek Atölyesi",
                                "Öğle Yemeği Molası",
                                "Kaymaklı Yeraltı Şehri",
                                "Ürgüp Panorama"
                            ],
                            difficulty: "Orta - Dar ve alçak geçitler içerir"
                        }
                    },
                    2: {
                        id: 2,
                        title: "Efes Antik Kenti Turu",
                        description: "2000 yıllık tarihe sahip Efes Antik Kenti'nin muhteşem yapılarını görün. Roma İmparatorluğu'nun en önemli şehirlerinden biri olan Efes'te, Celcius Kütüphanesi, Büyük Tiyatro ve Hadrian Tapınağı gibi etkileyici yapıları keşfedin.",
                        imageUrl: "https://picsum.photos/1920/1080?random=6",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        location: "İzmir",
                        duration: "6 saat",
                        popularityRate: 96,
                        features: [
                            "Arkeolog rehber eşliğinde tur",
                            "Antik kent giriş ücreti",
                            "Öğle yemeği",
                            "Ulaşım",
                            "Müze kart"
                        ],
                        recommendedClimate: {
                            season: "İlkbahar ve Sonbahar",
                            temperature: "15-25°C",
                            conditions: "Güneşli, az bulutlu"
                        },
                        routeDetails: {
                            startPoint: "Selçuk Otogar",
                            endPoint: "Selçuk Otogar",
                            stops: [
                                "Meryem Ana Evi",
                                "Efes Antik Kenti Giriş",
                                "Celcius Kütüphanesi",
                                "Büyük Tiyatro",
                                "Hadrian Tapınağı"
                            ],
                            difficulty: "Kolay - Düz yollar, hafif yokuşlar"
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
                        href="/kultur-turlari"
                        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
                    >
                        <button className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1e4ed8] transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Tüm Kültür Turlarına Dön
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
                    <Link href="/kultur-turlari">
                        <button className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1e4ed8] transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Tüm Kültür Turlarına Dön
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