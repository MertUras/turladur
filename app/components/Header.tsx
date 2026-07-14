"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import DealsPopup from "./DealsPopup";
import { TagIcon, UserIcon, /* UserPlusIcon, */ XMarkIcon, ChevronDownIcon, /* MapIcon, */ BuildingOfficeIcon, /* GlobeAltIcon, */ /* SparklesIcon, */ /* InformationCircleIcon, */ /* EnvelopeIcon, */ Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
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
      setIsScrolled(window.scrollY > 20); // Daha erken tetiklensin
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Başlangıç durumu
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

  const openDealsPopup = useCallback(() => {
    if (mounted) {
      setDealsOpen(true);
      setIsMenuOpen(false);
      setActiveDropdown(null);
    }
  }, [mounted]);

  const handleSignOut = () => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
    // Hard navigation after signOut — client redirect to the same URL (e.g. '/') leaves session stuck in "loading".
    void signOut({ redirect: false }).then(() => {
      window.location.href = '/';
    });
  };

  const handleAuthClick = (e: React.MouseEvent) => {
    if (session?.user?.provider === 'partner-credentials') {
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href') || '/';
      e.preventDefault();
      void signOut({ redirect: false }).then(() => {
        window.location.href = href;
      });
    }
  };

  const handlePartnerPortalClick = () => {
    if (session?.user?.provider === 'partner-credentials') {
      window.location.href = '/partner-dashboard';
    } else {
      window.location.href = '/partner-login';
    }
  };

  // Hangi sayfalarda başlangıçta açık renk header kullanılacağını belirle
  const lightBackgroundRoutes = ['/about', '/contact', '/profile', '/bookings', '/login', '/register', '/partner-login', '/partner-register'];
  const forceScrolledAppearance =
    lightBackgroundRoutes.includes(pathname) || pathname.startsWith('/checkout');

  // Dinamik stiller için değişkenler
  const shouldAppearScrolled = isScrolled || forceScrolledAppearance;

  const headerBg = shouldAppearScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent";
  const headerPadding = shouldAppearScrolled ? "py-2" : "py-4";
  const logoColor = shouldAppearScrolled ? "text-sky-700" : "text-white";
  const linkColor = shouldAppearScrolled ? "text-neutral-700" : "text-white";
  const linkHoverColor = shouldAppearScrolled ? "hover:text-sky-600" : "hover:text-neutral-200";
  const linkBgHoverColor = shouldAppearScrolled ? "hover:bg-sky-50/70" : "hover:bg-white/10";
  const iconColor = shouldAppearScrolled ? "text-neutral-500" : "text-neutral-300";
  const iconHoverColor = shouldAppearScrolled ? "hover:text-sky-600" : "hover:text-white";
  const iconBgHoverColor = shouldAppearScrolled ? "hover:bg-sky-50/70" : "hover:bg-white/10";
  const buttonPrimaryBg = shouldAppearScrolled ? "bg-sky-600 hover:bg-sky-700" : "bg-white hover:bg-neutral-100";
  const buttonPrimaryText = shouldAppearScrolled ? "text-white" : "text-sky-700";
  const buttonSecondaryBorder = shouldAppearScrolled ? "border-sky-600 text-sky-600 hover:bg-sky-50/70" : "border-white text-white hover:bg-white/10";
  const authButtonBgHover = shouldAppearScrolled ? "hover:bg-neutral-100" : "hover:bg-white/10";
  const authImageBg = shouldAppearScrolled ? "bg-neutral-200 text-neutral-600" : "bg-white/20 text-white";
  const authChevronColor = shouldAppearScrolled ? "text-neutral-500" : "text-neutral-300";
  const pulseBg = shouldAppearScrolled ? 'bg-neutral-200' : 'bg-white/20';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerBg} ${headerPadding}`}
    >
      <div className="container mx-auto px-6"> {/* Padding px-6 olarak güncellendi */}
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            {/* Ana Logo */}
            <Link href="/" className="flex items-center group flex-shrink-0">
              <div className="relative h-8 w-8 mr-2">
                <Image
                  src="/images/logo.png"
                  alt="TourTech Logo"
                  width={32}
                  height={32}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className={`text-xl font-semibold ${logoColor} transition-colors duration-300 tracking-tight`}>
                Turladur
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Turlar Dropdown */} 
            <div className="relative group dropdown-container">
              <button
                onClick={() => toggleDropdown('tours')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${linkColor} ${linkHoverColor} ${linkBgHoverColor}`}
              >
                Turlar
                <ChevronDownIcon
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === 'tours' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeDropdown === 'tours' && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1.5 z-50 animate-fadeIn">
                  {/* Dropdown link stilleri */}
                  <Link href="/tours" className="block px-3 py-1.5 text-sm text-neutral-700 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors duration-150">Tüm Turlar</Link>
                  <div className="border-t border-neutral-100 my-1"></div>
                  <Link href="/tour-operator" className="block px-3 py-1.5 text-sm text-neutral-700 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors duration-150">Tur Operatörleri</Link>
                  <Link href="/tours?duration=1" className="block px-3 py-1.5 text-sm text-neutral-700 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors duration-150">Günübirlik Turlar</Link>
                  <Link href="/tours?duration=7" className="block px-3 py-1.5 text-sm text-neutral-700 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors duration-150">Haftalık Turlar</Link>
                </div>
              )}
            </div>

            {/* Aktiviteler Dropdown */} 
            <div className="relative group dropdown-container">
              <button
                onClick={() => toggleDropdown('activities')}
                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${linkColor} ${linkHoverColor} ${linkBgHoverColor}`}
              >
                Aktiviteler
                <ChevronDownIcon
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDropdown === 'activities' ? 'rotate-180' : ''}`}
                />
              </button>
              {activeDropdown === 'activities' && (
                <div className="absolute left-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1.5 z-50 animate-fadeIn">
                  <Link href="/activities" className="block px-3 py-1.5 text-sm text-neutral-700 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors duration-150">Tüm Aktiviteler</Link>
                  <div className="border-t border-neutral-100 my-1"></div>
                  <Link href="/gastronomi" className="block px-3 py-1.5 text-sm text-neutral-700 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors duration-150">Gastronomi</Link>
                  <Link href="/kultur-turlari" className="block px-3 py-1.5 text-sm text-neutral-700 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors duration-150">Kültür Turları</Link>
                  <Link href="/macera-aktiviteleri" className="block px-3 py-1.5 text-sm text-neutral-700 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors duration-150">Macera Aktiviteleri</Link>
                </div>
              )}
            </div>

            {/* Diğer Linkler */} 
            <Link
              href="/about"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${linkColor} ${linkHoverColor} ${linkBgHoverColor}`}
            >
              Hakkımızda
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${linkColor} ${linkHoverColor} ${linkBgHoverColor}`}
            >
              İletişim
            </Link>

            {/* Fırsatlar Butonu */} 
            <button
              onClick={openDealsPopup}
              className={`ml-2 flex items-center px-3.5 py-1.5 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-[1.03] shadow-sm ${buttonPrimaryBg} ${buttonPrimaryText}`}
            >
              <TagIcon className="w-4 h-4 mr-1.5" />
              Fırsatlar
            </button>

            {/* Arama Butonu */} 
            <button
              onClick={toggleSearch}
              className={`search-button ml-1 p-2 rounded-full transition-colors duration-200 ${iconColor} ${iconHoverColor} ${iconBgHoverColor}`}
              aria-label="Aramayı aç"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </nav>

          {/* Desktop Auth Area */} 
           <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            {status === "loading" ? (
               <div className="flex space-x-2">
                 <div className={`h-8 w-20 rounded-md animate-pulse ${pulseBg}`}></div>
                 <div className={`h-8 w-20 rounded-md animate-pulse ${pulseBg}`}></div>
              </div>
            ) : status === "authenticated" && session?.user?.provider !== 'partner-credentials' ? (
              <div className="relative group dropdown-container">
                <button
                   className={`flex items-center space-x-2 p-1 rounded-full text-sm font-medium transition-colors duration-200 ${linkColor} ${authButtonBgHover}`}
                  onClick={() => toggleDropdown('profile')}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profil"}
                      width={28}
                      height={28}
                      className="rounded-full border border-transparent group-hover:border-neutral-300/50 transition-colors"
                    />
                  ) : (
                     <span className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-medium ${authImageBg}`}>
                      {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                    </span>
                  )}
                   <span className="hidden xl:block text-xs mr-0.5">{session.user?.name?.split(' ')[0]}</span>
                   <ChevronDownIcon className={`w-4 h-4 ${authChevronColor} transition-transform duration-200 ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'profile' && (
                   <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1.5 z-50 animate-fadeIn dropdown-container">
                     {/* Profil dropdown link stilleri */}
                     <Link href="/profile" className="block px-3 py-1.5 text-sm text-neutral-700 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors duration-150">Profilim</Link>
                     <Link href="/bookings" className="block px-3 py-1.5 text-sm text-neutral-700 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors duration-150">Rezervasyonlarım</Link>
                     <div className="border-t border-neutral-100 my-1"></div>
                    <button
                      onClick={handleSignOut}
                       className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50/70 rounded transition-colors duration-150"
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
                   className={`px-3.5 py-1 rounded-md text-sm font-medium border transition-colors duration-200 ${buttonSecondaryBorder}`}
                  onClick={handleAuthClick}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                   className={`px-3.5 py-1 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-[1.03] shadow-sm ${buttonPrimaryBg} ${buttonPrimaryText}`}
                  onClick={handleAuthClick}
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
               className={`search-button p-2 rounded-full transition-colors duration-200 ${iconColor} ${iconHoverColor} ${iconBgHoverColor}`}
              aria-label="Aramayı aç"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
               className={`mobile-menu-button p-2 rounded-md transition-colors duration-200 ${iconColor} ${iconHoverColor} ${iconBgHoverColor}`}
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          ></div>
          <div
            ref={searchRef}
             className="relative max-w-lg mx-auto mt-[15vh] bg-white rounded-lg shadow-xl p-4 animate-fadeIn"
          >
            <div className="flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ne aramak istersiniz? (örn: Kapadokya turu)"
                 className="flex-1 px-4 py-2.5 text-neutral-800 bg-neutral-100 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 border border-transparent focus:bg-white placeholder-neutral-400 text-sm"
              />
              <button
                onClick={() => setSearchOpen(false)}
                 className="ml-2 p-2 text-neutral-400 hover:text-neutral-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            {/* İsteğe bağlı: Arama sonuçları veya öneriler burada gösterilebilir */}
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
             className="relative w-full max-w-xs ml-auto h-screen bg-white shadow-xl flex flex-col animate-slide-in-right z-10 overflow-y-auto"
          >
             {/* Mobile Menu Header */}
             <div className="sticky top-0 flex justify-between items-center px-4 py-3 border-b border-neutral-100 bg-white z-20">
               <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                 <div className="relative h-7 w-7 mr-1.5">
                  <Image src="/images/logo.png" alt="TourTech Logo" width={28} height={28} />
                </div>
                 <span className="text-lg font-semibold text-sky-700">Turladur</span>
              </Link>
              <button
                 className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

             {/* Mobile Menu Content */}
             <div className="flex-1 py-3 px-3">
              {status === "loading" ? (
                  <div className="p-3 space-y-4">
                    <div className="h-12 bg-neutral-200 animate-pulse rounded-md"></div>
                    <div className="h-10 bg-neutral-200 animate-pulse rounded-md"></div>
                    <div className="h-10 bg-neutral-200 animate-pulse rounded-md"></div>
                  </div>
              ) : status === "authenticated" && session?.user?.provider !== 'partner-credentials' ? (
                 <Link href="/profile" className="flex items-center space-x-3 p-3 mb-3 rounded-lg hover:bg-sky-50/70 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profil"}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                     <span className="flex items-center justify-center h-9 w-9 rounded-full bg-sky-100 text-sky-600 text-sm font-medium">
                      {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                    </span>
                  )}
                  <div>
                     <p className="font-medium text-sm text-neutral-800">{session.user?.name}</p>
                     <p className="text-xs text-neutral-500">Profili Görüntüle</p>
                  </div>
                </Link>
              ) : (
                 <div className="grid grid-cols-2 gap-2 mb-4 px-2 pt-1">
                  <Link
                    href="/login"
                     className="px-4 py-2 rounded-md text-sm font-medium text-center border border-sky-600 text-sky-600 hover:bg-sky-50/70 transition-colors"
                    onClick={(e) => {
                      handleAuthClick(e);
                      setIsMenuOpen(false);
                    }}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    href="/register"
                     className="px-4 py-2 rounded-md text-sm font-medium text-center bg-sky-600 text-white hover:bg-sky-700 transition-colors"
                    onClick={(e) => {
                      handleAuthClick(e);
                      setIsMenuOpen(false);
                    }}
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}

               <div className="space-y-1 border-t border-neutral-100 pt-3">
                 {/* Mobil Turlar Dropdown */}
                 <div className="dropdown-container">
                  <button
                     className={`w-full flex justify-between items-center py-2.5 px-3 rounded-md text-left ${activeDropdown === 'tours-mobile' ? 'bg-sky-50/70' : ''} text-neutral-700 hover:bg-sky-50/70 hover:text-sky-700 transition-colors`}
                    onClick={() => toggleDropdown('tours-mobile')}
                  >
                     <span className="font-medium text-sm">Turlar</span>
                    <ChevronDownIcon
                       className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'tours-mobile' ? 'rotate-180 text-sky-700' : 'text-neutral-400'}`}
                    />
                  </button>
                   <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${activeDropdown === 'tours-mobile' ? 'max-h-96' : 'max-h-0'}`}
                    style={{ maxHeight: activeDropdown === 'tours-mobile' ? '500px' : '0px'}} // Max-height transition
                  >
                     <div className="py-1 pl-6 mt-1 space-y-0.5 border-l border-neutral-200 ml-3">
                       {/* Mobil dropdown link stilleri */}
                       <Link href="/tours" className="block py-1.5 px-2 text-sm text-neutral-600 hover:text-sky-700 rounded-md hover:bg-sky-50/70" onClick={() => setIsMenuOpen(false)}>Tüm Turlar</Link>
                       <Link href="/tour-operator" className="block py-1.5 px-2 text-sm text-neutral-600 hover:text-sky-700 rounded-md hover:bg-sky-50/70" onClick={() => setIsMenuOpen(false)}>Tur Operatörleri</Link>
                       <Link href="/tours?duration=1" className="block py-1.5 px-2 text-sm text-neutral-600 hover:text-sky-700 rounded-md hover:bg-sky-50/70" onClick={() => setIsMenuOpen(false)}>Günübirlik</Link>
                       <Link href="/tours?duration=7" className="block py-1.5 px-2 text-sm text-neutral-600 hover:text-sky-700 rounded-md hover:bg-sky-50/70" onClick={() => setIsMenuOpen(false)}>Haftalık</Link>
                       <Link href="/tours?featured=true" className="block py-1.5 px-2 text-sm text-neutral-600 hover:text-sky-700 rounded-md hover:bg-sky-50/70" onClick={() => setIsMenuOpen(false)}>Öne Çıkan</Link>
                     </div>
                  </div>
                </div>

                 {/* Mobil Aktiviteler Dropdown */}
                 <div className="dropdown-container">
                  <button
                     className={`w-full flex justify-between items-center py-2.5 px-3 rounded-md text-left ${activeDropdown === 'activities-mobile' ? 'bg-sky-50/70' : ''} text-neutral-700 hover:bg-sky-50/70 hover:text-sky-700 transition-colors`}
                    onClick={() => toggleDropdown('activities-mobile')}
                  >
                     <span className="font-medium text-sm">Aktiviteler</span>
                    <ChevronDownIcon
                       className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'activities-mobile' ? 'rotate-180 text-sky-700' : 'text-neutral-400'}`}
                    />
                  </button>
                   <div
                     className={`overflow-hidden transition-all duration-300 ease-in-out ${activeDropdown === 'activities-mobile' ? 'max-h-96' : 'max-h-0'}`}
                     style={{ maxHeight: activeDropdown === 'activities-mobile' ? '500px' : '0px'}}
                  >
                     <div className="py-1 pl-6 mt-1 space-y-0.5 border-l border-neutral-200 ml-3">
                       <Link href="/activities" className="block py-1.5 px-2 text-sm text-neutral-600 hover:text-sky-700 rounded-md hover:bg-sky-50/70" onClick={() => setIsMenuOpen(false)}>Tüm Aktiviteler</Link>
                       <Link href="/gastronomi" className="block py-1.5 px-2 text-sm text-neutral-600 hover:text-sky-700 rounded-md hover:bg-sky-50/70" onClick={() => setIsMenuOpen(false)}>Gastronomi</Link>
                       <Link href="/kultur-turlari" className="block py-1.5 px-2 text-sm text-neutral-600 hover:text-sky-700 rounded-md hover:bg-sky-50/70" onClick={() => setIsMenuOpen(false)}>Kültür Turları</Link>
                       <Link href="/macera-aktiviteleri" className="block py-1.5 px-2 text-sm text-neutral-600 hover:text-sky-700 rounded-md hover:bg-sky-50/70" onClick={() => setIsMenuOpen(false)}>Macera</Link>
                     </div>
                  </div>
                </div>

                 {/* Mobil Diğer Linkler */}
                 <Link
                  href="/about"
                   className="block py-2.5 px-3 text-sm font-medium text-neutral-700 hover:bg-sky-50/70 hover:text-sky-700 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hakkımızda
                </Link>
                <Link
                  href="/contact"
                   className="block py-2.5 px-3 text-sm font-medium text-neutral-700 hover:bg-sky-50/70 hover:text-sky-700 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  İletişim
                </Link>
                <div
                  role="button"
                  tabIndex={0}
                  className="w-full text-left block py-2.5 px-3 text-sm font-medium text-neutral-700 hover:bg-sky-50/70 hover:text-sky-700 rounded-md transition-colors flex items-center cursor-pointer"
                  onClick={() => {
                    handlePartnerPortalClick();
                    setIsMenuOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handlePartnerPortalClick();
                      setIsMenuOpen(false);
                    }
                  }}
                >
                  <BuildingOfficeIcon className="w-4 h-4 mr-1.5" />
                  Partner Portal
                </div>
                <button
                  onClick={() => { openDealsPopup(); setIsMenuOpen(false); }}
                   className="w-full text-left flex items-center py-2.5 px-3 text-sm font-medium text-neutral-700 hover:bg-sky-50/70 hover:text-sky-700 rounded-md transition-colors"
                >
                  <TagIcon className="w-4 h-4 mr-2 text-neutral-500" />
                  Fırsatlar
                </button>
              </div>
            </div>

             {/* Mobile Footer Buttons (Authenticated) */}
             {status === "authenticated" && (
               <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-3 mt-auto">
                <button
                  onClick={handleSignOut}
                   className="w-full text-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
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