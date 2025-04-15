"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DealsPopup from "./DealsPopup";
import { TagIcon, UserIcon, UserPlusIcon, XMarkIcon, ChevronDownIcon, MapIcon, BuildingOfficeIcon, GlobeAltIcon, SparklesIcon, InformationCircleIcon, EnvelopeIcon, Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closingDropdown, setClosingDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dealsOpen, setDealsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session, status } = useSession();

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
    setClosingDropdown(null);
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

  // Mobil menüdeki dropdown tıklaması için mantığı düzenliyorum
  const toggleDropdown = useCallback((dropdown: string, isMobile: boolean = false) => {
    if (isMobile) {
      // Mobil için mantık - kapanma sorununu çözüyoruz
      if (dropdown === activeDropdown) {
        // Aynı dropdown'a tekrar tıklandığında kapat
        setActiveDropdown(null);
      } else {
        // Farklı dropdown'a tıklandığında, önceki kapanır ve yeni açılır
        setActiveDropdown(dropdown);
      }
    } else {
      // Desktop için mevcut mantık
      if (dropdown === activeDropdown) {
        setActiveDropdown(null);
      } else {
        setActiveDropdown(dropdown);
      }
    }

    // Dropdown işlemi yapıldığında aramaları kapat
    setSearchOpen(false);
  }, [activeDropdown]);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  // Dışarı tıklandığında dropdown'ları kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Desktop ve mobil dropdown'lar için dışarı tıklama kontrolü
      if (activeDropdown) {
        // Eğer tıklanan element dropdown container'ın içinde değilse ve bir link değilse kapat
        if (!(event.target as Element).closest('.dropdown-container') && 
            !(event.target as Element).closest('a')) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  // Mobil menü dışına tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.mobile-menu-button') &&
          !(event.target as Element).closest('a')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Arama dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchOpen && searchRef.current && 
          !searchRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.search-button')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-sm ${
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
          <nav className="hidden lg:flex items-center space-x-1">
            <div className="relative group">
              <button 
                className={`px-3 py-2 rounded-md font-medium text-sm flex items-center ${
                  isScrolled 
                    ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                } transition-all duration-300`}
                onClick={() => toggleDropdown('routes')}
              >
                Rotalar
                <ChevronDownIcon className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'routes' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'routes' && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-gray-200 p-2 z-50 animate-fadeIn">
                  <Link href="/routes" className="block px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                    Tüm Rotalar
                  </Link>
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <Link href="/routes/1" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      İstanbul - Kapadokya
                    </Link>
                    <Link href="/routes/2" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Akdeniz Kıyıları
                    </Link>
                    <Link href="/routes/3" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Ege Kıyıları
                    </Link>
                    <Link href="/routes/4" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Kapadokya - Pamukkale
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative group dropdown-container">
              <button 
                onClick={() => toggleDropdown('hotels')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isScrolled 
                    ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                } flex items-center`}
              >
                Oteller
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === 'hotels' ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {activeDropdown === 'hotels' && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-gray-200 p-2 z-50 animate-fadeIn">
                  <Link href="/hotel" className="block px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                    Tüm Oteller
                  </Link>
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <Link href="/hotel?type=BOUTIQUE_HOTEL" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Butik Oteller
                    </Link>
                    <Link href="/hotel?type=RESORT" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Tatil Köyleri
                    </Link>
                    <Link href="/hotel?stars=5" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      5 Yıldızlı Oteller
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative group dropdown-container">
              <button 
                onClick={() => toggleDropdown('tours')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isScrolled 
                    ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                } flex items-center`}
              >
                Turlar
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === 'tours' ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {activeDropdown === 'tours' && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-gray-200 p-2 z-50 animate-fadeIn">
                  <Link href="/tours" className="block px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                    Tüm Turlar
                  </Link>
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <Link href="/tour-operator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Tur Operatörleri
                    </Link>
                    <Link href="/tours?duration=1" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Günübirlik Turlar
                    </Link>
                    <Link href="/tours?duration=7" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Haftalık Turlar
                    </Link>
                    <Link href="/tours?featured=true" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Öne Çıkan Turlar
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative group dropdown-container">
              <button 
                onClick={() => toggleDropdown('experiences')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  isScrolled 
                    ? "text-blue-600 hover:text-blue-800 hover:bg-blue-50" 
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                } flex items-center`}
              >
                Deneyimler
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === 'experiences' ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {activeDropdown === 'experiences' && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-gray-200 p-2 z-50 animate-fadeIn">
                  <Link href="/experience" className="block px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                    Tüm Deneyimler
                  </Link>
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <Link href="/gastronomi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Gastronomi
                    </Link>
                    <Link href="/kultur-turlari" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Kültür Turları
                    </Link>
                    <Link href="/macera-aktiviteleri" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Macera Aktiviteleri
                    </Link>
                  </div>
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
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </nav>

          {/* Desktop Search and Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            {status === "authenticated" ? (
              <div className="relative group">
                <button 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isScrolled 
                      ? "text-gray-700 hover:bg-gray-100" 
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => toggleDropdown('profile')}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profil"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {session.user?.name?.[0] || "U"}
                    </div>
                  )}
                  <span className="hidden md:block">{session.user?.name}</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'profile' && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white ring-1 ring-gray-200 p-2 z-50 animate-fadeIn dropdown-container">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Profilim
                    </Link>
                    <Link href="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      Rezervasyonlarım
                    </Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-300 ${
                    isScrolled 
                      ? "text-blue-700 border-blue-700 hover:bg-blue-50" 
                      : "text-white border-white hover:bg-white/10"
                  }`}
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/register" 
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    isScrolled 
                      ? "bg-blue-700 text-white hover:bg-blue-800" 
                      : "bg-white text-blue-700 hover:bg-gray-100"
                  }`}
                >
                  Kaydol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button 
              onClick={toggleSearch} 
              className={`p-2 rounded-full ${
                isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              } transition-colors`}
              aria-label="Aramayı aç"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 rounded-md ${
                isScrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              } transition-colors`}
              aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={() => setSearchOpen(false)}
          ></div>
          
          <div 
            ref={searchRef}
            className="relative max-w-2xl mx-auto mt-20 bg-white rounded-lg shadow-xl p-4 animate-fadeIn"
          >
            <div className="flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ara..."
                className="flex-1 px-4 py-2 text-gray-900 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="ml-2 p-2 text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          <div 
            ref={mobileMenuRef}
            className="relative w-full max-w-xs ml-auto h-screen bg-white shadow-xl flex flex-col animate-slide-in-right z-10 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white z-20">
              <Link href="/" className="flex items-center">
                <div className="relative h-8 w-8 mr-2 overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">T</div>
                </div>
                <span className="text-xl font-bold text-blue-700">TourTech</span>
              </Link>
              <button
                className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* Menu Items */}
            <div className="flex-1 py-2 px-3">
              {status === "authenticated" && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profil"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {session.user?.name?.[0] || "U"}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{session.user?.name}</p>
                    <p className="text-sm text-gray-500">{session.user?.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {/* Rotalar Dropdown */}
                <div className="py-2 dropdown-container">
                  <button 
                    className={`w-full flex justify-between items-center py-3 px-3 rounded-lg ${activeDropdown === 'routes-mobile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => toggleDropdown('routes-mobile', true)}
                  >
                    <div className="flex items-center">
                      <MapIcon className="w-5 h-5 mr-3" />
                      <span className="font-medium">Rotalar</span>
                    </div>
                    <ChevronDownIcon 
                      className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === 'routes-mobile' ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`mt-1 overflow-hidden mobile-menu-dropdown ${activeDropdown === 'routes-mobile' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="py-2 px-4 pl-11 space-y-2 bg-gray-50 rounded-lg">
                      <Link href="/routes" className="block py-2 text-gray-600 hover:text-blue-700">
                        Tüm Rotalar
                      </Link>
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <Link href="/routes/1" className="block py-2 text-gray-600 hover:text-blue-700">
                          İstanbul - Kapadokya
                        </Link>
                        <Link href="/routes/2" className="block py-2 text-gray-600 hover:text-blue-700">
                          Akdeniz Kıyıları
                        </Link>
                        <Link href="/routes/3" className="block py-2 text-gray-600 hover:text-blue-700">
                          Ege Kıyıları
                        </Link>
                        <Link href="/routes/4" className="block py-2 text-gray-600 hover:text-blue-700">
                          Kapadokya - Pamukkale
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Oteller Dropdown */}
                <div className="py-2 dropdown-container">
                  <button 
                    className={`w-full flex justify-between items-center py-3 px-3 rounded-lg ${activeDropdown === 'hotels-mobile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => toggleDropdown('hotels-mobile', true)}
                  >
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="w-5 h-5 mr-3" />
                      <span className="font-medium">Oteller</span>
                    </div>
                    <ChevronDownIcon 
                      className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === 'hotels-mobile' ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`mt-1 overflow-hidden mobile-menu-dropdown ${activeDropdown === 'hotels-mobile' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="py-2 px-4 pl-11 space-y-2 bg-gray-50 rounded-lg">
                      <Link href="/hotel" className="block py-2 text-gray-600 hover:text-blue-700">
                        Tüm Oteller
                      </Link>
                      <Link href="/hotel?type=BOUTIQUE_HOTEL" className="block py-2 text-gray-600 hover:text-blue-700">
                        Butik Oteller
                      </Link>
                      <Link href="/hotel?type=RESORT" className="block py-2 text-gray-600 hover:text-blue-700">
                        Tatil Köyleri
                      </Link>
                      <Link href="/hotel?stars=5" className="block py-2 text-gray-600 hover:text-blue-700">
                        5 Yıldızlı Oteller
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Turlar Dropdown */}
                <div className="py-2 dropdown-container">
                  <button 
                    className={`w-full flex justify-between items-center py-3 px-3 rounded-lg ${activeDropdown === 'tours-mobile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => toggleDropdown('tours-mobile', true)}
                  >
                    <div className="flex items-center">
                      <GlobeAltIcon className="w-5 h-5 mr-3" />
                      <span className="font-medium">Turlar</span>
                    </div>
                    <ChevronDownIcon 
                      className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === 'tours-mobile' ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`mt-1 overflow-hidden mobile-menu-dropdown ${activeDropdown === 'tours-mobile' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="py-2 px-4 pl-11 space-y-2 bg-gray-50 rounded-lg">
                      <Link href="/tours" className="block py-2 text-gray-600 hover:text-blue-700">
                        Tüm Turlar
                      </Link>
                      <Link href="/tour-operator" className="block py-2 text-gray-600 hover:text-blue-700">
                        Tur Operatörleri
                      </Link>
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <Link href="/tours?duration=1" className="block py-2 text-gray-600 hover:text-blue-700">
                          Günübirlik Turlar
                        </Link>
                        <Link href="/tours?duration=7" className="block py-2 text-gray-600 hover:text-blue-700">
                          Haftalık Turlar
                        </Link>
                        <Link href="/tours?featured=true" className="block py-2 text-gray-600 hover:text-blue-700">
                          Öne Çıkan Turlar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Deneyimler Dropdown */}
                <div className="py-2 dropdown-container">
                  <button 
                    className={`w-full flex justify-between items-center py-3 px-3 rounded-lg ${activeDropdown === 'experiences-mobile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => toggleDropdown('experiences-mobile', true)}
                  >
                    <div className="flex items-center">
                      <SparklesIcon className="w-5 h-5 mr-3" />
                      <span className="font-medium">Deneyimler</span>
                    </div>
                    <ChevronDownIcon 
                      className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === 'experiences-mobile' ? 'transform rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <div 
                    className={`mt-1 overflow-hidden mobile-menu-dropdown ${activeDropdown === 'experiences-mobile' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="py-2 px-4 pl-11 space-y-2 bg-gray-50 rounded-lg">
                      <Link href="/experience" className="block py-2 text-gray-600 hover:text-blue-700">
                        Tüm Deneyimler
                      </Link>
                      <Link href="/gastronomi" className="block py-2 text-gray-600 hover:text-blue-700">
                        Gastronomi
                      </Link>
                      <Link href="/kultur-turlari" className="block py-2 text-gray-600 hover:text-blue-700">
                        Kültür Turları
                      </Link>
                      <Link href="/macera-aktiviteleri" className="block py-2 text-gray-600 hover:text-blue-700">
                        Macera Aktiviteleri
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Diğer Linkler */}
                <div className="mt-2 border-t border-gray-100 pt-4">
                  <Link 
                    href="/about" 
                    className="flex items-center py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <InformationCircleIcon className="w-5 h-5 mr-3" />
                    <span className="font-medium">Hakkımızda</span>
                  </Link>
                  
                  <Link 
                    href="/contact" 
                    className="flex items-center py-3 px-3 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <EnvelopeIcon className="w-5 h-5 mr-3" />
                    <span className="font-medium">İletişim</span>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-100 py-4 px-4">
              {status === "authenticated" ? (
                <div className="space-y-3">
                  <Link 
                    href="/profile"
                    className="block w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-lg transition-colors text-center"
                  >
                    Profilim
                  </Link>
                  
                  <Link 
                    href="/bookings"
                    className="block w-full py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-lg transition-colors text-center"
                  >
                    Rezervasyonlarım
                  </Link>
                  
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setActiveDropdown(null);
                    }}
                    className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-center"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link 
                    href="/login"
                    className="flex-1 py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-lg transition-colors text-center"
                  >
                    Giriş Yap
                  </Link>
                  
                  <Link 
                    href="/register"
                    className="flex-1 py-2.5 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors text-center"
                  >
                    Üye Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
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