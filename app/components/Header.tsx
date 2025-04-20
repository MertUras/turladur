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
  const [searchOpen, setSearchOpen] = useState(false);
  const [dealsOpen, setDealsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Client-side kontrolü için mounted state'i
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Scroll listener to update isScrolled state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    // Set initial state based on current scroll position
    handleScroll();
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

  // Mobil menüdeki dropdown tıklaması için mantığı düzenliyorum
  const toggleDropdown = useCallback((dropdown: string) => {
    setActiveDropdown(prev => (prev === dropdown ? null : dropdown));
    setSearchOpen(false);
  }, []);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  // Dışarı tıklandığında dropdown'ları kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Mobil menü dışına tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && !(event.target as Element).closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Arama dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchOpen && searchRef.current && !searchRef.current.contains(event.target as Node) && !(event.target as Element).closest('.search-button')) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  // Fırsatlar popup'ını açmak için güçlendirilmiş fonksiyon
  const openDealsPopup = useCallback(() => {
    if (mounted) {
      setDealsOpen(true);
      setIsMenuOpen(false);
      setActiveDropdown(null);
    }
  }, [mounted]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
    setActiveDropdown(null);
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-sm ${ 
        isScrolled 
          ? "bg-white/95 shadow-md py-2"
          : "bg-gradient-to-b from-black/60 to-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-9 w-9 mr-2">
              <Image
                src="/images/logo.png"
                alt="TourTech Logo"
                width={36}
                height={36}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className={`text-2xl font-bold ${ 
              isScrolled ? "text-indigo-700" : "text-orange-500"
            } transition-colors duration-300`}>
              TourTech
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <div className="relative group dropdown-container">
              <button 
                onClick={() => toggleDropdown('tours')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${ 
                  isScrolled 
                    ? "text-gray-700 hover:text-indigo-700 hover:bg-indigo-50" 
                    : "text-white hover:text-orange-300 hover:bg-white/10" 
                }`}
              >
                Turlar
                <ChevronDownIcon 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === 'tours' ? 'rotate-180' : ''}`}
                />
              </button>
              
              {activeDropdown === 'tours' && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 p-2 z-50 animate-fadeIn">
                  <Link href="/tours" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                    Tüm Turlar
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/tour-operator" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                    Tur Operatörleri
                  </Link>
                  <Link href="/tours?duration=1" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                    Günübirlik Turlar
                  </Link>
                  <Link href="/tours?duration=7" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                    Haftalık Turlar
                  </Link>
                  <Link href="/tours?featured=true" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                    Öne Çıkan Turlar
                  </Link>
                </div>
              )}
            </div>

            <div className="relative group dropdown-container">
              <button 
                onClick={() => toggleDropdown('activities')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${ 
                  isScrolled 
                    ? "text-gray-700 hover:text-indigo-700 hover:bg-indigo-50" 
                    : "text-white hover:text-orange-300 hover:bg-white/10" 
                }`}
              >
                Aktiviteler
                <ChevronDownIcon 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === 'activities' ? 'rotate-180' : ''}`}
                />
              </button>
              
              {activeDropdown === 'activities' && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 p-2 z-50 animate-fadeIn">
                  <Link href="/activities" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                    Tüm Aktiviteler
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/gastronomi" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                    Gastronomi
                  </Link>
                  <Link href="/kultur-turlari" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                    Kültür Turları
                  </Link>
                  <Link href="/macera-aktiviteleri" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                    Macera Aktiviteleri
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/about" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${ 
                isScrolled 
                  ? "text-gray-700 hover:text-indigo-700 hover:bg-indigo-50" 
                  : "text-white hover:text-orange-300 hover:bg-white/10" 
              }`}
            >
              Hakkımızda
            </Link>
            
            <Link 
              href="/contact" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${ 
                isScrolled 
                  ? "text-gray-700 hover:text-indigo-700 hover:bg-indigo-50" 
                  : "text-white hover:text-orange-300 hover:bg-white/10" 
              }`}
            >
              İletişim
            </Link>

            <button 
              onClick={openDealsPopup}
              className={`ml-2 flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-[1.03] ${ 
                isScrolled 
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" 
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow" 
              }`}
            >
              <TagIcon className="w-4 h-4 mr-1.5" />
              Fırsatlar
            </button>

            <button 
              onClick={toggleSearch} 
              className={`search-button ml-1 p-2 rounded-full transition-colors duration-300 ${ 
                isScrolled 
                  ? "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50" 
                  : "text-gray-300 hover:text-white hover:bg-white/10" 
              }`}
              aria-label="Aramayı aç"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </nav>

          {/* Desktop Auth Area */}
          <div className="hidden lg:flex items-center space-x-2">
            {status === "loading" ? (
              <div className="flex space-x-2">
                 <div className={`h-8 w-20 rounded-md animate-pulse ${isScrolled ? 'bg-gray-200' : 'bg-white/20'}`}></div>
                 <div className={`h-8 w-20 rounded-md animate-pulse ${isScrolled ? 'bg-gray-200' : 'bg-white/20'}`}></div>
              </div>
            ) : status === "authenticated" ? (
              <div className="relative group dropdown-container">
                <button 
                  className={`flex items-center space-x-2 p-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${ 
                    isScrolled 
                      ? "text-gray-600 hover:bg-gray-100" 
                      : "text-gray-200 hover:bg-white/10" 
                  }`}
                  onClick={() => toggleDropdown('profile')}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profil"}
                      width={28} 
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <span className={`flex items-center justify-center h-7 w-7 rounded-full text-xs ${ 
                      isScrolled ? "bg-gray-200 text-gray-600" : "bg-white/20 text-white" 
                    }`}>
                      {(session.user?.name?.[0] || session.user?.email?.[0] || "P").toUpperCase()}
                    </span>
                  )}
                  <span className="hidden xl:block text-xs mr-1">{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDownIcon className={`w-4 h-4 ${isScrolled ? 'text-gray-500' : 'text-gray-300'} transition-transform duration-200 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'profile' && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 p-2 z-50 animate-fadeIn dropdown-container">
                    <Link href="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                      Profilim
                    </Link>
                    <Link href="/bookings" className="block px-3 py-2 text-sm text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors duration-200">
                      Rezervasyonlarım
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
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
                  className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors duration-300 ${ 
                    isScrolled 
                      ? "text-indigo-600 border-indigo-600 hover:bg-indigo-50" 
                      : "text-white border-white hover:bg-white/10" 
                  }`}
                >
                  Giriş Yap
                </Link>
                <Link 
                  href="/register" 
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-[1.03] ${ 
                    isScrolled 
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" 
                      : "bg-orange-500 text-white hover:bg-orange-600 shadow" 
                  }`}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-1">
            <button 
              onClick={toggleSearch} 
              className={`search-button p-2 rounded-full transition-colors duration-300 ${ 
                isScrolled 
                  ? "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50" 
                  : "text-gray-300 hover:text-white hover:bg-white/10" 
              }`}
              aria-label="Aramayı aç"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`mobile-menu-button p-2 rounded-md transition-colors duration-300 ${ 
                isScrolled 
                  ? "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50" 
                  : "text-gray-300 hover:text-white hover:bg-white/10" 
              }`}
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setSearchOpen(false)}
          ></div>
          
          <div 
            ref={searchRef}
            className="relative max-w-xl mx-auto mt-16 bg-white rounded-lg shadow-xl p-4 animate-fadeIn"
          >
            <div className="flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Tur, aktivite veya bölge ara..."
                className="flex-1 px-4 py-2.5 text-gray-900 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-transparent focus:border-indigo-500"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="ml-2 p-2 text-gray-400 hover:text-gray-600"
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setIsMenuOpen(false)}
          ></div>
          
          <div 
            ref={mobileMenuRef}
            className="relative w-full max-w-sm ml-auto h-screen bg-white shadow-xl flex flex-col animate-slide-in-right z-10 overflow-y-auto"
          >
            {/* Mobile Menu Header */}
            <div className="sticky top-0 flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white z-20">
              <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <div className="relative h-7 w-7 mr-2">
                  <Image src="/images/logo.png" alt="TourTech Logo" width={28} height={28} />
                </div>
                <span className="text-xl font-bold text-indigo-700">TourTech</span>
              </Link>
              <button
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* Mobile Menu Content */}
            <div className="flex-1 py-3 px-3">
              {status === "loading" ? (
                 <div className="p-3 space-y-4">
                   <div className="h-12 bg-gray-200 animate-pulse rounded-md"></div>
                   <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                   <div className="h-10 bg-gray-200 animate-pulse rounded-md"></div>
                 </div>
              ) : status === "authenticated" ? (
                <Link href="/profile" className="flex items-center space-x-3 p-3 mb-3 rounded-lg hover:bg-indigo-50 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profil"}
                      width={36} 
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="flex items-center justify-center h-9 w-9 rounded-full bg-indigo-100 text-indigo-600 text-sm">
                      {(session.user?.name?.[0] || session.user?.email?.[0] || "P").toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="font-medium text-sm text-gray-900">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">Profili Görüntüle</p>
                  </div>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Link
                    href="/login"
                    className="px-4 py-2.5 rounded-md text-sm font-medium text-center border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2.5 rounded-md text-sm font-medium text-center bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}

              <div className="space-y-1 border-t border-gray-100 pt-3">
                <div className="dropdown-container">
                  <button 
                    className={`w-full flex justify-between items-center py-2.5 px-3 rounded-lg text-left ${activeDropdown === 'tours-mobile' ? 'bg-indigo-50' : ''} text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors`}
                    onClick={() => toggleDropdown('tours-mobile')}
                  >
                    <span className="font-medium text-sm">Turlar</span>
                    <ChevronDownIcon 
                      className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'tours-mobile' ? 'rotate-180 text-indigo-700' : 'text-gray-400'}`}
                    />
                  </button>
                  <div 
                    className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${activeDropdown === 'tours-mobile' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="py-1 pl-6 space-y-1">
                      <Link href="/tours" className="block py-2 px-2 text-sm text-gray-600 hover:text-indigo-700 rounded-md hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Tüm Turlar</Link>
                      <Link href="/tour-operator" className="block py-2 px-2 text-sm text-gray-600 hover:text-indigo-700 rounded-md hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Tur Operatörleri</Link>
                      <Link href="/tours?duration=1" className="block py-2 px-2 text-sm text-gray-600 hover:text-indigo-700 rounded-md hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Günübirlik</Link>
                      <Link href="/tours?duration=7" className="block py-2 px-2 text-sm text-gray-600 hover:text-indigo-700 rounded-md hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Haftalık</Link>
                      <Link href="/tours?featured=true" className="block py-2 px-2 text-sm text-gray-600 hover:text-indigo-700 rounded-md hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Öne Çıkan</Link>
                    </div>
                  </div>
                </div>

                <div className="dropdown-container">
                  <button 
                    className={`w-full flex justify-between items-center py-2.5 px-3 rounded-lg text-left ${activeDropdown === 'activities-mobile' ? 'bg-indigo-50' : ''} text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors`}
                    onClick={() => toggleDropdown('activities-mobile')}
                  >
                    <span className="font-medium text-sm">Aktiviteler</span>
                    <ChevronDownIcon 
                      className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'activities-mobile' ? 'rotate-180 text-indigo-700' : 'text-gray-400'}`}
                    />
                  </button>
                  <div 
                    className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${activeDropdown === 'activities-mobile' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="py-1 pl-6 space-y-1">
                      <Link href="/activities" className="block py-2 px-2 text-sm text-gray-600 hover:text-indigo-700 rounded-md hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Tüm Aktiviteler</Link>
                      <Link href="/gastronomi" className="block py-2 px-2 text-sm text-gray-600 hover:text-indigo-700 rounded-md hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Gastronomi</Link>
                      <Link href="/kultur-turlari" className="block py-2 px-2 text-sm text-gray-600 hover:text-indigo-700 rounded-md hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Kültür Turları</Link>
                      <Link href="/macera-aktiviteleri" className="block py-2 px-2 text-sm text-gray-600 hover:text-indigo-700 rounded-md hover:bg-indigo-50" onClick={() => setIsMenuOpen(false)}>Macera</Link>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/about" 
                  className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hakkımızda
                </Link>
                <Link 
                  href="/contact" 
                  className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  İletişim
                </Link>
                <button 
                  onClick={() => { openDealsPopup(); setIsMenuOpen(false); }}
                  className="w-full text-left flex items-center py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors"
                >
                  <TagIcon className="w-4 h-4 mr-2" />
                  Fırsatlar
                </button>
              </div>
            </div>

            {/* Mobile Footer Buttons (Authenticated) */}
            {status === "authenticated" && (
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3">
                <button
                  onClick={handleSignOut}
                  className="w-full text-center px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {mounted && <DealsPopup isOpen={dealsOpen} onClose={() => setDealsOpen(false)} />}
    </header>
  );
}