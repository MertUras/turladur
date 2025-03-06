'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'

type Props = {
  tour: any
}

export default function BottomBookingBar({ tour }: Props) {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [personCount, setPersonCount] = useState(2)
  
  useEffect(() => {
    const handleScroll = () => {
      // Sayfada belirli bir mesafe scroll yapıldığında çubuğu göster
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
  
  // İndirim hesaplaması
  const discountedPrice = tour.discount && tour.discount > 0 
    ? (tour.price - (tour.price * (tour.discount / 100)))
    : tour.price;

  return (
    <>
      {/* Genişletme düğmesi - Her zaman sabit pozisyonda */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl px-6 py-3 shadow-lg border border-b-0 border-blue-700 flex items-center gap-2 transition-all hover:from-blue-700 hover:to-indigo-700 ${!visible && 'translate-y-full'} animate-float`}
      >
        <span className="font-medium">
          {expanded ? 'Küçült' : 'Rezervasyon Seçenekleri'}
        </span>
        <ChevronUpIcon className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Ana içerik paneli - Expanded olduğunda görünür */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 booking-bar-shadow z-40 transition-all duration-500 ${expanded && visible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="container mx-auto py-6 overflow-hidden max-h-[600px] h-[500px]">
          {/* Genişletilmiş içerik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 rounded-xl p-5 shadow-inner border border-blue-100 relative overflow-hidden animate-gradient bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-40"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <CalendarDaysIcon className="w-5 h-5 mr-2 text-blue-600" />
                Tur Tarihleri
              </h3>
              <p className="text-gray-600 mb-4">Aşağıdaki tarihlerden birini seçerek rezervasyon yapabilirsiniz:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3 custom-scrollbar overflow-y-auto max-h-[220px]">
                {tour.startDate && (
                  <>
                    {[0, 7, 14, 21].map((days, index) => {
                      const date = new Date(new Date(tour.startDate).getTime() + days * 24 * 60 * 60 * 1000);
                      const dateStr = date.toISOString();
                      const formattedDate = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
                      
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
                          />
                          <label 
                            htmlFor={`date-${index}`} 
                            className="flex flex-col p-3 bg-white border border-gray-300 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:bg-gray-50 transition-all day-card-hover"
                          >
                            <span className="text-sm font-medium text-gray-900">{formattedDate}</span>
                            <span className="text-xs text-gray-500 mt-1">
                              {index === 0 ? 'Sınırlı kontenjan!' : 'Müsait'}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-5 shadow-inner border border-green-100 relative overflow-hidden animate-gradient bg-gradient-to-r from-green-50 via-emerald-50 to-green-50">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-40"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <UserGroupIcon className="w-5 h-5 mr-2 text-green-600" />
                Kişi Sayısı
              </h3>
              <p className="text-gray-600 mb-4">Turu kaç kişi için rezerve etmek istiyorsunuz?</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className="relative">
                    <input 
                      type="radio" 
                      id={`person-${num}`} 
                      name="personCount" 
                      value={num}
                      className="peer hidden" 
                      checked={personCount === num}
                      onChange={() => setPersonCount(num)}
                    />
                    <label 
                      htmlFor={`person-${num}`} 
                      className="flex flex-col items-center justify-center p-3 bg-white border border-gray-300 rounded-lg cursor-pointer peer-checked:border-green-600 peer-checked:bg-green-50 hover:bg-gray-50 transition-all day-card-hover"
                    >
                      <span className="text-lg font-semibold">{num}</span>
                      <span className="text-xs text-gray-500">Kişi</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-5 shadow-inner border border-indigo-100 relative overflow-hidden animate-gradient bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-100 rounded-full -mr-10 -mt-10 opacity-40 animate-pulse-slow"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-indigo-600" />
                Avantajlar
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                  <span>Ücretsiz iptal imkanı</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                  <span>Anında onay</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                  <span>Özel rehber eşliğinde</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-600" />
                  <span>7/24 müşteri desteği</span>
                </li>
              </ul>
              <div className="text-center mt-4 pt-2 border-t border-indigo-200">
                <p className="text-indigo-700 font-medium text-sm">
                  Ödeme şimdi yapılmayacak
                </p>
              </div>
            </div>
          </div>

          {/* Alt kısım - Fiyat ve Rezervasyon butonu */}
          <div className="flex items-center justify-between px-4 bg-white border-t border-gray-100 pt-4">
            <div>
              {tour.discount && tour.discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-sm text-gray-400 line-through mr-2">{tour.price.toLocaleString('tr-TR')} ₺</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{discountedPrice.toLocaleString('tr-TR')} ₺</span>
                  <span className="bg-red-100 text-red-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-full">%{tour.discount} İndirim</span>
                </div>
              ) : (
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{tour.price.toLocaleString('tr-TR')} ₺</span>
              )}
              <span className="text-gray-500 text-xs block">kişi başı</span>
            </div>
            
            <div className="flex gap-3 items-center">
              <div className="hidden md:block text-right">
                <p className="text-gray-700 font-medium">
                  {selectedDate 
                    ? new Date(selectedDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }) 
                    : 'Tarih seçilmedi'}
                </p>
                <p className="text-sm text-gray-500">{personCount} kişi</p>
              </div>
              
              <a 
                href="#booking" 
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-blue-500/25 flex items-center btn-hover-effect"
              >
                <CalendarDaysIcon className="w-5 h-5 mr-2" />
                <span>Rezervasyon Yap</span>
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 