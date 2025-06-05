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
  ShieldCheckIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

// Solid ikonları
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface TourOperator {
  id: string;
  companyName: string;
  logo: string | null;
  description: string | null;
}

interface Destination {
  city: string;
  description: string;
}

type TourDestination = string | Destination;

interface TourDate {
  id: string;
  startDate: Date;
  endDate: Date;
  price: number;
  availableSeats: number;
  ageRanges: {
    id: string;
    minAge: number;
    description: string;
    pricingType: 'free' | 'half' | 'percentage' | 'fixed';
    value: number;
  }[];
  earlyBirdDiscount?: number;
  earlyBirdDeadline?: string;
  lastMinuteDiscount?: number;
  lastMinuteStart?: string;
  minParticipants?: number;
}

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
  destinations: TourDestination[];
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
  tourOperator: TourOperator;
  tourDates: TourDate[];
  accommodation: {
    name: string;
    image: string;
    location: string;
    type: string;
    rating: number;
    features: string[];
  };
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

interface TourStop {
  id: string;
  name: string;
  description: string;
  type: 'start' | 'stop' | 'end';
  activities: string[];
  duration: string;
  arrivalTime: string;
  departureTime: string;
  images: string[];
  location: {
    city: string;
    address: string;
    coordinates?: [number, number];
  };
}

