"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface FooterProps {
    className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  
  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`bg-gray-900 text-white pt-16 pb-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Üst kısım - Logo, linkler ve mobil görünüm için akordeonlar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Logo ve hakkında kısmı */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-4">
              <div className="mr-2 bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                </svg>
              </div>
              <span className="text-xl font-bold">TourTech</span>
            </div>
            <p className="text-gray-400 mb-4">
              TourTech ile dünyanın en güzel destinasyonlarını keşfedin. Seyahatlerinizi planlamanın en kolay ve en uygun fiyatlı yolu.
            </p>
            <div className="flex space-x-4 mb-8">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-colors">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                </svg>
              </a>
            </div>
            
            {/* Ödeme yöntemleri */}
            <div>
              <h5 className="font-medium text-sm mb-3">Ödeme Yöntemleri</h5>
              <div className="flex flex-wrap gap-2">
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <Image src="/payment/visa.webp" alt="Visa" width={20} height={12} />
                </div>
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <Image src="/payment/mastercard.webp" alt="MasterCard" width={20} height={12} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Masaüstü görünümü için linkler - Mobilde akordeon görünümünde olacak */}
          <div className="hidden md:grid md:col-span-8 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-bold text-lg mb-4">Turlar</h4>
              <ul className="space-y-2">
                <li><Link href="/tours/daily" className="text-gray-400 hover:text-white transition-colors">Günlük Turlar</Link></li>
                <li><Link href="/tours/honeymoon" className="text-gray-400 hover:text-white transition-colors">Balayı Paketleri</Link></li>
                <li><Link href="/tours/adventure" className="text-gray-400 hover:text-white transition-colors">Macera Turları</Link></li>
                <li><Link href="/tours/cultural" className="text-gray-400 hover:text-white transition-colors">Kültür Turları</Link></li>
                <li><Link href="/tours/all" className="text-gray-400 hover:text-white transition-colors">Tüm Turlar</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Rotalar</h4>
              <ul className="space-y-2">
                <li><Link href="/routes/1" className="text-gray-400 hover:text-white transition-colors">İstanbul - Kapadokya</Link></li>
                <li><Link href="/routes/2" className="text-gray-400 hover:text-white transition-colors">Akdeniz Kıyıları</Link></li>
                <li><Link href="/routes/3" className="text-gray-400 hover:text-white transition-colors">Ege Kıyıları</Link></li>
                <li><Link href="/routes/4" className="text-gray-400 hover:text-white transition-colors">Kapadokya - Pamukkale</Link></li>
                <li><Link href="/routes" className="text-gray-400 hover:text-white transition-colors">Tüm Rotalar</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Aktiviteler</h4>
              <ul className="space-y-2">
                <li><Link href="/activities/boat-tours" className="text-gray-400 hover:text-white transition-colors">Tekne Turları</Link></li>
                <li><Link href="/activities/food-tours" className="text-gray-400 hover:text-white transition-colors">Yemek Turları</Link></li>
                <li><Link href="/activities/city-tours" className="text-gray-400 hover:text-white transition-colors">Şehir Turları</Link></li>
                <li><Link href="/activities/balloon-tours" className="text-gray-400 hover:text-white transition-colors">Balon Turları</Link></li>
                <li><Link href="/activities/all" className="text-gray-400 hover:text-white transition-colors">Tüm Aktiviteler</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4">Şirket</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Hakkımızda</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Kariyer</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/press" className="text-gray-400 hover:text-white transition-colors">Basın</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">İletişim</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Mobil görünüm için akordeonlar */}
          <div className="md:hidden space-y-4">
            {/* Turlar Akordeonu */}
            <div className="border-b border-gray-700 pb-4">
              <button 
                onClick={() => toggleAccordion('tours')}
                className="flex justify-between items-center w-full text-left font-bold"
              >
                Turlar
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform ${activeAccordion === 'tours' ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeAccordion === 'tours' && (
                <ul className="mt-3 space-y-2 pl-2">
                  <li><Link href="/tours/daily" className="text-gray-400">Günlük Turlar</Link></li>
                  <li><Link href="/tours/honeymoon" className="text-gray-400">Balayı Paketleri</Link></li>
                  <li><Link href="/tours/adventure" className="text-gray-400">Macera Turları</Link></li>
                  <li><Link href="/tours/cultural" className="text-gray-400">Kültür Turları</Link></li>
                  <li><Link href="/tours/all" className="text-gray-400">Tüm Turlar</Link></li>
                </ul>
              )}
            </div>
            
            {/* Rotalar Akordeonu */}
            <div className="border-b border-gray-700 pb-4">
              <button 
                onClick={() => toggleAccordion('routes')}
                className="flex justify-between items-center w-full text-left font-bold"
              >
                Rotalar
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform ${activeAccordion === 'routes' ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeAccordion === 'routes' && (
                <ul className="mt-3 space-y-2 pl-2">
                  <li><Link href="/routes/1" className="text-gray-400">İstanbul - Kapadokya</Link></li>
                  <li><Link href="/routes/2" className="text-gray-400">Akdeniz Kıyıları</Link></li>
                  <li><Link href="/routes/3" className="text-gray-400">Ege Kıyıları</Link></li>
                  <li><Link href="/routes/4" className="text-gray-400">Kapadokya - Pamukkale</Link></li>
                  <li><Link href="/routes" className="text-gray-400">Tüm Rotalar</Link></li>
                </ul>
              )}
            </div>
            
            {/* Aktiviteler Akordeonu */}
            <div className="border-b border-gray-700 pb-4">
              <button 
                onClick={() => toggleAccordion('activities')}
                className="flex justify-between items-center w-full text-left font-bold"
              >
                Aktiviteler
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform ${activeAccordion === 'activities' ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeAccordion === 'activities' && (
                <ul className="mt-3 space-y-2 pl-2">
                  <li><Link href="/activities/boat-tours" className="text-gray-400">Tekne Turları</Link></li>
                  <li><Link href="/activities/food-tours" className="text-gray-400">Yemek Turları</Link></li>
                  <li><Link href="/activities/city-tours" className="text-gray-400">Şehir Turları</Link></li>
                  <li><Link href="/activities/balloon-tours" className="text-gray-400">Balon Turları</Link></li>
                  <li><Link href="/activities/all" className="text-gray-400">Tüm Aktiviteler</Link></li>
                </ul>
              )}
            </div>
            
            {/* Şirket Akordeonu */}
            <div className="border-b border-gray-700 pb-4">
              <button 
                onClick={() => toggleAccordion('company')}
                className="flex justify-between items-center w-full text-left font-bold"
              >
                Şirket
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-transform ${activeAccordion === 'company' ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeAccordion === 'company' && (
                <ul className="mt-3 space-y-2 pl-2">
                  <li><Link href="/about" className="text-gray-400">Hakkımızda</Link></li>
                  <li><Link href="/careers" className="text-gray-400">Kariyer</Link></li>
                  <li><Link href="/blog" className="text-gray-400">Blog</Link></li>
                  <li><Link href="/press" className="text-gray-400">Basın</Link></li>
                  <li><Link href="/contact" className="text-gray-400">İletişim</Link></li>
                </ul>
              )}
            </div>
          </div>
        </div>
        
        {/* Orta kısım - Abonelik */}
        <div className="border-t border-gray-800 pt-8 pb-10">
          <div className="max-w-xl mx-auto text-center">
            <h4 className="text-lg font-bold mb-2">TourTech Bültenine Abone Olun</h4>
            <p className="text-gray-400 mb-4">En güncel seyahat haberleri ve özel fırsatları almak için kayıt olun</p>
            
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="E-posta adresiniz" 
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>
        
        {/* Alt kısım - Telif hakkı, yasal linkler */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} TourTech. Tüm hakları saklıdır.
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                Kullanım Şartları
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/cookie-policy" className="text-gray-500 hover:text-white transition-colors">
                Çerez Politikası
              </Link>
              <Link href="/accessibility" className="text-gray-500 hover:text-white transition-colors">
                Erişilebilirlik
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 