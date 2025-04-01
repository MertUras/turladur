"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import Footer from "../../components/Footer";

interface Experience {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    location: string;
    duration: string;
    popularityRate: number;
    featured: boolean;
}

export default function KulturTurlariPage() {
    const experiences = [
        {
            id: 1,
            title: "Kapadokya Yeraltı Şehirleri",
            description: "Derinkuyu ve Kaymaklı yeraltı şehirlerinin gizemli dünyasını keşfedin",
            imageUrl: "https://picsum.photos/800/600?random=5",
            location: "Nevşehir",
            duration: "7 saat",
            popularityRate: 94,
            featured: true
        },
        {
            id: 2,
            title: "Efes Antik Kenti Turu",
            description: "2000 yıllık tarihe sahip Efes Antik Kenti'nin muhteşem yapılarını görün",
            imageUrl: "https://picsum.photos/800/600?random=6",
            location: "İzmir",
            duration: "6 saat",
            popularityRate: 96,
            featured: true
        },
        {
            id: 3,
            title: "İstanbul Tarihi Yarımada",
            description: "Ayasofya, Topkapı Sarayı ve Sultanahmet Camii'ni profesyonel rehber eşliğinde keşfedin",
            imageUrl: "https://picsum.photos/800/600?random=7",
            location: "İstanbul",
            duration: "8 saat",
            popularityRate: 98,
            featured: true
        },
        {
            id: 4,
            title: "Göbeklitepe ve Şanlıurfa Turu",
            description: "12 bin yıllık tarihe sahip Göbeklitepe'yi ve Şanlıurfa'nın kutsal mekanlarını ziyaret edin",
            imageUrl: "https://picsum.photos/800/600?random=8",
            location: "Şanlıurfa",
            duration: "9 saat",
            popularityRate: 93,
            featured: true
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative w-full h-[500px] mt-16">
                <Image
                    src="https://picsum.photos/1920/1080?random=11"
                    alt="Kültür Turları"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
                    <h1 className="text-5xl font-bold mb-4">Kültür Turları</h1>
                    <p className="text-xl max-w-3xl">
                        Anadolu'nun binlerce yıllık tarihini, antik kentlerini ve kültürel mirasını keşfedin. 
                        Profesyonel rehberler eşliğinde tarihe yolculuğa çıkın.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[85rem] mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Öne Çıkan Kültür Turları</h2>
                    <p className="mt-2 text-sm text-gray-700">
                        En popüler ve beğenilen kültür rotalarımızı keşfedin.
                    </p>
                </div>

                <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
                    <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-4 sm:px-6 lg:px-8">
                        {experiences.map((experience) => (
                            <Link
                                key={experience.id}
                                href={`/kultur-turlari/${experience.id}`}
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
                </div>
            </div>

            <Footer />
        </div>
    );
} 