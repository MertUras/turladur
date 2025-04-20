"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, MapPin, Users, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

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
        name: string;
        rating: number;
        comment: string;
        date: string;
    }>;
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
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedActivity, setSelectedActivity] = useState<RelatedActivity | null>(null);
    const [relatedActivities, setRelatedActivities] = useState<RelatedActivity[]>([]);

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

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === activity.gallery.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? activity.gallery.length - 1 : prev - 1
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src={activity.imageUrl}
                    alt={activity.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-5xl font-bold mb-4">{activity.title}</h1>
                        <p className="text-xl">{activity.description}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Quick Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-900">{activity.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-900">{activity.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400" />
                                    <span className="text-gray-900">{activity.rating} ({activity.reviewCount} yorum)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />
                                    <span className="text-gray-900">{activity.popularityRate}% popülerlik</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Aktivite Hakkında</h2>
                            <p className="text-gray-800 whitespace-pre-line">{activity.longDescription}</p>
                        </div>

                        {/* Gallery */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Fotoğraf Galerisi</h2>
                            <div className="relative">
                                <div className="overflow-x-auto hide-scrollbar gallery-container">
                                    <div className="flex gap-4 pb-4" style={{ scrollBehavior: 'smooth' }}>
                                        {activity.gallery.map((image, index) => (
                                            <div 
                                                key={index} 
                                                className="flex-none w-[280px] relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => setSelectedImage(image)}
                                            >
                                                <Image
                                                    src={image}
                                                    alt={`${activity.title} - Fotoğraf ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 280px) 100vw, 280px"
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
                                            container.scrollLeft -= 300;
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
                                            container.scrollLeft += 300;
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
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Yorumlar</h2>
                            <div className="space-y-6">
                                {activity.reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="font-semibold text-gray-900">{review.name}</div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                                <span className="text-gray-600">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-800">{review.comment}</p>
                                        <div className="text-sm text-gray-500 mt-2">{review.date}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Similar Activities */}
                        {relatedActivities.length > 0 && (
                            <div className="mt-12">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Benzer Aktiviteler</h2>
                                <div className="relative">
                                    <div className="overflow-x-auto hide-scrollbar">
                                        <div className="flex gap-4 pb-4" style={{ scrollBehavior: 'smooth' }}>
                                            {relatedActivities.map((relatedActivity) => (
                                                <Link
                                                    key={relatedActivity.id}
                                                    href={`/activities/${relatedActivity.id}`}
                                                    className="flex-none w-[300px] bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                                >
                                                    <div className="relative h-48">
                                                        <Image
                                                            src={relatedActivity.imageUrl}
                                                            alt={relatedActivity.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full">
                                                            <span className="text-sm font-medium">{relatedActivity.category}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{relatedActivity.title}</h3>
                                                        <p className="text-sm text-gray-600 mb-3">{relatedActivity.description}</p>
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
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const container = document.querySelector('.overflow-x-auto');
                                            if (container) {
                                                container.scrollLeft -= 320;
                                            }
                                        }}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const container = document.querySelector('.overflow-x-auto');
                                            if (container) {
                                                container.scrollLeft += 320;
                                            }
                                        }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
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
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                                <div className="text-3xl font-bold text-gray-900 mb-4">{activity.price.toLocaleString('tr-TR')}₺</div>
                                <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold mb-4 hover:bg-blue-600 transition-colors">
                                    Rezervasyon Yap
                                </button>
                                <button className="w-full border border-blue-500 text-blue-500 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                                    Seyahat Danışmanına Ulaş
                                </button>
                            </div>

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
