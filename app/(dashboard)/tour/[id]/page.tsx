'use client';

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyTours, dummyTourOperators } from "@/app/lib/dummy-data";
import { parseJsonString } from "@/app/utils/format";
import BottomBookingBar from "@/app/components/BottomBookingBar";
import { useEffect, useRef, useState } from "react";
import { useParams } from 'next/navigation';

// Heroicons bileşenlerini içe aktarıyoruz
import {
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  MapIcon,
  HeartIcon,
  ShareIcon,
  CurrencyDollarIcon,
  StarIcon,
  CheckIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ChevronLeftIcon,
  SunIcon,
  MoonIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

// Solid ikonları
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface Tour {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  discount: number | null;
  startDate: Date | null;
  endDate: Date | null;
  maxParticipants: number | null;
  destinations: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: any;
  images: string[];
  featured: boolean;
  departureCity: string | null;
  region: string | null;
  transportation: string | null;
  period: string | null;
  rating: number | null;
  tourType: string | null;
  accommodationType: string | null;
  difficultyLevel: string | null;
  ageRestriction: number | null;
  isPopular: boolean;
  isLastMinute: boolean;
  isEarlyBird: boolean;
  languages: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  tourOperatorId: string;
  tourOperator: {
    id: string;
    name: string;
    logo: string | null;
    description: string | null;
  };
  tourDates: {
    id: string;
    startDate: Date;
    endDate: Date;
    price: number;
    availableSeats: number;
  }[];
}

interface TourPageProps {
  params: {
    id: string;
  };
}

interface ItineraryItem {
  title: string;
  description: string;
}

interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function TourPage() {
  const params = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [tourCount, setTourCount] = useState(0);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/tours/${params.id}`);
        if (!response.ok) {
          throw new Error('Tur bulunamadı');
        }
        const data = await response.json();
        setTour(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition + windowHeight > documentHeight - 600) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    const calculateTourCount = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const tourItemHeight = 210;
        const paddingAndMargin = 35;
        const availableHeight = containerHeight - paddingAndMargin;
        const calculatedCount = Math.floor(availableHeight / tourItemHeight);
        setTourCount(Math.max(3, calculatedCount));
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateTourCount);
    calculateTourCount();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateTourCount);
    };
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error || !tour) {
    return notFound();
  }

  // Tur operatörü bilgilerini al
  const tourOperator = dummyTourOperators.find((operator) => operator.id === tour.tourOperatorId);
  
  // Tur resimlerini parse et
  const tourImages = [
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585924257670-6b97a7fdfb0d?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=800&auto=format&fit=crop'
  ];
  
  // Tur dahil olanlar ve olmayanlar
  const inclusions = parseJsonString<string[]>(tour.inclusions, []);
  const exclusions = parseJsonString<string[]>(tour.exclusions, []);
  
  // Tur destinasyonları
  const destinations = parseJsonString<string[]>(tour.destinations, []);
  
  // Tur programını parse et
  const itinerary = parseJsonString<Record<string, ItineraryItem>>(tour.itinerary || '{}', {});

  // Yıldızları render et
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          return star <= Math.floor(rating) ? (
            <StarIconSolid key={star} className="h-5 w-5 text-yellow-400" />
          ) : star <= rating ? (
            <div key={star} className="relative">
              <StarIcon className="h-5 w-5 text-gray-300" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                <StarIconSolid className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          ) : (
            <StarIcon key={star} className="h-5 w-5 text-gray-300" />
          );
        })}
      </div>
    );
  };

  // --- Button Styles (Consistent with ikas style, SKY theme) ---
  const primaryButtonClasses = "inline-flex items-center justify-center px-7 py-3 bg-sky-600 hover:bg-sky-700 text-white text-base font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out";
  const secondaryButtonClasses = "inline-flex items-center justify-center px-7 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-base font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out";
  // Icon button style adapted for dark backgrounds (SKY theme)
  const iconButtonDarkBgClasses = "p-2.5 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-colors duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white/50";
  // Secondary button adapted for dark backgrounds (SKY theme)
  const secondaryButtonDarkBgClasses = `inline-flex items-center justify-center px-7 py-3 bg-white/10 backdrop-blur-lg text-sky-300 hover:bg-sky-400/10 border border-sky-400/40 hover:border-sky-300/60 text-base font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out`;

  return (
    <div className="bg-gray-50">
      {/* Hero Section - ikas Style Refinement (SKY Theme) */}
      <div className="relative h-[80vh] md:h-[90vh]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={tourImages[0]}
            alt={tour.name}
            fill
            priority
            style={{ objectFit: "cover" }}
            className="brightness-70 transform scale-100 animate-ken-burns-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>
        
        {/* Feature Bar - Refined Style (SKY Theme) */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md py-4 border-t border-white/10">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap items-center justify-center lg:justify-between gap-x-6 gap-y-3">
              {/* Feature Item Example - Refined */}
              <div className="flex items-center text-white gap-2.5 group">
                <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                  <CalendarDaysIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Süre</p>
                  <p className="text-sm font-semibold">{tour.duration} Gün</p>
                </div>
              </div>
              
              {/* Other features refined similarly */}
              <div className="flex items-center text-white gap-2.5 group">
                 <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                  <UserGroupIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Grup</p>
                  <p className="text-sm font-semibold">Maks. {tour.maxParticipants || 10} kişi</p>
                </div>
              </div>
              
              <div className="flex items-center text-white gap-2.5 group">
                 <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                  <MapPinIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Destinasyon</p>
                  <p className="text-sm font-semibold truncate max-w-[150px]">{destinations[0]}{destinations.length > 1 ? ` +${destinations.length - 1}` : ''}</p>
                </div>
              </div>
              
              <div className="flex items-center text-white gap-2.5 group">
                 <div className="p-2 bg-white/10 rounded-lg ring-1 ring-white/10 group-hover:bg-white/20 transition-colors duration-150 ease-out">
                  <StarIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Puan</p>
                  <p className="text-sm font-semibold">4.8/5</p> {/* Replace with actual data if available */}
                </div>
              </div>
              
              {/* Action Icons - Using standardized style */}
              <div className="flex items-center space-x-2 ml-auto">
                <button className={iconButtonDarkBgClasses} aria-label="Favorilere Ekle">
                  <HeartIcon className="h-5 w-5" />
                </button>
                <button className={iconButtonDarkBgClasses} aria-label="Paylaş">
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pt-16 sm:pt-20">
          <div className="container px-4 text-center max-w-4xl mx-auto">
             {/* Simplified Badge (SKY Theme) */}
            <div className="inline-flex items-center mb-5 bg-sky-900/30 backdrop-blur-sm px-4 py-1.5 rounded-full border border-sky-400/30">
              <StarIconSolid className="h-4 w-4 text-yellow-300 mr-2"/>
              <span className="text-sky-100 font-medium uppercase tracking-wider text-[11px]">Popüler Seçim</span>
            </div>
            {/* Adjusted Title size and spacing */}
            <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-bold text-white mb-4 leading-tight animate-fade-in-up drop-shadow-md">{tour.name}</h1>
             {/* Refined details display */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-white/90 mb-8 max-w-3xl mx-auto">
              <div className="flex items-center text-base">
                <MapPinIcon className="w-4 h-4 mr-1.5 opacity-80" />
                <span className="font-normal">{destinations.join(', ')}</span>
              </div>
              <span className="text-white/50 hidden sm:inline">•</span>
              <div className="flex items-center text-base">
                <ClockIcon className="w-4 h-4 mr-1.5 opacity-80" />
                <span className="font-normal">{tour.duration} gün</span>
              </div>
              <span className="text-white/50 hidden sm:inline">•</span>
              <div className="flex items-center text-base">
                <UserGroupIcon className="w-4 h-4 mr-1.5 opacity-80" />
                <span className="font-normal">Maks. {tour.maxParticipants || 10} kişi</span>
              </div>
            </div>
             {/* Standardized Buttons (SKY Theme) */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                href="#itinerary"
                className={primaryButtonClasses} // Applied standard SKY primary style
              >
                <MapIcon className="h-5 w-5 mr-2" />
                <span>Tur Programı</span>
              </Link>
              <Link
                href="#booking"
                className={secondaryButtonDarkBgClasses} // Applied adapted SKY secondary style for dark BG
              >
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                <span>Rezervasyon Yap</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container px-4 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 min-h-[calc(100vh-200px)]">
          {/* Sol Kolon - Tur Bilgileri */}
          <div className="lg:col-span-2 space-y-16 sm:space-y-20 h-full">
            {/* Tur Açıklaması yerine Fotoğraf Galerisi - ikas Style */}
            <div>
              <div className="flex items-center mb-8 sm:mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                  <PhotoIcon className="h-7 w-7 md:h-8 md:w-8 text-sky-600 mr-3" />
                  <span>Fotoğraf Galerisi</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                  {tourImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`group relative aspect-[4/3] rounded-xl sm:rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-out ${index === 0 ? 'md:col-span-2 md:row-span-2 md:aspect-[8/6]' : ''}`}
                  >
                    <Image
                      src={image}
                      alt={`${tour.name} - Resim ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      className="transition-transform duration-500 ease-in-out"
                      priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                        <p className="font-medium text-sm sm:text-base text-white mb-2 truncate">{destinations[index % destinations.length] || 'Tur Lokasyonu'}</p>
                        <div className="flex items-center gap-1.5">
                          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white/50" aria-label="Genişlet">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                          </button>
                          <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white/50" aria-label="Paylaş">
                            <ShareIcon className="h-4 w-4" />
                          </button>
                        </div>
                    </div>
                    <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
                      <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                        {index + 1}/6
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tur Programı - ikas Style */}
            <div id="itinerary" className="scroll-mt-20 sm:scroll-mt-24">
              <div className="flex items-center mb-8 sm:mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                  <MapIcon className="h-7 w-7 md:h-8 md:w-8 text-sky-600 mr-3" />
                  <span>Tur Programı</span>
                </h2>
              </div>
              
              <div className="space-y-10">
                {Object.entries(itinerary).map(([day, content]: [string, ItineraryItem], index: number) => {
                  const dayNumber = (parseInt(day.replace('day', '')) + 1).toString();
                  return (
                    <div 
                      id={`day-${dayNumber}`} 
                      key={index} 
                      className="bg-white rounded-xl overflow-hidden shadow-md transition-shadow duration-300 border border-neutral-200/70 scroll-mt-24" 
                    >
                      <div className="bg-sky-50/70 p-5 md:p-6 flex items-center border-b border-neutral-200/70">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-sky-600 text-white font-semibold text-lg md:text-xl mr-4 flex-shrink-0 shadow-sm">
                          {dayNumber}
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-sky-800">Gün {dayNumber}: {content.title || destinations[index % destinations.length] || 'Aktivite Günü'}</h3>
                      </div>
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                          <div className="lg:w-2/3 xl:w-3/4">
                            <p className="text-neutral-700 text-base leading-relaxed">{content.description}</p>
                          </div>
                          <div className="lg:w-1/3 xl:w-1/4 flex-shrink-0">
                            {index < tourImages.length && (
                              <div className="relative h-60 rounded-lg overflow-hidden shadow-sm border border-neutral-100">
                                <Image
                                  src={tourImages[index]}
                                  alt={`Gün ${dayNumber} - ${content.title || destinations[index % destinations.length] || ''}`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                  style={{ objectFit: "cover" }}
                                  className="transition-transform duration-700 ease-in-out"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-neutral-100">
                          <h4 className="text-lg font-semibold text-sky-700 mb-4">Günün Öne Çıkanları</h4>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği'].map((meal: string, i: number) => (
                              <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/70">
                                {meal}
                              </span>
                            ))}
                            {['Sanat', 'Doğa', 'Alışveriş', 'Plaj', 'Tarih', 'Yerel'].slice(0, (index % 4) + 2).map((activity: string, i: number) => (
                              <span key={`act-${i}`} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200/70">
                                {activity}
                              </span>
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-neutral-50/80 p-4 rounded-lg border border-neutral-200/80 flex items-center">
                              <div className="p-1.5 bg-amber-100 rounded-md mr-3">
                                <SunIcon className="h-4 w-4 text-amber-600" />
                              </div>
                              <div>
                                <span className="text-xs text-neutral-500 font-medium">Sabah</span>
                                <p className="text-sm text-neutral-800 font-semibold">08:00 - 12:00</p>
                              </div>
                            </div>
                            <div className="bg-neutral-50/80 p-4 rounded-lg border border-neutral-200/80 flex items-center">
                              <div className="p-1.5 bg-sky-100 rounded-md mr-3">
                                <SunIcon className="h-4 w-4 text-sky-600" />
                              </div>
                              <div>
                                <span className="text-xs text-neutral-500 font-medium">Öğle</span>
                                <p className="text-sm text-neutral-800 font-semibold">12:00 - 16:00</p>
                              </div>
                            </div>
                            <div className="bg-neutral-50/80 p-4 rounded-lg border border-neutral-200/80 flex items-center">
                              <div className="p-1.5 bg-indigo-100 rounded-md mr-3">
                                <MoonIcon className="h-4 w-4 text-indigo-600" />
                              </div>
                              <div>
                                <span className="text-xs text-neutral-500 font-medium">Akşam</span>
                                <p className="text-sm text-neutral-800 font-semibold">16:00 - 20:00</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Rezervasyon ve Bilgiler - ikas Style */}
            <div className="flex flex-col space-y-8 w-full max-w-[400px] mx-auto">
              {/* Rezervasyon Kartı - ikas Style */}
              <div 
                id="booking" 
                className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full top-24"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <CalendarDaysIcon className="h-6 w-6 mr-2.5 text-sky-600 flex-shrink-0" />
                    <span>Rezervasyon</span>
                  </h2>
                  {/* Simplified Badges */}
                  <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-end">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/70">
                      Ücretsiz İptal
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200/70">
                      Anında Onay
                    </div>
                  </div>
                </div>
              
                {/* Tur Tarihleri */}
                <div className="bg-neutral-50/60 p-6 rounded-lg border border-neutral-200/70 mb-6">
                  <div className="flex flex-col gap-4">
                    {tour.tourDates.map((date) => {
                      const isLimited = date.availableSeats <= 5;
                      return (
                        <div key={date.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border border-neutral-200/70 hover:border-sky-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <CalendarDaysIcon className="h-5 w-5 text-sky-600 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-neutral-900">
                                {new Date(date.startDate).toLocaleDateString('tr-TR')} - {new Date(date.endDate).toLocaleDateString('tr-TR')}
                              </div>
                              <div className="text-xs text-neutral-500 mt-0.5">
                                {date.availableSeats} kişilik kontenjan
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-sky-700">
                              {tour.discount && tour.discount > 0 ? (
                                <>
                                  <span className="line-through text-neutral-400 text-base mr-2">{date.price.toLocaleString('tr-TR')} ₺</span>
                                  <span>{(date.price * (1 - (tour.discount / 100))).toLocaleString('tr-TR')} ₺</span>
                                </>
                              ) : (
                                `${date.price.toLocaleString('tr-TR')} ₺`
                              )}
                            </div>
                            <button className="mt-2 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium rounded-lg transition-colors">
                              Seç
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Standardized Buttons */}
                <div className="space-y-3">
                  <button className={`${primaryButtonClasses} w-full justify-center py-3`}>
                    <CalendarDaysIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>Hızlı Rezervasyon</span>
                  </button>
                  
                  <button className={`${secondaryButtonClasses} w-full justify-center py-3`}>
                    <EnvelopeIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>Fiyat Bilgisi Al</span>
                  </button>
                </div>
              </div>

              {/* Tur Operatörü Bilgileri - ikas Style */}
              {tourOperator && (
                <div 
                  className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full"
                  /* Simplified card style */
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2.5 text-sky-600 flex-shrink-0" />
                      <span>Tur Operatörü</span>
                    </h2>
                    {/* Simplified Rating Display */}
                    <div className="flex items-center text-xs text-neutral-500 flex-wrap">
                      <div className="flex items-center text-yellow-400 mr-1.5">
                        {renderStars(4.8)} {/* Assuming renderStars exists and works */} 
                      </div>
                      <span className="font-medium">(4.8/5)</span>
                      <span className="mx-1">•</span>
                      <span>24 değerlendirme</span>
                    </div>
                  </div>

                  {/* Simplified Operator Info Area */}
                  <div className="bg-neutral-50/60 p-5 rounded-lg border border-neutral-200/70 mb-6">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-200 shadow-sm flex-shrink-0">
                          <Image
                            src={tourOperator.logo || '/placeholder-image.jpg'}
                            alt={tourOperator.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="text-center sm:text-left flex-grow">
                          <h3 className="text-lg font-semibold text-neutral-900 mb-2">{tourOperator.name}</h3>
                          {/* Simplified Badges */}
                          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                            {tourOperator.certified && (
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200/70">
                                  Sertifikalı
                                </div>
                            )}
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/70">
                              {tour.duration}+ yıl deneyim {/* Assuming tour duration relates to experience here? Might need adjustment */} 
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                  
                  {/* Simplified Description Area */}
                  <div className="bg-neutral-50/60 p-5 rounded-lg border border-neutral-200/70 mb-6">
                    <p className="text-neutral-700 text-sm leading-relaxed line-clamp-3">{tourOperator.description || 'Tur operatörü hakkında bilgi bulunmamaktadır.'}</p>
                  </div>
                  
                  {/* Simplified Link Button */}
                  <Link 
                    href={`/tour-operator/${tourOperator.id}`} 
                    className="group text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors flex items-center justify-between p-4 rounded-lg border border-neutral-200/70 hover:bg-sky-50/50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-sky-500"
                  >
                    <span className="flex items-center">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                      <span>Operatör detayları</span>
                    </span>
                    <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}

              {/* Dahil Olanlar / Olmayanlar - ikas Style */}
              <div 
                className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full"
                /* Simplified card style */
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <CheckCircleIcon className="h-6 w-6 mr-2.5 text-sky-600 flex-shrink-0" />
                    <span>Dahil Olanlar / Olmayanlar</span>
                  </h2>
                </div>
                
                {/* Simplified Included Area */}
                <div className="bg-emerald-50/60 p-5 rounded-lg border border-emerald-200/70 mb-6">
                    <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                      <CheckCircleIcon className="w-5 h-5 mr-2 text-emerald-600 flex-shrink-0" />
                      <span>Dahil Olanlar</span>
                    </h3>
                    <ul className="space-y-2.5">
                      {inclusions.map((item, index) => (
                        <li key={index} className="flex items-start p-3 rounded-md bg-white/70 border border-emerald-100">
                          <CheckCircleIcon className="w-4 h-4 text-emerald-500 mr-2.5 mt-0.5 flex-shrink-0" />
                          <span className="text-neutral-700 text-sm font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                </div>
                
                {/* Simplified Excluded Area */}
                <div className="bg-red-50/60 p-5 rounded-lg border border-red-200/70">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                    <XCircleIcon className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
                    <span>Dahil Olmayanlar</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {exclusions.map((item, index) => (
                      <li key={index} className="flex items-start p-3 rounded-md bg-white/70 border border-red-100">
                        <XCircleIcon className="w-4 h-4 text-red-500 mr-2.5 mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-700 text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Acentenin Diğer Turları - ikas Style */}
              <div 
                ref={containerRef}
                className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full flex-grow"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2 text-sky-600 flex-shrink-0" />
                    <span className="truncate">Acentenin Diğer Turları</span>
                  </h2>
                </div>

                <div className="space-y-3">
                  {dummyTours
                    .filter(t => t.tourOperatorId === tour.tourOperatorId && t.id !== tour.id)
                    .slice(0, tourCount)
                    .map((otherTour) => {
                      const otherTourImages = parseJsonString<string[]>(otherTour.images, []);
                      const otherTourDestinations = parseJsonString<string[]>(otherTour.destinations, []);
                      const startDate = new Date();
                      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 1);
                      
                      return (
                        <Link 
                          key={otherTour.id} 
                          href={`/tour/${otherTour.id}`}
                          className="group block rounded-xl overflow-hidden border border-neutral-200/80 hover:border-sky-200/80 transition-all duration-300 ease-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                        >
                          <div className="relative">
                            <div className="relative h-44 sm:h-52 w-full">
                              <Image
                                src={tourImages[Math.floor(Math.random() * tourImages.length)]}
                                alt={otherTour.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 50vw"
                                style={{ objectFit: "cover" }}
                                className="transition-transform duration-500 ease-out group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
                              
                              {/* Resim üzerindeki içerik */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-sky-300 transition-colors truncate mb-2 drop-shadow-lg">{otherTour.name}</h3>
                                
                                {/* Tur Operatörü Bilgisi */}
                                <div className="flex items-center mb-2">
                                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <BuildingOfficeIcon className="w-4 h-4 mr-1.5 text-sky-300 flex-shrink-0" />
                                    <span className="text-xs font-medium truncate max-w-[150px]">{otherTour.tourOperator?.name || 'Tur Operatörü'}</span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-sky-300 flex-shrink-0" />
                                    <span className="text-xs font-medium">{startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</span>
                                  </div>
                                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <ClockIcon className="w-4 h-4 mr-1.5 text-sky-300 flex-shrink-0" />
                                    <span className="text-xs font-medium">{otherTour.duration} gün</span>
                                  </div>
                                </div>

                                {/* Destinasyon Bilgisi */}
                                <div className="flex items-center">
                                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <MapPinIcon className="w-4 h-4 mr-1.5 text-sky-300 flex-shrink-0" />
                                    <span className="text-xs font-medium truncate max-w-[180px]">{otherTourDestinations.join(', ')}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Sağ üst köşedeki indirim */}
                              {otherTour.discount && otherTour.discount > 0 && (
                                <div className="absolute top-3 right-3">
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-500 text-white border border-red-400/50 shadow-lg">
                                    %{otherTour.discount}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Alt bilgi çubuğu */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm p-3 flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                  <StarIconSolid className="w-4 h-4 text-yellow-400 mr-1.5" />
                                  <span className="text-sm font-bold text-white">4.8</span>
                                  <span className="text-sm text-white/70 ml-1.5">(24)</span>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {otherTour.discount && otherTour.discount > 0 ? (
                                  <span className="text-sm text-white/70 line-through mr-2">{otherTour.price.toLocaleString('tr-TR')} ₺</span>
                                ) : null}
                                <span className="text-sm font-bold text-white bg-sky-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                  {(otherTour.price - (otherTour.price * (otherTour.discount || 0) / 100)).toLocaleString('tr-TR')} ₺
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                  })}
                </div>
                
                {/* View All Link'i en alta taşıdım */}
                <div className="mt-8 pt-4 border-t border-neutral-200/60">
                  <Link 
                    href={`/tour-operator/${tour.tourOperatorId}`}
                    className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors flex items-center group focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-sky-500 rounded p-1 -ml-1"
                  >
                    <span className="truncate">Acentenin tüm turlarını gör</span>
                    <ArrowRightIcon className="w-4 h-4 ml-1 transform group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animasyonlu Scroll İndikatörü - Simplified */}
      {showScrollIndicator && (
      <div className="fixed bottom-28 right-6 hidden md:flex flex-col items-center animate-bounce-subtle z-30 pointer-events-none">
        {/* Removed text */}
        <div className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-md border border-neutral-200/80">
          <ChevronDownIcon className="w-5 h-5 text-neutral-500" />
        </div>
      </div>
      )}
      
      {/* Video Tour Düğmesi - Simplified */}
      <div className="fixed top-1/2 right-6 transform -translate-y-1/2 hidden lg:block z-30">
        <button className="group relative w-12 h-12 bg-white rounded-full shadow-md border border-neutral-200/80 flex items-center justify-center hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
          {/* Removed ping animation */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}> 
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" /> 
          </svg>
          {/* Simplified Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-neutral-800 text-white text-xs font-medium px-2.5 py-1 rounded shadow-sm pointer-events-none">
            Video Turu
          </span>
        </button>
      </div>
      
      {/* BottomBookingBar Component remains the same */}
      <BottomBookingBar tour={tour} />
    </div>
  );
} 