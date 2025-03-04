'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// import { Tour } from '@/types/tours' // Gerekirse düzeltilmeli, import path'i kontrol edilmeli

type Props = {
  tour: any // Tour tipini kendi projenizin yapısına göre ayarlayın
}

export default function BottomBookingBar({ tour }: Props) {
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      // Sayfada belirli bir mesafe scroll yapıldığında çubuğu göster
      if (window.scrollY > 400) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // İndirim hesaplaması
  const discountedPrice = tour.discount && tour.discount > 0 
    ? (tour.price - (tour.price * (tour.discount / 100)))
    : tour.price;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-xl z-50 transition-all duration-300 transform ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div>
            {tour.discount && tour.discount > 0 ? (
              <>
                <span className="text-sm text-gray-400 line-through mr-2">{tour.price.toLocaleString('tr-TR')} ₺</span>
                <span className="text-2xl font-bold text-blue-600">{discountedPrice.toLocaleString('tr-TR')} ₺</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-blue-600">{tour.price.toLocaleString('tr-TR')} ₺</span>
            )}
            <span className="text-gray-500 text-xs block">kişi başı</span>
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="hidden md:flex">
              <select 
                className="h-12 border border-gray-300 rounded-lg px-3 text-gray-700 mr-2" 
                defaultValue="2"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>{num} Kişi</option>
                ))}
              </select>
              
              <select 
                className="h-12 border border-gray-300 rounded-lg px-3 text-gray-700 mr-2"
              >
                {tour.startDate && (
                  <>
                    <option value={new Date(tour.startDate).toISOString()}>
                      {new Date(tour.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                    </option>
                    <option value={new Date(new Date(tour.startDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()}>
                      {new Date(new Date(tour.startDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                    </option>
                  </>
                )}
              </select>
            </div>
            
            <a href="#booking" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
              </svg>
              Rezervasyon Yap
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 