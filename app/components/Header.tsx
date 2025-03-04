"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white shadow-md py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-10 w-10 mr-2 overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0 bg-blue-700 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                <span className="transform transition-transform duration-300 group-hover:scale-110">T</span>
              </div>
            </div>
            <span className={`text-2xl font-bold ${
              isScrolled ? "text-blue-700" : "text-white"
            } ${
              isScrolled ? "" : "hidden md:inline-block"
            } transition-all duration-300`}>
              TourTech
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
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

            {/* Fırsatlar butonu */}
            <Link 
              href="/firsatlar" 
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
            </Link>
          </nav>

          {/* Desktop Search and Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search Button */}
            <button 
              onClick={toggleSearch}
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-white hover:bg-white/10"
              }`}
              aria-label="Ara"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
            
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
          <div className="md:hidden flex items-center space-x-2">
            {/* Search Button - Mobile */}
            <button 
              onClick={toggleSearch}
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-white hover:bg-white/10"
              }`}
              aria-label="Ara"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
            
            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md transition-colors ${
                isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-white hover:bg-white/10"
              }`}
              aria-label="Ana Menü"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 animate-fadeIn">
          <div className="container mx-auto max-w-3xl">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Otel, tur veya deneyim arayın..."
                className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <button 
                onClick={toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md animate-fadeIn">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-1">
              <div className="border-b border-gray-100 pb-2 mb-2">
                <button 
                  onClick={() => toggleDropdown('mobile-hotels')}
                  className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <span className="font-medium">Oteller</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                    className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'mobile-hotels' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                
                {activeDropdown === 'mobile-hotels' && (
                  <div className="mt-1 pl-4 border-l-2 border-gray-100 ml-4">
                    <Link href="/hotel" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Tüm Oteller
                    </Link>
                    <Link href="/hotel?type=BOUTIQUE_HOTEL" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Butik Oteller
                    </Link>
                    <Link href="/hotel?type=RESORT" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Tatil Köyleri
                    </Link>
                    <Link href="/hotel?stars=5" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      5 Yıldızlı Oteller
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="border-b border-gray-100 pb-2 mb-2">
                <button 
                  onClick={() => toggleDropdown('mobile-tours')}
                  className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <span className="font-medium">Turlar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                    className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'mobile-tours' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                
                {activeDropdown === 'mobile-tours' && (
                  <div className="mt-1 pl-4 border-l-2 border-gray-100 ml-4">
                    <Link href="/tour-operator" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Tüm Turlar
                    </Link>
                    <Link href="/tour-operator?duration=1" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Günübirlik Turlar
                    </Link>
                    <Link href="/tour-operator?duration=7" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Haftalık Turlar
                    </Link>
                    <Link href="/tour-operator?featured=true" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Öne Çıkan Turlar
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="border-b border-gray-100 pb-2 mb-2">
                <button 
                  onClick={() => toggleDropdown('mobile-experiences')}
                  className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <span className="font-medium">Deneyimler</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                    className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'mobile-experiences' ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                
                {activeDropdown === 'mobile-experiences' && (
                  <div className="mt-1 pl-4 border-l-2 border-gray-100 ml-4">
                    <Link href="/experience" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Tüm Deneyimler
                    </Link>
                    <Link href="/experience?category=Gastronomi" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Gastronomi
                    </Link>
                    <Link href="/experience?category=Kültür" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Kültür Turları
                    </Link>
                    <Link href="/experience?category=Macera" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md">
                      Macera Aktiviteleri
                    </Link>
                  </div>
                )}
              </div>
              
              <Link href="/about" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">
                Hakkımızda
              </Link>
              
              <Link href="/contact" className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium">
                İletişim
              </Link>
              
              <div className="pt-2 mt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                <Link href="/auth/login" className="px-4 py-2 text-center text-blue-700 border border-blue-700 rounded-md text-sm font-medium hover:bg-blue-50">
                  Giriş Yap
                </Link>
                <Link href="/auth/register" className="px-4 py-2 text-center bg-blue-700 text-white rounded-md text-sm font-medium hover:bg-blue-800">
                  Kaydol
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 