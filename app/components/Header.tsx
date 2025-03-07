"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DealsPopup from "./DealsPopup";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dealsOpen, setDealsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Sayfa kaydırıldığında header'ın görünümünü değiştir
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sayfa değiştiğinde dropdown ve menüyü kapat
  useEffect(() => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
    setSearchOpen(false);
    setDealsOpen(false);
  }, [pathname]);

  // Arama açıldığında input'a odaklan
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  // Dışarı tıklandığında dropdown'ları kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-sm ${
        isScrolled 
          ? "bg-white/90 shadow-lg py-2" 
          : "bg-gradient-to-b from-black/50 to-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-10 w-10 mr-2 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                <span className="transform transition-transform duration-300 group-hover:scale-110">T</span>
              </div>
            </div>
            <span className={`text-2xl font-bold ${
              isScrolled ? "text-blue-700" : "text-white"
            } transition-all duration-300`}>
              TourTech
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <div className="relative group dropdown-container">
              <button 
                className={`px-3 py-2 rounded-md font-medium text-sm flex items-center ${
                  isScrolled ? "text-gray-700 hover:text-blue-700" : "text-white hover:text-blue-100"
                } transition-colors duration-300`}
                onClick={() => toggleDropdown('destinations')}
                aria-expanded={activeDropdown === 'destinations'}
              >
                Destinasyonlar
                <svg 
                  className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'destinations' ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
              {activeDropdown === 'destinations' && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 grid grid-cols-2 gap-2 z-50 border border-gray-100 transform transition-all opacity-100 scale-100">
                  <Link href="/destinations/istanbul" className="p-2 rounded-lg hover:bg-blue-50 flex flex-col transition-colors">
                    <span className="font-medium text-gray-900">İstanbul</span>
                    <span className="text-xs text-gray-500">324 otel</span>
                  </Link>
                  <Link href="/destinations/antalya" className="p-2 rounded-lg hover:bg-blue-50 flex flex-col transition-colors">
                    <span className="font-medium text-gray-900">Antalya</span>
                    <span className="text-xs text-gray-500">196 otel</span>
                  </Link>
                  <Link href="/destinations/cappadocia" className="p-2 rounded-lg hover:bg-blue-50 flex flex-col transition-colors">
                    <span className="font-medium text-gray-900">Kapadokya</span>
                    <span className="text-xs text-gray-500">87 otel</span>
                  </Link>
                  <Link href="/destinations/bodrum" className="p-2 rounded-lg hover:bg-blue-50 flex flex-col transition-colors">
                    <span className="font-medium text-gray-900">Bodrum</span>
                    <span className="text-xs text-gray-500">124 otel</span>
                  </Link>
                  <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                    <Link href="/destinations" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center">
                      Tüm destinasyonları gör
                      <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative group dropdown-container">
              <button 
                onClick={() => toggleDropdown('hotels')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-white hover:bg-white/10"
                } flex items-center`}
              >
                Oteller
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === 'hotels' ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {activeDropdown === 'hotels' && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 z-50 animate-fadeIn">
                  <Link href="/hotel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Tüm Oteller
                  </Link>
                  <Link href="/hotel?type=BOUTIQUE_HOTEL" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Butik Oteller
                  </Link>
                  <Link href="/hotel?type=RESORT" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Tatil Köyleri
                  </Link>
                  <Link href="/hotel?stars=5" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    5 Yıldızlı Oteller
                  </Link>
                </div>
              )}
            </div>
            
            <div className="relative group dropdown-container">
              <button 
                onClick={() => toggleDropdown('tours')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-white hover:bg-white/10"
                } flex items-center`}
              >
                Turlar
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === 'tours' ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {activeDropdown === 'tours' && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 z-50 animate-fadeIn">
                  <Link href="/tour-operator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Tüm Turlar
                  </Link>
                  <Link href="/tour-operator?duration=1" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Günübirlik Turlar
                  </Link>
                  <Link href="/tour-operator?duration=7" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Haftalık Turlar
                  </Link>
                  <Link href="/tour-operator?featured=true" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Öne Çıkan Turlar
                  </Link>
                </div>
              )}
            </div>
            
            <div className="relative group dropdown-container">
              <button 
                onClick={() => toggleDropdown('experiences')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-white hover:bg-white/10"
                } flex items-center`}
              >
                Deneyimler
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === 'experiences' ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {activeDropdown === 'experiences' && (
                <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 z-50 animate-fadeIn">
                  <Link href="/experience" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Tüm Deneyimler
                  </Link>
                  <Link href="/experience?category=Gastronomi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Gastronomi
                  </Link>
                  <Link href="/experience?category=Kültür" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Kültür Turları
                  </Link>
                  <Link href="/experience?category=Macera" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-150">
                    Macera Aktiviteleri
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/about" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-white hover:bg-white/10"
              }`}
            >
              Hakkımızda
            </Link>
            
            <Link 
              href="/contact" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-white hover:bg-white/10"
              }`}
            >
              İletişim
            </Link>

            {/* Deals button */}
            <button 
              onClick={() => setDealsOpen(true)}
              className={`ml-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                isScrolled 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
              Fırsatlar
              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                Yeni
              </span>
            </button>

            {/* Arama Butonu */}
            <button 
              onClick={toggleSearch} 
              className={`ml-2 p-2 rounded-full ${
                isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              } transition-colors duration-300 relative`}
              aria-label="Aramayı aç"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              {!searchOpen && (
                <span className={`absolute inset-0 flex items-center justify-center ${
                  isScrolled ? "text-gray-700" : "text-white"
                } opacity-0 transition-opacity duration-300 group-hover:opacity-100`}>
                  <span className="sr-only">Ara</span>
                </span>
              )}
            </button>
          </nav>

          {/* Desktop Search and Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Link 
              href="/auth/login" 
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-300 ${
                isScrolled 
                  ? "text-blue-700 border-blue-700 hover:bg-blue-50" 
                  : "text-white border-white hover:bg-white/10"
              }`}
            >
              Giriş Yap
            </Link>
            <Link 
              href="/auth/register" 
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isScrolled 
                  ? "bg-blue-700 text-white hover:bg-blue-800" 
                  : "bg-white text-blue-700 hover:bg-gray-100"
              }`}
            >
              Kaydol
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-1">
            <button 
              onClick={toggleSearch} 
              className={`p-2 rounded-full ${
                isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              } transition-colors`}
              aria-label="Aramayı aç"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 rounded-md ${
                isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              } transition-colors`}
              aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 px-4 transition-all duration-300 ease-in-out z-50">
          <div className={`mx-auto max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform ${searchOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                placeholder="Otel, şehir veya aktivite ara..."
                className="w-full py-4 pl-12 pr-16 text-gray-700 focus:outline-none focus:ring-0 text-base"
                ref={searchInputRef}
              />
              <button 
                onClick={toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="border-t border-gray-100 p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-500">Popüler Aramalar</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button className="flex items-center text-left p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-1.5 rounded-full bg-gray-100 mr-3">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-800 text-sm">İstanbul'da 5 yıldızlı oteller</span>
                </button>
                <button className="flex items-center text-left p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-1.5 rounded-full bg-gray-100 mr-3">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-800 text-sm">Kapadokya balon turu</span>
                </button>
                <button className="flex items-center text-left p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-1.5 rounded-full bg-gray-100 mr-3">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-800 text-sm">Antalya tekne turu</span>
                </button>
                <button className="flex items-center text-left p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-1.5 rounded-full bg-gray-100 mr-3">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className="text-gray-800 text-sm">Pamukkale termal otel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-xl rounded-b-lg z-40 max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-3">
            <div className="border-b border-gray-100 pb-3">
              <button className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => toggleDropdown('destinations-mobile')}>
                <span className="font-medium">Destinasyonlar</span>
                <svg className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === 'destinations-mobile' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
              
              {activeDropdown === 'destinations-mobile' && (
                <div className="mt-2 pl-4 space-y-2">
                  <Link href="/destinations/istanbul" className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">İstanbul</Link>
                  <Link href="/destinations/antalya" className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">Antalya</Link>
                  <Link href="/destinations/cappadocia" className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">Kapadokya</Link>
                  <Link href="/destinations/bodrum" className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">Bodrum</Link>
                  <Link href="/destinations" className="block p-2 text-blue-600 font-medium">Tüm destinasyonlar</Link>
                </div>
              )}
            </div>
            
            <div className="border-b border-gray-100 pb-3">
              <button className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => toggleDropdown('hotels-mobile')}>
                <span className="font-medium">Oteller</span>
                <svg className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === 'hotels-mobile' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
              
              {activeDropdown === 'hotels-mobile' && (
                <div className="mt-2 pl-4 space-y-2">
                  <Link href="/hotels/luxury" className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">Lüks Oteller</Link>
                  <Link href="/hotels/boutique" className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">Butik Oteller</Link>
                  <Link href="/hotels/all-inclusive" className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">Her Şey Dahil</Link>
                  <Link href="/hotels" className="block p-2 text-blue-600 font-medium">Tüm oteller</Link>
                </div>
              )}
            </div>
            
            <div className="border-b border-gray-100 pb-3">
              <button className="w-full flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => toggleDropdown('activities-mobile')}>
                <span className="font-medium">Aktiviteler</span>
                <svg className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === 'activities-mobile' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
              
              {activeDropdown === 'activities-mobile' && (
                <div className="mt-2 pl-4 space-y-2">
                  <Link href="/activities/tours" className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">Turlar</Link>
                  <Link href="/activities/adventures" className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">Macera Aktiviteleri</Link>
                  <Link href="/activities/cultural" className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">Kültürel Deneyimler</Link>
                  <Link href="/activities" className="block p-2 text-blue-600 font-medium">Tüm aktiviteler</Link>
                </div>
              )}
            </div>
            
            <div className="border-b border-gray-100 pb-3">
              <button 
                onClick={() => {
                  setDealsOpen(true);
                  setIsMenuOpen(false); // Close mobile menu
                }} 
                className="flex w-full justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="font-medium">Fırsatlar</span>
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                    Yeni
                  </span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col space-y-2 pt-2">
              <Link href="/login" className="w-full py-2.5 px-4 rounded-lg border border-blue-600 text-blue-600 font-medium text-sm text-center hover:bg-blue-50 transition-colors">
                Giriş Yap
              </Link>
              <Link href="/register" className="w-full py-2.5 px-4 rounded-lg bg-blue-600 text-white font-medium text-sm text-center hover:bg-blue-700 transition-colors">
                Kaydol
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Deals Popup */}
      <DealsPopup 
        isOpen={dealsOpen} 
        onClose={() => setDealsOpen(false)} 
      />
    </header>
  );
} 