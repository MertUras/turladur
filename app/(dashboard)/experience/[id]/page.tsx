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
                // For demo purposes, use sample data
                const demoExperience: Experience = {
                    id: parseInt(params.id as string),
                    title: "Kapadokya Balon Turu",
                    description: "Eşsiz peri bacaları manzarasında unutulmaz bir balon deneyimi yaşayın. Sabah gün doğumunda yapılan balon turları, vadiler üzerinde unutulmaz bir deneyim sunar. Ayrıca bölgedeki yeraltı şehirleri, açık hava müzeleri ve kaya oyma kiliseler görülmeye değerdir. Göreme Açık Hava Müzesi, Paşabağı Vadisi ve Uçhisar Kalesi mutlaka görülmesi gereken yerlerdir. Yöresel lezzetleri tatmak ve çömlek yapımını deneyimlemek için özel atölyelere katılabilirsiniz.",
                    imageUrl: "https://picsum.photos/1920/1080?random=1",
                    featured: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    location: "Kapadokya",
                    duration: "3 saat",
                    popularityRate: 90,
                    features: [
                        "Profesyonel rehber eşliğinde tur",
                        "Klimalı araçlarla ulaşım",
                        "Tüm giriş ücretleri dahil",
                        "Açık büfe kahvaltı dahil"
                    ]
                };

                setExperience(demoExperience);
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
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Tüm deneyimlere dön
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
                <Link
                    href="/experience"
                    className="absolute top-4 left-4 inline-flex items-center rounded-lg bg-white/10 backdrop-blur-sm px-3 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Tüm deneyimlere dön
                </Link>
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

                <div className="bg-gray-50 rounded-xl p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tur Detayları</h2>
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

            <Footer />
        </div>
    );
}
