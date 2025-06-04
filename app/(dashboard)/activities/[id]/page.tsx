"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, MapPin, Users, Calendar, ChevronLeft, ChevronRight, X, Heart, Share2, Building2 } from 'lucide-react';
import Marquee from "react-fast-marquee";

interface Activity {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    imageUrl: string;
    gallery: string[];
    location: string;
    duration: string;
    rating: number;
    reviewCount: number;
    popularityRate: number;
    price: number;
    category: string;
    included: string[];
    notIncluded: string[];
    highlights: string[];
    schedule: Array<{ time: string; activity: string }>;
    reviews: Array<{
        id: number;
        user: string;
        rating: number;
        comment: string;
        date: string;
    }>;
    discount?: number;
    activityDates: any[];
    meetingPoint?: string;
    meetingPointAddress?: string;
    operator: any;
}

interface RelatedActivity {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    location: string;
    duration: string;
    rating: number;
    reviewCount: number;
    price: number;
    category: string;
}

export default function ActivityDetail() {
    const params = useParams();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedActivity, setSelectedActivity] = useState<RelatedActivity | null>(null);
    const [relatedActivities, setRelatedActivities] = useState<RelatedActivity[]>([]);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [activityDates, setActivityDates] = useState<any[]>([]);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await fetch(`/api/activities/${params.id}`);
                if (!response.ok) {
                    throw new Error('Activity not found');
                }
                const data = await response.json();
                setActivity(data);
                setError(null);

                // Fetch related activities
                const relatedResponse = await fetch(
                    `/api/activities?category=${data.category}&currentId=${params.id}&limit=10`
                );
                if (relatedResponse.ok) {
                    const relatedData = await relatedResponse.json();
                    setRelatedActivities(relatedData);
                }
            } catch (err) {
                setError('Failed to load activity');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !activity) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                <p className="text-gray-600">{error || 'Activity not found'}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - Tur Detayına Benzetilmiş */}
            <div className="relative h-[80vh] md:h-[90vh]">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={activity.imageUrl}
                        alt={activity.title}
                        fill
                        priority
                        style={{ objectFit: "cover" }}
                        className="brightness-70 transform scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>
                {/* Badge ve Başlık */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <div className="mb-4 flex flex-col items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200/70">{activity.popularityRate > 80 ? 'Popüler Seçim' : 'Aktivite'}</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{activity.title}</h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl mx-auto drop-shadow">{activity.description}</p>
                    {/* Özet Bilgi Kutuları */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                        <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-lg">
                            <Clock className="w-5 h-5 text-white" />
                            <span className="text-base font-medium">{activity.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-lg">
                            <Users className="w-5 h-5 text-white" />
                            <span className="text-base font-medium">Maks. {activity.activityDates && activity.activityDates.length > 0 && activity.activityDates[0].availableSeats ? activity.activityDates[0].availableSeats : 10} kişi</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-lg">
                            <MapPin className="w-5 h-5 text-white" />
                            <span className="text-base font-medium">{activity.location}</span>
                        </div>
                        {activity.meetingPoint && activity.meetingPoint.trim() !== '' && (
                            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-lg">
                                <a
                                    href={activity.meetingPoint}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sky-200 hover:text-sky-400 underline"
                                >
                                    <MapPin className="w-5 h-5 text-sky-200" />
                                    <span>Buluşma Noktası (Google Maps)</span>
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <span className="text-base font-medium">{activity.rating} ({activity.reviewCount} yorum)</span>
                        </div>
                    </div>
                    {/* Butonlar */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center px-7 py-3 bg-sky-600 hover:bg-sky-700 text-white text-base font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out"
                        >
                            <MapPin className="h-5 w-5 mr-2" />
                            <span>Aktivite Programı</span>
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center px-7 py-3 bg-white/10 backdrop-blur-lg text-sky-300 hover:bg-sky-400/10 border border-sky-400/40 hover:border-sky-300/60 text-base font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out"
                        >
                            <Calendar className="h-5 w-5 mr-2" />
                            <span>Rezervasyon Yap</span>
                        </Link>
                    </div>
                </div>
                {/* Alt bilgi barı (Tur Detayları gibi) */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md py-4 border-t border-white/10">
                  <div className="container px-4 mx-auto">
                    <div className="flex flex-wrap items-center justify-center lg:justify-between gap-x-6 gap-y-3">
                      {/* Süre */}
                      <div className="flex items-center text-white gap-2.5 group">
                        <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Süre</p>
                          <p className="text-sm font-semibold">{activity.duration}</p>
                        </div>
                      </div>
                      {/* Kontenjan */}
                      <div className="flex items-center text-white gap-2.5 group">
                        <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Grup</p>
                          <p className="text-sm font-semibold">Maks. {activity.activityDates && activity.activityDates.length > 0 && activity.activityDates[0].availableSeats ? activity.activityDates[0].availableSeats : 10} kişi</p>
                        </div>
                      </div>
                      {/* Konum */}
                      <div className="flex items-center text-white gap-2.5 group">
                        <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                          <MapPin className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Konum</p>
                          <p className="text-sm font-semibold truncate max-w-[150px]">{activity.location}</p>
                        </div>
                      </div>
                      {/* Puan */}
                      <div className="flex items-center text-white gap-2.5 group">
                        <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Puan</p>
                          <p className="text-sm font-semibold">{activity.rating}/5</p>
                        </div>
                      </div>
                      {/* Action Icons */}
                      <div className="flex items-center space-x-2 ml-auto">
                        <button className="p-2.5 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white/50" aria-label="Favorilere Ekle">
                          <Heart className="h-5 w-5 text-white" strokeWidth={2.2} fill="none" />
                        </button>
                        <button className="p-2.5 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white/50" aria-label="Paylaş">
                          <Share2 className="h-5 w-5 text-white" strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Aktivite Hakkında</h2>
                            <p className="text-gray-800 whitespace-pre-line">{activity.longDescription}</p>
                        </div>

                        {/* Modern Buluşma Noktası Kartı */}
                        {(activity.meetingPointAddress || activity.location || activity.meetingPoint) && (
                            <div className="bg-white rounded-2xl shadow-md border border-neutral-100/80 flex flex-col items-stretch mb-10 overflow-hidden w-full max-w-none">
                                <div className="flex flex-col gap-2 p-6">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-2xl font-semibold text-gray-900">Buluşma Noktası</h2>
                                    </div>
                                    {activity.meetingPointAddress && (
                                        <div className="text-base text-gray-700 font-medium whitespace-pre-line">
                                            {activity.meetingPointAddress}
                                        </div>
                                    )}
                                    {activity.location && (
                                        <div className="text-base text-gray-500 font-normal">
                                            <span className="font-semibold">Konum: </span>{activity.location}
                                        </div>
                                    )}
                                    {activity.meetingPoint && activity.meetingPoint.trim() !== '' && (
                                        <a
                                            href={activity.meetingPoint}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-900 underline text-base font-medium mt-2"
                                        >
                                            <MapPin className="w-5 h-5" />
                                            Google Maps'te Aç
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Gallery */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fotoğraf Galerisi</h2>
                            <div className="relative">
                                <div className="overflow-x-auto hide-scrollbar gallery-container">
                                    <div className="flex gap-4 pb-4" style={{ scrollBehavior: 'smooth' }}>
                                        {activity.gallery.map((image, index) => (
                                            <div 
                                                key={index} 
                                                className="flex-none w-[220px] relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                                                style={{ top: '0px' }}
                                                onClick={() => { setSelectedImage(image); setCurrentImageIndex(index); }}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${activity.title} - Fotoğraf ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 220px) 100vw, 220px"
                                                    priority={index === 0}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const container = document.querySelector('.gallery-container');
                                        if (container) {
                                            container.scrollLeft -= 240;
                                        }
                                    }}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => {
                                        const container = document.querySelector('.gallery-container');
                                        if (container) {
                                            container.scrollLeft += 240;
                                        }
                                    }}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Öne Çıkanlar</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activity.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <span className="text-gray-800">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Schedule */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Program Akışı</h2>
                            <div className="space-y-4">
                                {activity.schedule.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                            </div>
                                            {index !== activity.schedule.length - 1 && (
                                                <div className="w-0.5 h-full bg-blue-100 mt-2" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{item.time}</div>
                                            <div className="text-gray-800">{item.activity}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 overflow-y-hidden">
                            <div className="text-center max-w-3xl mx-auto mb-8">
                                <div className="inline-flex items-center justify-center px-3 py-1 bg-sky-100 rounded-full text-sky-700 font-medium text-xs mb-4">
                                    <Star className="w-4 h-4 mr-1.5 text-yellow-400" />
                                    Müşteri Deneyimleri
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                                    Yorumlar
                                </h2>
                                <p className="text-base text-neutral-600">
                                    Aktivitemizi deneyimleyen misafirlerimizin gerçek yorumları.
                                </p>
                            </div>
                            <div className="-mx-2 md:-mx-4 lg:-mx-6 overflow-y-hidden h-52">
                                <Marquee
                                    gradient={true}
                                    gradientColor={'rgb(248, 250, 252)'}
                                    gradientWidth={60}
                                    speed={25}
                                    pauseOnHover={true}
                                    className="py-2 overflow-y-hidden h-48"
                                >
                                    {activity.reviews.map((review) => (
                                        <div 
                                            key={review.id}
                                            className="mx-2 w-64 sm:w-72 flex-shrink-0 h-48"
                                        >
                                            <div className="bg-white border border-neutral-200/80 rounded-xl p-4 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300 justify-between">
                                                <p className="text-sm text-neutral-700 font-normal leading-snug mb-2 flex-grow italic line-clamp-3">
                                                    “{review.comment}”
                                                </p>
                                                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                                            <Image
                                                                src={`https://randomuser.me/api/portraits/lego/${review.id % 10}.jpg`}
                                                                alt={review.user}
                                                                fill
                                                                sizes="32px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-700 font-medium">{review.user}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-xs text-gray-500">{review.date}</span>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                            <span className="text-xs text-gray-600 font-semibold">{review.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Marquee>
                            </div>
                        </div>

                        {/* Similar Activities */}
                        {relatedActivities.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Benzer Aktiviteler</h2>
                                <div className="relative">
                                    <div className="overflow-x-auto hide-scrollbar similar-activities-container">
                                        <div className="flex gap-4 pb-4" style={{ scrollBehavior: 'smooth' }}>
                                            {relatedActivities.map((relatedActivity) => (
                                                <div
                                                    key={relatedActivity.id}
                                                    className="flex-none w-[300px] bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
                                                    onClick={() => window.location.href = `/activities/${relatedActivity.id}`}
                                                >
                                                    <div className="relative h-48">
                                                        <Image
                                                            src={relatedActivity.imageUrl}
                                                            alt={relatedActivity.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                                            <span className="text-sm font-medium text-gray-800">{relatedActivity.category}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{relatedActivity.title}</h3>
                                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relatedActivity.description}</p>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">{relatedActivity.location}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1">
                                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                                <span className="text-sm text-gray-600">{relatedActivity.rating}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg font-semibold text-blue-600">{relatedActivity.price.toLocaleString('tr-TR')}₺</span>
                                                                <span className="text-sm text-gray-500">{relatedActivity.duration}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const container = document.querySelector('.similar-activities-container');
                                            if (container) {
                                                container.scrollLeft -= 320;
                                            }
                                        }}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors z-10"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const container = document.querySelector('.similar-activities-container');
                                            if (container) {
                                                container.scrollLeft += 320;
                                            }
                                        }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors z-10"
                                    >
                                        <ChevronRight className="w-6 h-6 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {/* Modern Rezervasyon Kutusu */}
                            {activity?.activityDates && activity.activityDates.length > 0 && (
                                <div className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calendar className="w-7 h-7 text-blue-600" />
                                        <h2 className="text-2xl font-semibold text-gray-900">Rezervasyon</h2>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/70 ml-auto">Ücretsiz İptal</span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200/70">Anında Onay</span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {activity.activityDates.map((date) => (
                                            <div key={date.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200/70 hover:border-blue-200 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                                    <div>
                                                        <div className="text-base font-semibold text-gray-900">
                                                            {new Date(date.startDate).toLocaleDateString('tr-TR')} - {new Date(date.endDate).toLocaleDateString('tr-TR')}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                            {date.availableSeats} kişilik kontenjan
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                                                        {date.price.toLocaleString('tr-TR')}<span className="text-lg font-semibold">₺</span>
                                                    </div>
                                                    <button className="mt-2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors">
                                                        Seç
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 space-y-3">
                                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg">
                                            <Calendar className="w-5 h-5" /> Hızlı Rezervasyon
                                        </button>
                                        <button className="w-full border border-blue-500 text-blue-500 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-lg">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.38V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.38M16 5v2m0 0v2m0-2h2m-2 0h-2" /></svg> Fiyat Bilgisi Al
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Aktivite Operatörü Kartı - DAHİL OLAN HİZMETLERİN ÜSTÜNE ALINDI */}
                            {activity.operator && (
                                <div className="bg-white rounded-xl shadow-sm border border-neutral-100/80 p-6 mb-8 flex flex-col gap-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Building2 className="w-7 h-7 text-blue-600" />
                                        <div className="text-2xl font-semibold text-gray-900">Aktivite Operatörü</div>
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                                            {activity.operator.logo ? (
                                                <img src={activity.operator.logo} alt={activity.operator.companyName || activity.operator.name} className="object-cover w-full h-full" />
                                            ) : (
                                                <span className="text-lg font-bold text-gray-400">{(activity.operator.companyName || activity.operator.name || '?')[0]}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-gray-900">{activity.operator.companyName || activity.operator.name}</div>
                                            <a href={`/activities?operator=${activity.operator.id}`} className="text-blue-600 hover:underline text-sm font-medium">Tüm aktivitelerini gör</a>
                                        </div>
                                    </div>
                                    <div className="text-gray-700 text-sm mb-2">
                                        {activity.operator.description || 'Operatör hakkında bilgi bulunmamaktadır.'}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Star className="w-5 h-5 text-yellow-400" />
                                        <span className="text-base font-semibold text-gray-800">{activity.operator.rating ? activity.operator.rating.toFixed(1) : '0.0'}</span>
                                        <span className="text-sm text-gray-500">({activity.operator.reviewCount || 0} değerlendirme)</span>
                                    </div>
                                    <Link href={`/operator/${activity.operator.id}`} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                                        <Building2 className="w-5 h-5" /> Operatör detayları
                                    </Link>
                                </div>
                            )}

                            {/* Dahil Olan Hizmetler */}
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Dahil Olan Hizmetler</h3>
                                <ul className="space-y-2">
                                    {activity.included.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2 text-gray-800">
                                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Dahil Olmayan Hizmetler</h3>
                                <ul className="space-y-2">
                                    {activity.notIncluded.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2 text-gray-800">
                                            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
                        <Image
                            src={selectedImage}
                            alt="Büyük görüntü"
                            fill
                            className="object-contain"
                        />
                        <button 
                            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            )}

            {/* Activity Detail Modal */}
            {selectedActivity && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedActivity(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-64">
                            <Image
                                src={selectedActivity.imageUrl}
                                alt={selectedActivity.title}
                                fill
                                className="object-cover"
                            />
                            <button
                                className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                                onClick={() => setSelectedActivity(null)}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-semibold text-gray-900">{selectedActivity.title}</h3>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {selectedActivity.category}
                                </span>
                            </div>
                            <p className="text-gray-700 mb-6">{selectedActivity.description}</p>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-700">{selectedActivity.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-700">{selectedActivity.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                    <span className="text-gray-700">{selectedActivity.rating} ({selectedActivity.reviewCount} yorum)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-blue-500">{selectedActivity.price.toLocaleString('tr-TR')}₺</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                                    onClick={() => window.location.href = `/activities/${selectedActivity.id}`}
                                >
                                    Detaylı İncele
                                </button>
                                <button
                                    className="flex-1 border border-blue-500 text-blue-500 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                                >
                                    Rezervasyon Yap
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
