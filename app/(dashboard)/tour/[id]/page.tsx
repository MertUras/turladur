'use client';

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dummyTours, dummyTourOperators } from "@/app/lib/dummy-data";
import { parseJsonString } from "@/app/utils/format";
import BottomBookingBar from "@/app/components/BottomBookingBar";
import { useEffect, useRef, useState } from "react";

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
  ChevronLeftIcon
} from "@heroicons/react/24/outline";

// Solid ikonları
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface TourPageProps {
  params: {
    id: string;
  };
}

interface ItineraryItem {
  day: string;
  description: string;
}

interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function TourPage({ params }: TourPageProps) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [tourCount, setTourCount] = useState(0);

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
      const leftSection = document.querySelector('.lg\\:col-span-2');
      const rightSection = document.querySelector('.space-y-6');
      if (leftSection && rightSection) {
        const leftHeight = leftSection.getBoundingClientRect().height;
        const tourHeight = 300; // Her tur kartının yaklaşık yüksekliği
        const calculatedCount = Math.ceil(leftHeight / tourHeight);
        setTourCount(calculatedCount);
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

  // Tur verilerini al
  const tour = dummyTours.find((tour) => tour.id === params.id);
  
  // Tur bulunamazsa 404 sayfasına yönlendir
  if (!tour) {
    notFound();
  }
  
  // Tur operatörü bilgilerini al
  const tourOperator = dummyTourOperators.find((operator) => operator.id === tour.tourOperatorId);
  
  // Tur resimlerini parse et
  const tourImages = parseJsonString<string[]>(tour.images, []);
  
  // Tur dahil olanlar ve olmayanlar
  const inclusions = parseJsonString<string[]>(tour.inclusions, []);
  const exclusions = parseJsonString<string[]>(tour.exclusions, []);
  
  // Tur destinasyonları
  const destinations = parseJsonString<string[]>(tour.destinations, []);
  
  // Tur programını parse et
  const itinerary = parseJsonString<Record<string, string>>(tour.itinerary || '{}', {});

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

  return (
    <div className="bg-white">
      {/* Üst Banner */}
      <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh]">
        <Image
          src={tourImages[0] || '/placeholder-image.jpg'}
          alt={tour.name}
          fill
          priority
          style={{ objectFit: "cover" }}
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/50"></div>
        
        {/* Öne Çıkan Özellikler - Yatay Bant */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md py-4 border-t border-white/10">
          <div className="container px-4 mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center text-white gap-3">
                <div className="p-2 bg-blue-500/30 rounded-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <p className="text-xs text-blue-200">Süre</p>
                  <p className="font-medium">{tour.duration} Gün</p>
                </div>
              </div>
              
              <div className="flex items-center text-white gap-3">
                <div className="p-2 bg-green-500/30 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-green-200" />
                </div>
                <div>
                  <p className="text-xs text-green-200">Grup Boyutu</p>
                  <p className="font-medium">Maks. {tour.maxParticipants || 10} kişi</p>
                </div>
              </div>
              
              <div className="flex items-center text-white gap-3">
                <div className="p-2 bg-amber-500/30 rounded-lg">
                  <MapPinIcon className="h-6 w-6 text-amber-200" />
                </div>
                <div>
                  <p className="text-xs text-amber-200">Destinasyon</p>
                  <p className="font-medium truncate max-w-[140px]">{destinations[0]}{destinations.length > 1 ? ` +${destinations.length - 1}` : ''}</p>
                </div>
              </div>
              
              <div className="flex items-center text-white gap-3">
                <div className="p-2 bg-purple-500/30 rounded-lg">
                  <StarIcon className="h-6 w-6 text-purple-200" />
                </div>
                <div>
                  <p className="text-xs text-purple-200">Değerlendirme</p>
                  <p className="font-medium">4.8/5</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all p-2 rounded-full text-white">
                  <HeartIcon className="h-6 w-6" />
                </button>
                <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all p-2 rounded-full text-white">
                  <ShareIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center">
            <div className="inline-flex items-center mb-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
              <div className="h-1 w-16 bg-white/80 mr-2"></div>
              <span className="text-white/90 font-medium uppercase tracking-wider text-sm">Premium Tur</span>
              <div className="h-1 w-16 bg-white/80 ml-2"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fadeIn">{tour.name}</h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-white mb-8">
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <MapPinIcon className="w-5 h-5 mr-2 text-blue-400" />
                <span className="font-medium">{destinations.join(', ')}</span>
              </div>
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <ClockIcon className="w-5 h-5 mr-2 text-blue-400" />
                <span className="font-medium">{tour.duration} gün</span>
              </div>
              <div className="flex items-center bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                <UserGroupIcon className="w-5 h-5 mr-2 text-blue-400" />
                <span className="font-medium">Maks. {tour.maxParticipants || 10} kişi</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="#itinerary" 
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center"
              >
                <MapIcon className="h-5 w-5 mr-2" />
                <span>Tur Programı</span>
                <ChevronRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#booking" 
                className="group bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg flex items-center"
              >
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                <span>Rezervasyon Yap</span>
                <ChevronRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container px-4 py-16">
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sol Kolon - Tur Bilgileri */}
          <div className="lg:col-span-2 space-y-16">
            {/* Tur Açıklaması */}
            <div>
              <div className="flex items-center mb-8">
                <div className="h-10 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-900">Tur Hakkında</h2>
              </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100 mb-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3">
                      <p className="text-gray-700 text-lg leading-relaxed mb-6">{tour.description}</p>
              
              {/* Tur Özellikleri */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                              <MapPinIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Rota Detayları</h3>
                          </div>
                          <ul className="space-y-3">
                            <li className="flex items-center text-gray-700">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                              <span>Başlangıç: {destinations[0]}</span>
                            </li>
                            <li className="flex items-center text-gray-700">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                              <span>Bitiş: {destinations[destinations.length - 1]}</span>
                            </li>
                            <li className="flex items-center text-gray-700">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                              <span>Toplam {destinations.length} destinasyon</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                              <ClockIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Tur Programı</h3>
                          </div>
                          <ul className="space-y-3">
                            <li className="flex items-center text-gray-700">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                              <span>{tour.duration} günlük tur</span>
                            </li>
                            <li className="flex items-center text-gray-700">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                              <span>Her gün ortalama 8 saat aktivite</span>
                            </li>
                            <li className="flex items-center text-gray-700">
                              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                              <span>Esnek başlangıç saatleri</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>

            {/* Tur Resimleri */}
            <div>
              <div className="flex items-center mb-8">
                <div className="h-10 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <PhotoIcon className="h-7 w-7 text-blue-600 mr-3" />
                  <span>Fotoğraf Galerisi</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1585924257670-6b97a7fdfb0d?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?q=80&w=800&auto=format&fit=crop'
                  ].map((image, index) => (
                  <div key={index} className="relative h-64 rounded-2xl overflow-hidden group shadow-lg gallery-overlay">
                    <Image
                      src={image}
                      alt={`${tour.name} - Resim ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      className="group-hover:scale-110 transition-transform duration-700"
                        priority={index < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                      <div className="p-4 w-full text-white">
                        <p className="font-medium">Tur Görüntüsü {index + 1}</p>
                        <p className="text-sm opacity-80">{destinations[index % destinations.length] || 'Tur Lokasyonu'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tur Programı */}
            <div id="itinerary" className="scroll-mt-24">
              <div className="flex items-center mb-8">
                <div className="h-10 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <MapIcon className="h-7 w-7 text-blue-600 mr-3" />
                  <span>Tur Programı</span>
                </h2>
              </div>
              
              <div className="space-y-6">
                {Object.entries(itinerary).map(([day, description]: [string, string], index: number) => {
                  const dayNumber = (parseInt(day.replace('day', '')) + 1).toString();
                  return (
                    <div id={`day-${dayNumber}`} key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group scroll-mt-24">
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-10 -mr-10 opacity-50"></div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-white text-xl font-bold">{dayNumber}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Gün {dayNumber}: {destinations[index % destinations.length] || ''}</h3>
                      </div>
                      <div className="p-8 group-hover:bg-blue-50/50 transition-colors duration-300">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="md:w-3/4">
                            <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
                          </div>
                          <div className="md:w-1/4 flex-shrink-0">
                            {index < tourImages.length && (
                              <div className="relative h-48 rounded-xl overflow-hidden shadow-md">
                                <Image
                                  src={tourImages[index]}
                                  alt={`Gün ${dayNumber} - ${destinations[index % destinations.length] || ''}`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                  style={{ objectFit: "cover" }}
                                  className="hover:scale-110 transition-transform duration-700"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        
                          {/* Her günün alt kısmına aktiviteler ve beklentiler */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <h4 className="font-medium text-gray-900 mb-3">Günün Öne Çıkanları</h4>
                          <div className="flex flex-wrap gap-3">
                            {['Kahvaltı', 'Öğle Yemeği', 'Akşam Yemeği'].map((meal: string, i: number) => (
                              <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckIcon className="h-3 w-3 mr-1" />
                                {meal}
                              </span>
                            ))}
                            {/* Aktivite etiketleri */}
                            {['Sanat ve Kültür', 'Doğa Yürüyüşü', 'Alışveriş', 'Plaj Aktiviteleri', 'Tarihi Gezi', 'Yerel Deneyim'].slice(0, (index % 4) + 2).map((activity: string, i: number) => (
                              <span key={`act-${i}`} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <CheckIcon className="h-3 w-3 mr-1" />
                                {activity}
                              </span>
                            ))}
                          </div>
                          
                          {/* Günlük Program Saatleri */}
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start">
                              <div className="p-1.5 bg-amber-100 rounded-lg mr-3 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Sabah</span>
                                <p className="text-sm text-gray-700">08:00 - 12:00</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="p-1.5 bg-blue-100 rounded-lg mr-3 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Öğle</span>
                                <p className="text-sm text-gray-700">12:00 - 16:00</p>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="p-1.5 bg-indigo-100 rounded-lg mr-3 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Akşam</span>
                                <p className="text-sm text-gray-700">16:00 - 20:00</p>
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

          {/* Sağ Kolon - Rezervasyon ve Bilgiler */}
            <div className="space-y-6 w-full max-w-[400px] mx-auto">
            {/* Rezervasyon Kartı */}
              <div id="booking" className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <CalendarDaysIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 flex-shrink-0" />
                    <span>Rezervasyon</span>
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                      Ücretsiz İptal
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                      Anında Onay
                    </div>
                  </div>
              </div>
              
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-100 mb-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                    <span className="text-gray-700 font-medium flex items-center truncate">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                      <span className="truncate">Kişi Başı</span>
                    </span>
                    <div className="text-right min-w-0">
                      {tour.discount && tour.discount > 0 ? (
                        <>
                          <div className="flex items-center justify-end gap-2 mb-1 flex-wrap">
                            <span className="line-through text-gray-400 text-base sm:text-lg truncate">{tour.price} ₺</span>
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap">%{tour.discount} İndirim</span>
                          </div>
                          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">{(tour.price - (tour.price * (tour.discount || 0) / 100)).toLocaleString('tr-TR')} ₺</span>
                        </>
                      ) : (
                        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">{tour.price.toLocaleString('tr-TR')} ₺</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
                      <span className="text-gray-600 truncate">Toplam tutar ({tour.duration} gün):</span>
                      <span className="font-semibold text-gray-800 truncate">
                        {tour.discount && tour.discount > 0 
                          ? ((tour.price - (tour.price * (tour.discount || 0) / 100)) * tour.duration).toLocaleString('tr-TR') 
                          : (tour.price * tour.duration).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all transform hover:translate-y-[-2px] shadow-lg hover:shadow-blue-500/25 flex items-center justify-center">
                    <CalendarDaysIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
                    <span className="truncate">Hızlı Rezervasyon</span>
                    <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </button>
                  
                  <button className="group w-full bg-white text-blue-600 border-2 border-blue-600 py-3 sm:py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:translate-y-[-2px] shadow-lg flex items-center justify-center">
                    <EnvelopeIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
                    <span className="truncate">Fiyat Bilgisi Al</span>
                    <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </button>
                </div>
              </div>

              {/* Tur Operatörü Bilgileri */}
              {tourOperator && (
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 flex-shrink-0" />
                    <span>Tur Operatörü</span>
                  </h2>
                    <div className="flex items-center text-sm flex-wrap">
                      <div className="flex items-center text-yellow-400 mr-2">
                        {renderStars(4.8)}
                      </div>
                      <span className="text-gray-600 truncate">(24 değerlendirme)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-gray-100 shadow-md flex-shrink-0">
                      <Image
                        src={tourOperator.logo || '/placeholder-image.jpg'}
                        alt={tourOperator.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="text-center sm:text-left min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 truncate">{tourOperator.name}</h3>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                          Sertifikalı
                        </div>
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                          {tour.duration}+ yıl deneyim
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border border-blue-100 mb-6">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base line-clamp-3">{tourOperator.description?.substring(0, 150) || 'Tur operatörü hakkında bilgi bulunmamaktadır.'}...</p>
                  </div>
                  
                  <Link 
                    href={`/tour-operator/${tourOperator.id}`} 
                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center group text-sm sm:text-base truncate"
                  >
                    <span className="truncate">Tur operatörü hakkında daha fazla bilgi</span>
                    <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </Link>
                </div>
              )}

              {/* Dahil Olanlar / Olmayanlar */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 w-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center truncate">
                    <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 flex-shrink-0" />
                    <span className="truncate">Dahil Olanlar / Olmayanlar</span>
                </h2>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center truncate">
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 flex-shrink-0" />
                    <span className="truncate">Dahil Olanlar</span>
                  </h3>
                  <ul className="space-y-3">
                    {inclusions.map((item, index) => (
                      <li key={index} className="flex items-start bg-green-50 p-3 sm:p-4 rounded-xl hover:bg-green-100 transition-colors">
                        <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-sm sm:text-base truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center truncate">
                    <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600 flex-shrink-0" />
                    <span className="truncate">Dahil Olmayanlar</span>
                  </h3>
                  <ul className="space-y-3">
                    {exclusions.map((item, index) => (
                      <li key={index} className="flex items-start bg-red-50 p-3 sm:p-4 rounded-xl hover:bg-red-100 transition-colors">
                        <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-sm sm:text-base truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Acentenin Diğer Turları */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 w-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 flex-shrink-0" />
                    <span className="truncate">Acentenin Diğer Turları</span>
                  </h2>
                </div>

                <div className="space-y-6">
                  {dummyTours
                    .filter(t => t.tourOperatorId === tour.tourOperatorId && t.id !== tour.id)
                    .slice(0, tourCount)
                    .map((otherTour) => (
                      <Link 
                        key={otherTour.id} 
                        href={`/tour/${otherTour.id}`}
                        className="group block"
                      >
                        <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="relative h-48 w-full">
                            <Image
                              src={parseJsonString<string[]>(otherTour.images, [])[0] || '/placeholder-image.jpg'}
                              alt={otherTour.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: "cover" }}
                              className="group-hover:scale-110 transition-transform duration-700"
                              priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute top-2 right-2">
                              {otherTour.discount && otherTour.discount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  %{otherTour.discount} İndirim
                                </span>
                              )}
                            </div>
                            <div className="absolute top-2 left-2">
                              <span className="bg-blue-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {otherTour.duration} Gün
                              </span>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                            <h3 className="text-xl font-bold mb-1 truncate">{otherTour.name}</h3>
                            <div className="flex items-center text-sm text-white/90 mb-2">
                              <MapPinIcon className="w-4 h-4 mr-1" />
                              <span className="truncate">
                                {parseJsonString<string[]>(otherTour.destinations, []).join(', ')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <CalendarDaysIcon className="w-4 h-4 mr-1" />
                                <span>{otherTour.startDate ? otherTour.startDate.toLocaleDateString('tr-TR', { 
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                }) : 'Tarih belirtilmemiş'}</span>
                              </div>
                              <div className="text-right">
                                {otherTour.discount && otherTour.discount > 0 ? (
                                  <>
                                    <span className="line-through text-white/60 text-sm mr-2">{otherTour.price} ₺</span>
                                    <span className="text-xl font-bold text-white">
                                      {(otherTour.price - (otherTour.price * (otherTour.discount || 0) / 100)).toLocaleString('tr-TR')} ₺
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-xl font-bold text-white">
                                    {otherTour.price.toLocaleString('tr-TR')} ₺
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>

                <Link 
                  href={`/tour-operator/${tour.tourOperatorId}`}
                  className="mt-4 text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center group text-sm sm:text-base"
                >
                  <span className="truncate">Tüm turları görüntüle</span>
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transform group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animasyonlu Scroll İndikatörü */}
      {showScrollIndicator && (
      <div className="fixed bottom-28 right-8 hidden md:flex flex-col items-center animate-bounce-subtle z-30">
        <div className="text-xs font-medium text-blue-600 mb-1">Daha Fazla</div>
        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
      )}
      
      {/* Video Tour Düğmesi */}
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 hidden lg:block z-30">
        <button className="group relative w-16 h-16 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 transition-colors">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-30"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="absolute -left-24 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded">Video Turu</span>
        </button>
      </div>
      
      {/* Acentenin Diğer Turları ve Benzer Turlar */}
      <div className="bg-gray-50 py-16">
        <div className="container px-4">
          <div className="max-w-7xl mx-auto">
            {/* Acentenin Diğer Turları */}


            

            {/* Benzer Turlar */}
            <div>
              <div className="flex items-center mb-10">
                <div className="h-10 w-2 bg-blue-600 rounded-full mr-4"></div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <GlobeAltIcon className="h-7 w-7 text-blue-600 mr-3" />
                  <span>Benzer Turlar</span>
                </h2>
              </div>
              
              <div className="relative">
                <div className="overflow-x-auto pb-6 hide-scrollbar" id="similarToursSlider">
                  <div className="flex space-x-6 min-w-max">
                    {dummyTours
                      .filter(t => t.id !== tour.id && t.tourOperatorId !== tour.tourOperatorId)
                      .map((similarTour) => (
                        <Link 
                          key={similarTour.id} 
                          href={`/tour/${similarTour.id}`}
                          className="group w-80 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <div className="relative h-48">
                            <Image
                              src={parseJsonString<string[]>(similarTour.images, [])[0] || '/placeholder-image.jpg'}
                              alt={similarTour.name}
                              fill
                              style={{ objectFit: "cover" }}
                              className="group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-xl font-bold text-white mb-2">{similarTour.name}</h3>
                              <div className="flex items-center text-white/90 text-sm">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                <span>{parseJsonString<string[]>(similarTour.destinations, []).join(', ')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center">
                                <ClockIcon className="w-5 h-5 text-gray-400 mr-2" />
                                <span className="text-gray-600">{similarTour.duration} gün</span>
                              </div>
                              <div className="text-right">
                                {similarTour.discount && similarTour.discount > 0 ? (
                                  <>
                                    <span className="line-through text-gray-400 text-sm mr-2">{similarTour.price} ₺</span>
                                    <span className="text-lg font-bold text-blue-600">{(similarTour.price - (similarTour.price * (similarTour.discount || 0) / 100)).toLocaleString('tr-TR')} ₺</span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-blue-600">{similarTour.price.toLocaleString('tr-TR')} ₺</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <UserGroupIcon className="w-5 h-5 text-gray-400 mr-2" />
                                <span className="text-gray-600">Maks. {similarTour.maxParticipants || 10} kişi</span>
                              </div>
                              <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center group">
                                <span>Detaylar</span>
                                <ChevronRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all z-10"
                  onClick={() => {
                    const slider = document.getElementById('similarToursSlider');
                    if (slider) {
                      slider.scrollBy({ left: -320, behavior: 'smooth' });
                    }
                  }}
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
                <button 
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all z-10"
                  onClick={() => {
                    const slider = document.getElementById('similarToursSlider');
                    if (slider) {
                      slider.scrollBy({ left: 320, behavior: 'smooth' });
                    }
                  }}
                >
                  <ChevronRightIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            {/* Güven ve Avantajlar */}
            <div className="mt-10 mb-12">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Neden Bizi Tercih Etmelisiniz?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Güvenli Ödeme */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 border border-blue-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 00-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Güvenli Ödeme</h3>
                    <p className="text-sm text-gray-600">
                      256-bit SSL şifreleme ile güvenli alışveriş
                    </p>
                  </div>

                  {/* 7/24 Destek */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 border border-green-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">7/24 Destek</h3>
                    <p className="text-sm text-gray-600">
                      Uzman ekibimiz her zaman yanınızda
                    </p>
                  </div>

                  {/* En İyi Fiyat */}
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 border border-amber-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">En İyi Fiyat</h3>
                    <p className="text-sm text-gray-600">
                      Aynı tur için fiyat garantisi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Client componenti ekliyoruz */}
      <BottomBookingBar tour={tour} />
    </div>
  );
} 