export default function TourPage() {
  const params = useParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTourDate, setSelectedTourDate] = useState<TourDate | null>(null);
  const [participants, setParticipants] = useState<{ [key: string]: number }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [tourCount, setTourCount] = useState(0);
  const [tourOperator, setTourOperator] = useState<TourOperator | null>(null);
  const [otherTours, setOtherTours] = useState<Tour[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/tours/${params.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Tur detayları alınamadı');
        }

        // Tarihleri dönüştür
        const transformedTour = {
          ...data,
          tourDates: data.tourDates.map((date: any) => ({
            ...date,
            startDate: new Date(date.startDate),
            endDate: new Date(date.endDate),
            earlyBirdDeadline: date.earlyBirdDeadline ? new Date(date.earlyBirdDeadline) : null,
            lastMinuteStart: date.lastMinuteStart ? new Date(date.lastMinuteStart) : null
          }))
        };

        setTour(transformedTour);
        setLoading(false);
      } catch (error) {
        console.error('Tur detayları alınırken hata:', error);
        setError('Tur detayları alınamadı');
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
        setTourCount(4); // Sabit 4 tur göster
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

  useEffect(() => {
    const fetchTourOperator = async () => {
      try {
        const response = await fetch(`/api/tour-operators/${tour?.tourOperator.id}`);
        if (!response.ok) {
          throw new Error('Tur operatörü bulunamadı');
        }
        const data = await response.json();
        setTourOperator(data);
      } catch (err) {
        console.error('Tur operatörü yüklenirken hata:', err);
      }
    };

    const fetchOtherTours = async () => {
      try {
        const response = await fetch(`/api/tour-operators/${tour?.tourOperator.id}/tours`, {
          headers: {
            'x-current-tour-id': tour?.id || ''
          }
        });
        if (!response.ok) {
          throw new Error('Turlar yüklenemedi');
        }
        const data = await response.json();
        setOtherTours(data);
      } catch (err) {
        console.error('Turlar yüklenirken hata:', err);
      }
    };

    if (tour?.tourOperator?.id) {
      fetchTourOperator();
      fetchOtherTours();
    }
  }, [tour?.tourOperator?.id, tour?.id]);

  const handleDateSelect = (date: TourDate | null) => {
    setSelectedTourDate(date);
  };

  const handleParticipantsChange = (newParticipants: { [key: string]: number }) => {
    setParticipants(newParticipants);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error || !tour) {
    return notFound();
  }
  
  // Tur resimlerini parse et
  const tourImages = Array.isArray(tour.images) ? tour.images.filter(Boolean) : [];
  
  // Tur dahil olanlar ve olmayanlar
  const inclusions = parseJsonString<string[]>(tour.inclusions, []);
  const exclusions = parseJsonString<string[]>(tour.exclusions, []);
  
  // Tur destinasyonları
  const getDestinationName = (d: TourDestination): string => {
    if (typeof d === 'string') return d;
    return d.city;
  };

  const destinations = Array.isArray(tour.destinations) 
    ? tour.destinations.map(getDestinationName)
    : parseJsonString<Destination[]>(tour.destinations, []).map(d => d.city);
  
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
          {tourImages.length > 0 ? (
            <Image
              src={tourImages[0]}
              alt={tour.name}
              fill
              priority
              style={{ objectFit: "cover" }}
              className="brightness-70 transform scale-100 animate-ken-burns-slow"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <PhotoIcon className="w-20 h-20 text-gray-400" />
            </div>
          )}
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
                  <p className="text-sm font-semibold truncate max-w-[150px]">
                    {destinations[0]}{destinations.length > 1 ? ` +${destinations.length - 1}` : ''}
                  </p>
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
          {/* Kalkış Noktası Bilgileri */}
          <div className="bg-emerald-50/60 rounded-xl p-6 md:p-8 border border-emerald-200/70 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-emerald-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mr-3 text-emerald-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <span>Kalkış Noktaları ve Buluşma Bilgileri</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Ana Kalkış Noktası */}
              <div className="bg-white rounded-lg p-5 border border-emerald-100 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100 rounded-bl-[100px] -z-0 group-hover:bg-emerald-200 transition-colors"></div>
                <div className="absolute top-3 right-3 z-20">
                  <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:shadow flex items-center gap-1.5 transition-all">
                    <MapPinIcon className="w-4 h-4" />
                    <span>Konumu Gör</span>
                  </button>
                </div>
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <MapPinIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full inline-block mb-2">Ana Kalkış Noktası</div>
                      <h5 className="font-medium text-gray-900 mb-1">{tour.departureCity || 'İstanbul'} - Sultanahmet Meydanı</h5>
                      <p className="text-sm text-gray-600 mb-3">Sultanahmet Meydanı, Ayasofya Camii önü</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <ClockIcon className="w-4 h-4 text-emerald-600" />
                          <span>Toplanma Saati: 07:30</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <UserGroupIcon className="w-4 h-4 text-emerald-600" />
                          <span>Rehber: Yeşil Şapkalı Rehber</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Kalkış Noktası */}
              <div className="bg-white rounded-lg p-5 border border-emerald-100 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100 rounded-bl-[100px] -z-0 group-hover:bg-emerald-200 transition-colors"></div>
                <div className="absolute top-3 right-3 z-20">
                  <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:shadow flex items-center gap-1.5 transition-all">
                    <MapPinIcon className="w-4 h-4" />
                    <span>Konumu Gör</span>
                  </button>
                </div>
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <MapPinIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full inline-block mb-2">2. Kalkış Noktası</div>
                      <h5 className="font-medium text-gray-900 mb-1">{tour.departureCity || 'İstanbul'} - Kadıköy İskele</h5>
                      <p className="text-sm text-gray-600 mb-3">Kadıköy İskele Meydanı, Saat Kulesi önü</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <ClockIcon className="w-4 h-4 text-emerald-600" />
                          <span>Toplanma Saati: 08:00</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <UserGroupIcon className="w-4 h-4 text-emerald-600" />
                          <span>Rehber: Mavi Şapkalı Rehber</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Kalkış Noktası */}
              <div className="bg-white rounded-lg p-5 border border-emerald-100 relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100 rounded-bl-[100px] -z-0 group-hover:bg-emerald-200 transition-colors"></div>
                <div className="absolute top-3 right-3 z-20">
                  <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm hover:shadow flex items-center gap-1.5 transition-all">
                    <MapPinIcon className="w-4 h-4" />
                    <span>Konumu Gör</span>
                  </button>
                </div>
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <MapPinIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full inline-block mb-2">3. Kalkış Noktası</div>
                      <h5 className="font-medium text-gray-900 mb-1">{tour.departureCity || 'İstanbul'} - Bakırköy Meydan</h5>
                      <p className="text-sm text-gray-600 mb-3">Bakırköy Özgürlük Meydanı</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <ClockIcon className="w-4 h-4 text-emerald-600" />
                          <span>Toplanma Saati: 08:30</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <UserGroupIcon className="w-4 h-4 text-emerald-600" />
                          <span>Rehber: Kırmızı Şapkalı Rehber</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Önemli Bilgiler */}
            <div className="bg-white rounded-lg p-5 border border-emerald-100">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-600 mr-2" />
                Önemli Hatırlatmalar
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    Tüm kalkış noktalarında profesyonel rehber eşliğinde karşılama yapılacaktır.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    Lütfen belirtilen saatlerden en az 15 dakika önce kalkış noktasında hazır bulununuz.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    Kalkış saatinden 10 dakika sonra hareket edilecektir.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    Rehberlerimiz renkli şapkaları ile kolayca tanınabilir olacaktır.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    Acil durumlar için rehber iletişim numarası tur başlangıç tarihinden 1 gün önce SMS ile paylaşılacaktır.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">•</span>
                    Bagajlarınız için otobüste yeterli alan mevcuttur.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fotoğraf Galerisi */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <PhotoIcon className="h-7 w-7 text-sky-600 mr-3" />
                <span>Fotoğraf Galerisi</span>
              </h2>
              <button className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center">
                Tüm Fotoğraflar
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tourImages.slice(0, 4).map((image, index) => (
                <div 
                  key={index} 
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={image}
                    alt={`${tour.name} - Resim ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white text-sm font-medium truncate">
                        {destinations[index % destinations.length] || 'Tur Lokasyonu'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Konaklama Bilgileri */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <BuildingOfficeIcon className="h-7 w-7 text-sky-600 mr-3" />
                <span>Konaklama</span>
              </h2>
            </div>
            <div className="bg-white rounded-xl overflow-hidden border border-neutral-200/70 shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <Image
                    src={tour.accommodation?.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"}
                    alt={tour.accommodation?.name || 'Rixos Premium Belek'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1.5">
                      <StarIconSolid className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium ml-1.5">{tour.accommodation?.rating || 4.8}</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {tour.accommodation?.name || 'Rixos Premium Belek'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4 text-gray-400" />
                          <span>{tour.accommodation?.location || 'Belek, Antalya'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-sm font-medium text-emerald-600">Müsait</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                        <span>{tour.accommodation?.type || 'Ultra Her Şey Dahil'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
                        <span>{tour.duration - 1} Gece Konaklama</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(tour.accommodation?.features || [
                        'Özel Plaj',
                        'Açık Havuz',
                        'SPA Merkezi',
                        'Fitness Merkezi',
                        'Restoran & Bar'
                      ]).map((feature, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100"
                        >
                          <CheckIcon className="w-3.5 h-3.5 mr-1" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="text-sm text-gray-500">
                      * Konaklama detayları rezervasyon sonrası paylaşılacaktır
                    </div>
                    <button className="inline-flex items-center px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors">
                      Detayları Gör
                      <ChevronRightIcon className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 min-h-[calc(100vh-200px)]">
            {/* Sol Kolon - Tur Bilgileri */}
            <div className="lg:col-span-2 space-y-16 sm:space-y-20 h-full">
              {/* Tur Programı ve Rotası */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md border border-neutral-200/70">
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                      <MapIcon className="h-7 w-7 text-sky-600 mr-3" />
                      <span>Tur Programı ve Rotası</span>
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                        <span>Günlük Program</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span>Önemli Noktalar</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    {/* Rota Çizgisi */}
                    <div className="absolute left-[26px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-sky-200 via-sky-300 to-sky-200"></div>

                    {/* Günlük Program */}
                    <div className="space-y-12">
                      {Object.entries(itinerary).map(([day, content]: [string, ItineraryItem], index: number) => {
                        const dayNumber = (parseInt(day.replace('day', '')) + 1).toString();
                        const tourStartDate = tour.tourDates?.[0]?.startDate;
                        const currentDate = tourStartDate 
                          ? new Date(new Date(tourStartDate).setDate(new Date(tourStartDate).getDate() + index))
                          : null;
                        const formattedDate = currentDate 
                          ? currentDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
                          : `${dayNumber}. Gün`;

                        // Her gün için öne çıkan özellikler
                        const highlights = [
                          { icon: '🏛️', text: 'Tarihi Mekanlar' },
                          { icon: '🍽️', text: 'Yerel Lezzetler' },
                          { icon: '📸', text: 'Fotoğraf Noktaları' },
                          { icon: '🎭', text: 'Kültürel Etkinlikler' },
                          { icon: '🌅', text: 'Doğal Güzellikler' },
                          { icon: '🏺', text: 'Müze Ziyareti' }
                        ].slice(0, (index % 4) + 2);

                        // Gün için örnek fotoğraflar
                        const dayImages = tourImages.slice(index * 2, (index * 2) + 2);

                        return (
                          <div key={index} className="relative flex gap-6">
                            {/* Gün İşareti */}
                            <div className="flex-shrink-0 w-13">
                              <div className="w-13 h-13 rounded-full flex items-center justify-center bg-sky-100 text-sky-600 relative">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-50">
                                  <span className="text-lg font-semibold">{dayNumber}</span>
                                </div>
                                {/* Zaman Çizelgesi Göstergesi */}
                                <div className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </div>
                              </div>
                            </div>

                            {/* Gün Detayları */}
                            <div className="flex-grow">
                              <div className="bg-white rounded-xl border border-neutral-200/70 shadow-sm hover:shadow-md transition-shadow">
                                {/* Üst Bilgi Çubuğu */}
                                <div className="px-5 py-4 border-b border-neutral-100 bg-sky-50/50">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-700">
                                        {formattedDate}
                                      </span>
                                      <h4 className="text-lg font-semibold text-gray-900">
                                        {content.title || destinations[index % destinations.length] || 'Günün Programı'}
                                      </h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button 
                                        className="p-2 hover:bg-white rounded-lg transition-colors" 
                                        title="Haritada Göster"
                                      >
                                        <MapPinIcon className="w-5 h-5 text-gray-500" />
                                      </button>
                                      {dayImages.length > 0 && (
                                        <button 
                                          className="p-2 hover:bg-white rounded-lg transition-colors"
                                          title="Fotoğrafları Görüntüle"
                                        >
                                          <PhotoIcon className="w-5 h-5 text-gray-500" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Ana İçerik */}
                                <div className="p-5">
                                  {/* Açıklama */}
                                  <p className="text-gray-600 text-sm mb-6">{content.description}</p>

                                  {/* Fotoğraflar */}
                                  {dayImages.length > 0 && (
                                    <div className="mb-6">
                                      <div className="grid grid-cols-2 gap-4">
                                        {dayImages.map((image, imgIndex) => (
                                          <div key={imgIndex} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                                            <Image
                                              src={image}
                                              alt={`${content.title || destinations[index % destinations.length]} - ${imgIndex + 1}`}
                                              fill
                                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                              <div className="absolute bottom-3 left-3 right-3">
                                                <p className="text-white text-sm font-medium truncate">
                                                  {content.title || destinations[index % destinations.length]}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Öne Çıkan Özellikler */}
                                  <div className="mb-6">
                                    <h5 className="text-sm font-medium text-gray-700 mb-3">Günün Öne Çıkanları</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                      {highlights.map((highlight, i) => (
                                        <div 
                                          key={i} 
                                          className="flex items-center gap-2 p-2.5 rounded-lg border border-sky-100 bg-sky-50/30"
                                        >
                                          <span className="text-lg">{highlight.icon}</span>
                                          <span className="text-sm text-gray-700">{highlight.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Zaman Çizelgesi */}
                                  <div className="mb-6">
                                    <h5 className="text-sm font-medium text-gray-700 mb-3">Günün Programı</h5>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3 p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                                        <div className="p-2 bg-amber-100 rounded-lg">
                                          <SunIcon className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">Sabah (08:00 - 12:00)</p>
                                          <p className="text-xs text-gray-600">Kahvaltı ve Şehir Turu</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 p-2.5 bg-sky-50 rounded-lg border border-sky-100">
                                        <div className="p-2 bg-sky-100 rounded-lg">
                                          <SunIcon className="w-4 h-4 text-sky-600" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">Öğle (12:00 - 16:00)</p>
                                          <p className="text-xs text-gray-600">Öğle Yemeği ve Müze Ziyareti</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3 p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                          <MoonIcon className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">Akşam (16:00 - 20:00)</p>
                                          <p className="text-xs text-gray-600">Serbest Zaman ve Akşam Yemeği</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Alt Bilgiler */}
                                  <div className="pt-4 border-t border-gray-100">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                      {/* Konum */}
                                      <div className="flex items-center gap-2">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                          <MapPinIcon className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Konum</p>
                                          <p className="text-sm font-medium text-gray-700">
                                            {(() => {
                                              const destination = tour.destinations[index];
                                              if (!destination) return 'Belirtilmemiş';
                                              if (typeof destination === 'string') return destination;
                                              if (typeof destination === 'object' && destination.city) return destination.city;
                                              return 'Belirtilmemiş';
                                            })()}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Mesafe */}
                                      <div className="flex items-center gap-2">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                          </svg>
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Mesafe</p>
                                          <p className="text-sm font-medium text-gray-700">{((index + 1) * 50)} km</p>
                                        </div>
                                      </div>

                                      {/* Aktivite Sayısı */}
                                      <div className="flex items-center gap-2">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                          <CalendarDaysIcon className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Aktiviteler</p>
                                          <p className="text-sm font-medium text-gray-700">{highlights.length} Aktivite</p>
                                        </div>
                                      </div>

                                      {/* Tahmini Süre */}
                                      <div className="flex items-center gap-2">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                          <ClockIcon className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-gray-500">Süre</p>
                                          <p className="text-sm font-medium text-gray-700">12 Saat</p>
                                        </div>
                                      </div>
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
              </div>
            </div>

            {/* Sağ Kolon - Rezervasyon ve Bilgiler */}
            <div className="flex flex-col space-y-8 w-full max-w-[400px] mx-auto">
              {/* Rezervasyon Kartı */}
              <div 
                id="booking" 
                className="bg-white rounded-xl p-6 border border-neutral-200/70 shadow-md w-full top-24"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                    <CalendarDaysIcon className="h-6 w-6 mr-2.5 text-sky-600 flex-shrink-0" />
                    <span>Rezervasyon</span>
                  </h2>
                  {/* Badges */}
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-800">Tur Tarihleri</h3>
                    <div className="text-sm text-neutral-600">
                      {tour.tourDates?.length || 0} tarih mevcut
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {!tour.tourDates || tour.tourDates.length === 0 ? (
                      <div className="text-center py-8">
                        <CalendarDaysIcon className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                        <p className="text-neutral-600">Şu anda mevcut tur tarihi bulunmamaktadır.</p>
                      </div>
                    ) : (
                      tour.tourDates.map((date) => {
                        const isLimited = date.availableSeats <= 5;
                        const startDate = new Date(date.startDate);
                        const endDate = new Date(date.endDate);
                        const hasEarlyBirdDiscount = date.earlyBirdDiscount && date.earlyBirdDeadline && new Date() <= new Date(date.earlyBirdDeadline);
                        const hasLastMinuteDiscount = date.lastMinuteDiscount && date.lastMinuteStart && new Date() >= new Date(date.lastMinuteStart);
                        
                        return (
                          <button
                            key={date.id}
                            onClick={() => {
                              handleDateSelect(date);
                              setExpanded(true);
                              const bottomBar = document.getElementById('booking-panel');
                              if (bottomBar) {
                                bottomBar.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border border-neutral-200/70 hover:border-sky-200 transition-colors text-left w-full"
                          >
                            <div className="flex items-start gap-3">
                              <CalendarDaysIcon className="h-5 w-5 text-sky-600 flex-shrink-0 mt-1" />
                              <div>
                                <div className="text-sm font-medium text-neutral-900">
                                  {startDate.toLocaleDateString('tr-TR', { 
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })} - {endDate.toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${isLimited ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {isLimited ? `Son ${date.availableSeats} kontenjan!` : `${date.availableSeats} kişilik kontenjan`}
                                  </span>
                                  {hasEarlyBirdDiscount && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                                      %{date.earlyBirdDiscount} Erken Rezervasyon
                                    </span>
                                  )}
                                  {hasLastMinuteDiscount && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-100 text-amber-700">
                                      %{date.lastMinuteDiscount} Son Dakika
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="text-lg font-semibold text-sky-700">
                                {date.price.toLocaleString('tr-TR')} ₺
                              </div>
                              {date.minParticipants && (
                                <div className="text-xs text-neutral-500">
                                  Minimum {date.minParticipants} kişi
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
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
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <Image
                          src={tourOperator.logo || '/images/tour-operators/default.jpg'}
                          alt={tourOperator.companyName || 'Tur Operatörü'}
                          width={48}
                          height={48}
                          className="object-cover"
                          />
                        </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{tourOperator.companyName}</h4>
                        <Link 
                          href={`/tour-operator/${tourOperator.id}`} 
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Tüm turları gör
                        </Link>
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

              {/* Acentenin Diğer Turları - Kompakt UI */}
              <div 
                ref={containerRef}
                className="bg-white rounded-xl overflow-hidden border border-neutral-200/70 shadow-md"
              >
                {/* Header - Daha kompakt */}
                <div className="border-b border-neutral-100 px-5 py-4 flex items-center justify-between bg-gray-50/80">
                  <h2 className="text-base font-semibold text-gray-800 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2 text-sky-600 flex-shrink-0" />
                    <span>Acentenin Diğer Turları</span>
                  </h2>
                  <Link 
                    href={`/tour-operator/${tour.tourOperator.id}`}
                    className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors flex items-center group"
                  >
                    <span className="mr-1">Tümünü Gör</span>
                    <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  </Link>
                </div>

                {/* Tours List - Yatay düzen */}
                <div className="p-5 space-y-4">
                  {otherTours.map((otherTour) => (
                    <div 
                          key={otherTour.id} 
                      className="flex items-center gap-4 p-4 rounded-lg border border-neutral-100 hover:border-neutral-200 transition-all bg-white hover:shadow-sm group"
                        >
                      {/* Tur Resmi */}
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                          src={otherTour.images[0]}
                                alt={otherTour.name}
                                fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {otherTour.discount && otherTour.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                            %{otherTour.discount} İndirim
                                  </div>
                        )}
                                </div>

                      {/* Tur Bilgileri */}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-base font-medium text-gray-900 mb-2 truncate">
                          {otherTour.name}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span className="truncate">
                              {typeof otherTour.destinations[0] === 'string' 
                                ? otherTour.destinations[0]
                                : otherTour.destinations[0].city}
                            </span>
                                  </div>
                          <div className="flex items-center">
                            <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span>{otherTour.duration} Gün</span>
                                  </div>
                          <div className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span>Maks. {otherTour.maxParticipants || 20} kişi</span>
                                </div>
                                <div className="flex items-center">
                            <GlobeAltIcon className="w-4 h-4 mr-1.5 text-gray-500 flex-shrink-0" />
                            <span>{otherTour.tourType || 'Kültür Turu'}</span>
                                  </div>
                                </div>
                              </div>

                      {/* Fiyat ve Detay Butonu */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0 pl-4 border-l border-gray-100">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {otherTour.price.toLocaleString('tr-TR')} ₺
                          </div>
                              {otherTour.discount && otherTour.discount > 0 && (
                            <div className="text-sm text-gray-500 line-through">
                              {(otherTour.price * (1 + otherTour.discount / 100)).toLocaleString('tr-TR')} ₺
                                </div>
                              )}
                            </div>
                  <Link 
                          href={`/tour/${otherTour.id}`}
                          className="inline-flex items-center px-4 py-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg text-sm font-medium transition-colors group/link"
                  >
                          <span>Detaylar</span>
                          <ArrowRightIcon className="w-4 h-4 ml-1.5 transform group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                      </div>
                    </div>
                  ))}
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
      
      {/* BottomBookingBar Component */}
      <BottomBookingBar
        tour={tour}
        onDateSelect={handleDateSelect}
        onParticipantsChange={handleParticipantsChange}
        isExpanded={expanded}
        onExpandedChange={setExpanded}
        selectedDate={selectedTourDate}
      />
    </div>
  );
} 