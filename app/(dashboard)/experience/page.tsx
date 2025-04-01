"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Clock, ChevronLeft, ChevronRight, Search } from "lucide-react";
import Footer from "../../components/Footer";

interface Experience {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    featured: boolean;
    createdAt: string;
    location: string;
    duration: string;
    rating: number;
    reviewCount: number;
    popularityRate: number;
}

export default function ExperiencesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Fetch experiences from API or use demo data
    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setLoading(true);
                // For demo purposes, use sample data
                setExperiences([
                    {
                        id: 1,
                        title: "Kapadokya Balon Turu",
                        description: "Eşsiz peri bacaları manzarasında unutulmaz bir balon deneyimi yaşayın",
                        imageUrl: "https://picsum.photos/800/500?random=1",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        location: "Kapadokya",
                        duration: "3 saat",
                        rating: 4.8,
                        reviewCount: 423,
                        popularityRate: 90
                    },
                    {
                        id: 2,
                        title: "Pamukkale & Hierapolis Turu",
                        description: "Doğal travertenleri ve antik kenti keşfedin",
                        imageUrl: "https://picsum.photos/800/500?random=2",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        location: "Denizli",
                        duration: "8 saat",
                        rating: 4.7,
                        reviewCount: 182,
                        popularityRate: 85
                    },
                    {
                        id: 3,
                        title: "Efes Antik Kenti Turu",
                        description: "Dünyanın en iyi korunmuş antik kentlerinden birini ziyaret edin",
                        imageUrl: "https://picsum.photos/800/500?random=3",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        location: "İzmir",
                        duration: "6 saat",
                        rating: 4.9,
                        reviewCount: 128,
                        popularityRate: 95
                    },
                    {
                        id: 4,
                        title: "İstanbul Boğaz Turu",
                        description: "Tekne ile İstanbul Boğazı'nı keşfedin",
                        imageUrl: "https://picsum.photos/800/500?random=4",
                        featured: true,
                        createdAt: new Date().toISOString(),
                        location: "İstanbul",
                        duration: "4 saat",
                        rating: 4.6,
                        reviewCount: 352,
                        popularityRate: 88
                    }
                ]);
            } catch (error) {
                console.error("Error fetching experiences:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    // Scroll handlers
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full h-[500px] overflow-hidden">
                <Image
                    src="https://picsum.photos/1920/1080"
                    alt="Seyahat deneyimleri"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
                            Türkiye'nin En İyi Tatil Deneyimleri
                        </h1>
                        <p className="mt-6 text-xl text-white text-center">
                            Benzersiz otel konaklamaları, özel turlar ve unutulmaz deneyimler için sizin yanınızdayız.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="w-full">
                <div className="w-full max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900">Öne Çıkan Turlarımız</h2>
                        <p className="mt-2 text-sm text-gray-700">
                            En popüler ve beğenilen turlarımızı keşfedin.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : experiences.length === 0 ? (
                        <div className="mt-8 text-center">
                            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12">
                                <p className="text-sm text-gray-500">Henüz tur bulunmamaktadır.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
                            <div 
                                ref={scrollContainerRef}
                                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-4 sm:px-6 lg:px-8"
                            >
                                {experiences.map((experience) => (
                                    <Link
                                        key={experience.id}
                                        href={`/experience/${experience.id}`}
                                        className="group relative flex-none w-[300px] rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="relative h-[200px] w-full">
                                            <Image
                                                src={experience.imageUrl}
                                                alt={experience.title}
                                                fill
                                                className="rounded-t-xl object-cover"
                                            />
                                            {experience.featured && (
                                                <div className="absolute top-4 right-4">
                                                    <span className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                                        %{experience.popularityRate} Gezginin Rotasında
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex flex-col h-[180px]">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {experience.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3 flex-grow">
                                                {experience.description}
                                            </p>
                                            <div className="mt-auto">
                                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        <span>{experience.location}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        <span>{experience.duration}</span>
                                                    </div>
                                                </div>
                                                <div className="group-hover:text-blue-600 text-sm font-medium text-gray-600 flex items-center transition-colors">
                                                    Detayları Görüntüle
                                                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            {/* Navigation Arrows */}
                            <button 
                                onClick={scrollLeft}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-r-xl p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
                            >
                                <ChevronLeft className="h-6 w-6 text-gray-600" />
                            </button>
                            <button 
                                onClick={scrollRight}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-l-xl p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
                            >
                                <ChevronRight className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </>
    );
}
