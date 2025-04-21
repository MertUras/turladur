'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  CalendarDaysIcon, 
  UserIcon,
  ArrowRightIcon, 
  CheckCircleIcon,
  ChevronUpIcon,
  CurrencyDollarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

type Props = {
  tour: any
}

export default function BottomBookingBar({ tour }: Props) {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [personCount, setPersonCount] = useState<number | string>(1)
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true)
      } else {
        setVisible(false)
        if (expanded) setExpanded(false);
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [expanded])
  
  const discountedPrice = tour.discount && tour.discount > 0 
    ? (tour.price - (tour.price * (tour.discount / 100)))
    : tour.price;

  const primaryButtonClasses = "inline-flex items-center justify-center px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out";
  const secondaryButtonClasses = "inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out";

  const availableDates = tour.startDate ? [
    new Date(tour.startDate),
    new Date(new Date(tour.startDate).getTime() + 7 * 24 * 60 * 60 * 1000),
    new Date(new Date(tour.startDate).getTime() + 14 * 24 * 60 * 60 * 1000),
    new Date(new Date(tour.startDate).getTime() + 21 * 24 * 60 * 60 * 1000),
  ] : [];

  const formatSelectedDate = (dateString: string | null) => {
    if (!dateString) return 'Tarih seçilmedi';
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    } catch (error) {
      return 'Geçersiz tarih';
    }
  };

  const totalPeople = typeof personCount === 'number' ? personCount : parseInt(personCount, 10) || 1;

  return (
    <>
      <button 
        onClick={() => setExpanded(!expanded)}
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-white text-neutral-700 rounded-t-lg px-5 py-2.5 shadow-md border border-b-0 border-neutral-200/80 flex items-center gap-2 transition-all duration-300 ease-out hover:shadow-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 ${!visible && !expanded ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
        aria-expanded={expanded}
        aria-controls="booking-panel"
      >
        <span className="text-sm font-semibold">
          {expanded ? 'Seçenekleri Kapat' : 'Tarih ve Fiyat Seçenekleri'}
        </span>
        <ChevronUpIcon className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <div 
        id="booking-panel"
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200/80 shadow-lg z-40 transition-transform duration-300 ease-out ${expanded && visible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: 'calc(100vh - 80px)' }}
      >
        <div className="container mx-auto px-4 pt-6 pb-4 h-full flex flex-col relative">
          <button 
            onClick={() => setExpanded(false)}
            className="absolute top-3 right-3 p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500"
            aria-label="Paneli Kapat"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-grow overflow-hidden mb-4 pt-6">
            <div className="bg-white rounded-xl p-4 border border-neutral-200/70 flex flex-col">
              <h3 className="text-base font-semibold text-neutral-800 mb-3 flex items-center flex-shrink-0">
                <CalendarDaysIcon className="w-5 h-5 mr-2 text-sky-600" />
                Tur Tarihini Seçin
              </h3>
              <p className="text-xs text-neutral-600 mb-3 flex-shrink-0">Müsait tarihler aşağıdadır.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100 scrollbar-thumb-rounded-full flex-grow pr-1">
                {availableDates.length > 0 ? availableDates.map((date, index) => {
                  const dateStr = date.toISOString();
                  const formattedDate = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
                  const isLimited = index === 0;
                  return (
                    <div key={index} className="relative">
                      <input 
                        type="radio" 
                        id={`date-${index}`}
                        name="tourDate"
                        value={dateStr}
                        className="peer hidden" 
                        checked={selectedDate === dateStr}
                        onChange={() => setSelectedDate(dateStr)}
                        aria-labelledby={`date-label-${index}`}
                      />
                      <label 
                        id={`date-label-${index}`}
                        htmlFor={`date-${index}`} 
                        className="flex flex-col p-2.5 bg-white border border-neutral-300 rounded-lg cursor-pointer peer-checked:border-sky-600 peer-checked:bg-sky-100 peer-checked:shadow-sm hover:bg-neutral-50/70 transition-colors duration-150 ease-out focus-within:ring-1 focus-within:ring-sky-500 text-left"
                      >
                        <span className="text-sm font-medium text-neutral-800">{formattedDate}</span>
                        {isLimited && (
                          <span className="text-[10px] text-red-600 mt-0.5 font-medium">Son yerler!</span>
                        )}
                        {!isLimited && (
                          <span className="text-[10px] text-emerald-600 mt-0.5 font-medium">Müsait</span>
                        )}
                      </label>
                    </div>
                  );
                }) : (
                  <p className="text-sm text-neutral-500 italic col-span-full text-center py-4">Uygun tarih bulunamadı.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-neutral-200/70 flex flex-col">
              <h3 className="text-base font-semibold text-neutral-800 mb-3 flex items-center flex-shrink-0">
                <UserIcon className="w-5 h-5 mr-2 text-emerald-600" />
                Kişi Sayısı
              </h3>
              <p className="text-xs text-neutral-600 mb-3 flex-shrink-0">Katılımcı sayısını girin.</p>
              <div className="flex items-center justify-center flex-grow mt-4 mb-2">
                <input 
                  type="number" 
                  id="person-count-input"
                  min="1"
                  value={personCount}
                  onChange={(e) => {
                     const val = e.target.value;
                      // Allow empty input temporarily, but parse to number for state
                     if (val === '') {
                       setPersonCount(''); 
                     } else {
                       const numVal = parseInt(val, 10);
                       // Update state only if it's a valid number >= 1
                       if (!isNaN(numVal) && numVal >= 1) {
                         setPersonCount(numVal);
                       } else if (!isNaN(numVal) && numVal < 1) {
                         // If user types 0 or negative, reset to 1 or keep empty?
                         // Let's reset to 1 for simplicity
                         setPersonCount(1); 
                       } 
                       // If input is not a number (e.g., 'abc'), potentially ignore or handle
                       // Currently, parseInt will yield NaN, and it won't update state
                     }
                  }}
                  className="w-24 text-center p-2 border border-neutral-300 rounded-lg text-lg font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-150 ease-out"
                  aria-label="Kişi sayısı"
                />
                <span className="ml-2 text-sm text-neutral-600">kişi</span>
              </div>
            </div>

            <div className="bg-indigo-50/40 rounded-xl p-4 border border-indigo-200/50 flex flex-col">
              <h3 className="text-base font-semibold text-neutral-800 mb-3 flex items-center flex-shrink-0">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-indigo-600" />
                Avantajlarınız
              </h3>
              <ul className="space-y-2.5 flex-grow content-start">
                {[
                  "Ücretsiz iptal imkanı",
                  "Anında onay",
                  "Özel rehber eşliğinde",
                  "7/24 müşteri desteği"
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-neutral-700">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-center mt-auto pt-2 border-t border-indigo-200/50 flex-shrink-0">
                <p className="text-indigo-700 font-medium text-xs">
                  Ödeme şimdi yapılmayacak
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-3 border-t border-neutral-200/80 flex-shrink-0">
            <div className="flex-1 pr-4 order-2 sm:order-1 text-center sm:text-left">
              <div className="flex items-baseline justify-center sm:justify-start gap-2 mb-0.5">
                <span className="text-2xl font-bold text-sky-700">{discountedPrice.toLocaleString('tr-TR')} ₺</span>
                {tour.discount && tour.discount > 0 && (
                  <span className="text-sm text-neutral-400 line-through">{tour.price.toLocaleString('tr-TR')} ₺</span>
                )}
              </div>
              <span className="text-neutral-500 text-xs block">kişi başı</span>
            </div>
            
            <div className="flex gap-3 items-center flex-shrink-0 order-1 sm:order-2">
              <div className="hidden md:flex items-center bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
                <p className="text-xs text-neutral-600 font-medium">
                  {formatSelectedDate(selectedDate)}
                  <span className="mx-1.5">•</span>
                  {totalPeople} kişi
                </p>
              </div>
              
              <button 
                disabled={!selectedDate}
                className={`${primaryButtonClasses} w-full sm:w-auto min-w-[160px] justify-center`}
                onClick={() => console.log('Booking:', { date: selectedDate, people: totalPeople })}
              >
                <CalendarDaysIcon className="w-4 h-4 mr-2" />
                <span>{selectedDate ? 'Rezervasyon Yap' : 'Tarih Seçin'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 