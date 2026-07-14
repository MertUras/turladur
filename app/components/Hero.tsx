"use client";

import { useState, useEffect, useRef, useCallback, type ComponentType } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { DEFAULT_DEPARTURE_CITIES } from '@/lib/tours/filter-options';

type DepartureCityOption = {
  city: string;
  count: number;
};

const trustBadges = [
  { text: 'Güvenli Ödeme', icon: ShieldCheckIcon },
  { text: '7/24 Destek', icon: PhoneIcon },
  { text: 'En İyi Fiyat Garantisi', icon: CurrencyDollarIcon },
] as const;

// Statik arka plan görseli (Daha modern bir görsel seçilebilir)
const staticHeroImage = "https://images.unsplash.com/photo-1583062482795-d2bef78e9bc1?q=80&w=2070&auto=format&fit=crop"; 

// Modal için gerekli veriler
const locations = [
  { name: "İstanbul", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" },
  { name: "Kapadokya", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=200&q=80" },
  { name: "Antalya", image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=200&q=80" },
  { name: "Bodrum", image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" }
];
const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

const routesHeroImage = "https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

type HeroProps = {
  variant?: "default" | "routes";
};

export default function Hero({ variant = "default" }: HeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State'ler
  const [searchQuery, setSearchQuery] = useState("");
  const [routeSearchQuery, setRouteSearchQuery] = useState("");
  const [routeCategory, setRouteCategory] = useState("");
  const [routeDuration, setRouteDuration] = useState("");
  const [routeSeason, setRouteSeason] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDepartureCity, setSelectedDepartureCity] = useState<string | null>(null);
  const [departureCityOptions, setDepartureCityOptions] = useState<DepartureCityOption[]>(
    DEFAULT_DEPARTURE_CITIES.map((city) => ({ city, count: 0 }))
  );
  const [departureCitySearch, setDepartureCitySearch] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [adultCount, setAdultCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'location' | 'departure' | 'dates' | 'guests'>('location');
  const [currentMonth, setCurrentMonth] = useState(0); // Takvim navigasyonu
  
  const modalRef = useRef<HTMLDivElement>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    const fetchDepartureCities = async () => {
      try {
        const response = await fetch('/api/tours/filters');
        const data = await response.json();
        if (response.ok && Array.isArray(data.departureCities) && data.departureCities.length > 0) {
          setDepartureCityOptions(data.departureCities);
        }
      } catch {
        // Varsayılan şehir listesi kullanılır
      }
    };

    fetchDepartureCities();
  }, []);

  // Dışarı tıklanınca modal kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchModalOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsSearchModalOpen(false);
      }
    };
    if (isSearchModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchModalOpen]);

  // Arama modalını açma
  const openSearchModal = (tab: 'location' | 'departure' | 'dates' | 'guests' = 'location') => {
    setIsSearchModalOpen(true);
    setActiveModalTab(tab);
  };

  const formatDateParam = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const buildToursSearchUrl = () => {
    const params = new URLSearchParams();
    const destination = selectedLocation || searchQuery.trim();

    if (destination) {
      params.set('search', destination);
    }

    if (selectedDepartureCity) {
      params.set('departureCity', selectedDepartureCity);
    }

    if (selectedStartDate) params.set('startDate', formatDateParam(selectedStartDate));
    if (selectedEndDate) params.set('endDate', formatDateParam(selectedEndDate));
    if (adultCount > 1) params.set('adults', adultCount.toString());
    if (childrenCount > 0) params.set('children', childrenCount.toString());

    const query = params.toString();
    return query ? `/tours?${query}` : '/tours';
  };

  // Modal'dan veya hero arama butonundan yönlendirme
  const handleFinalSearch = () => {
    setIsSearchModalOpen(false);
    router.push(buildToursSearchUrl());
  };

  // --- Yardımcı Fonksiyonlar --- 
  const formatDate = (date: Date | null) => {
    if (!date) return "Tarih Ekle";
    // Daha kısa format
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' }).format(date);
  };

  const formatGuests = () => {
    const total = adultCount + childrenCount;
    if (total === 0) return "Kişi Ekle";
    return `${total} Kişi`;
  };

  const formatGuestsMobile = () => {
    const parts: string[] = [];
    if (adultCount > 0) parts.push(`${adultCount} Yetişkin`);
    if (childrenCount > 0) parts.push(`${childrenCount} Çocuk`);
    return parts.length > 0 ? parts.join(', ') : 'Misafir ekle';
  };

  const formatDestinationDisplay = () => {
    return selectedLocation || searchQuery.trim() || 'Şehir, bölge veya otel adı';
  };

  const formatDepartureDisplay = () => {
    return selectedDepartureCity || 'Kalkış yeri seçin';
  };

  const formatDateRangeDisplay = () => {
    if (!selectedStartDate) return 'Giriş - Çıkış tarihi';
    const start = formatDate(selectedStartDate);
    const end = selectedEndDate ? formatDate(selectedEndDate) : 'Çıkış';
    return `${start} - ${end}`;
  };

  const filteredDepartureCities = departureCityOptions.filter((option) =>
    option.city.toLocaleLowerCase('tr-TR').includes(departureCitySearch.toLocaleLowerCase('tr-TR'))
  );

  const handleDateSelect = (date: Date) => {
     // Tarih seçme mantığı güncellendi: ilk tıklama başlangıç, ikinci tıklama bitiş
     if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else if (date < selectedStartDate) {
      // Eğer başlangıçtan önceki bir tarih seçilirse, yeni başlangıç tarihi olur
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
       // Başlangıç tarihi varken sonraki bir tarih seçilirse, bitiş tarihi olur
      setSelectedEndDate(date);
      // Bitiş tarihi seçildikten sonra otomatik olarak misafir sekmesine geçilebilir
      // setActiveModalTab('guests'); 
    }
  };
  
  // Geçmiş tarih kontrolü
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Seçili tarih kontrolü
  const isSelectedDate = (date: Date) => {
    if (selectedStartDate && date.getTime() === selectedStartDate.getTime()) return 'start';
    if (selectedEndDate && date.getTime() === selectedEndDate.getTime()) return 'end';
    return false;
  };

  // Tarih aralığında mı kontrolü
  const isInDateRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date > selectedStartDate && date < selectedEndDate;
  };
  
  // Takvim oluşturma fonksiyonu
  const generateCalendar = (monthOffset: number) => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
      const month = targetDate.getMonth();
      const year = targetDate.getFullYear();

      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);

      let firstDayOffset = firstDayOfMonth.getDay(); // Pazar=0, Ptesi=1...
      firstDayOffset = firstDayOffset === 0 ? 6 : firstDayOffset - 1; // Pazartesi=0 yap

      const daysInMonth = lastDayOfMonth.getDate();
      const weeks: (Date | null)[][] = [];
      let currentWeek: (Date | null)[] = Array(firstDayOffset).fill(null);

      for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
          currentWeek.push(date);
          if (currentWeek.length === 7) {
              weeks.push(currentWeek);
              currentWeek = [];
          }
      }
      if (currentWeek.length > 0) {
          currentWeek.push(...Array(7 - currentWeek.length).fill(null));
          weeks.push(currentWeek);
      }
      return { month, year, weeks };
  };
  // --- End Yardımcı Fonksiyonlar --- 

  // --- Modal Render Fonksiyonu --- 
  const renderSearchModal = () => {
    if (!isSearchModalOpen || !isBrowser) return null;

    return createPortal(
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeInBg">
        <div 
          ref={modalRef}
           // Modal stili: daha modern, neutral renkler
           className="bg-white rounded-xl shadow-xl w-full max-w-3xl animate-slideDownEnter overflow-hidden border border-neutral-200/70"
        >
          {/* Modal Tabs */} 
           <div className="flex border-b border-neutral-200 bg-neutral-50/50 overflow-x-auto">
            <button 
              onClick={() => setActiveModalTab('location')}
               className={`flex-1 min-w-[72px] py-3 px-2 text-center text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${activeModalTab === 'location' ? 'border-sky-600 text-sky-700 font-semibold' : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'}`}
            >
              Konum
            </button>
            <button 
              onClick={() => setActiveModalTab('departure')}
               className={`flex-1 min-w-[72px] py-3 px-2 text-center text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${activeModalTab === 'departure' ? 'border-sky-600 text-sky-700 font-semibold' : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'}`}
            >
              Kalkış
            </button>
            <button 
              onClick={() => setActiveModalTab('dates')}
               className={`flex-1 min-w-[72px] py-3 px-2 text-center text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${activeModalTab === 'dates' ? 'border-sky-600 text-sky-700 font-semibold' : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'}`}
            >
              Tarihler
            </button>
            <button 
              onClick={() => setActiveModalTab('guests')}
               className={`flex-1 min-w-[72px] py-3 px-2 text-center text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${activeModalTab === 'guests' ? 'border-sky-600 text-sky-700 font-semibold' : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'}`}
            >
              Misafirler
            </button>
          </div>

          {/* Modal Content */} 
           <div className="p-6 md:p-8 min-h-[350px]">
            {/* Konum Sekmesi İçeriği */} 
            {activeModalTab === 'location' && (
               <div className="animate-fadeIn">
                 <h3 className="text-lg font-semibold mb-4 text-neutral-900">Nereye gitmek istersiniz?</h3>
                 <div className="relative mb-6">
                    {/* Input stili güncellendi */}
                    <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                     type="text"
                      className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 text-neutral-800 placeholder-neutral-400 text-sm"
                     placeholder="Şehir, otel veya bölge adı..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
                 <h4 className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wider">Popüler Destinasyonlar</h4>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {locations.map((location) => (
                    <button 
                      key={location.name}
                      onClick={() => { setSelectedLocation(location.name); setSearchQuery(location.name); setActiveModalTab('departure'); }}
                       // Lokasyon kart stili güncellendi
                       className="text-left group transition-transform duration-200 ease-out hover:scale-[1.03]"
                    >
                       <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 relative shadow-sm border border-neutral-100">
                        <Image src={location.image} alt={location.name} fill className="object-cover group-hover:brightness-105 transition-all duration-300" sizes="(max-width: 640px) 50vw, 25vw" />
                      </div>
                       <p className="text-sm font-medium text-neutral-800 group-hover:text-sky-700 transition-colors">{location.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeModalTab === 'departure' && (
              <div className="animate-fadeIn">
                <h3 className="text-lg font-semibold mb-4 text-neutral-900">Nereden kalkıyorsunuz?</h3>
                <div className="relative mb-4">
                  <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 text-neutral-800 placeholder-neutral-400 text-sm"
                    placeholder="Kalkış şehri ara..."
                    value={departureCitySearch}
                    onChange={(e) => setDepartureCitySearch(e.target.value)}
                  />
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredDepartureCities.map((option) => (
                    <button
                      key={option.city}
                      type="button"
                      onClick={() => {
                        setSelectedDepartureCity(option.city);
                        setDepartureCitySearch('');
                        setActiveModalTab('dates');
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                        selectedDepartureCity === option.city
                          ? 'bg-sky-50 text-sky-700 font-medium'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{option.city}</span>
                      {option.count > 0 && (
                        <span className="text-xs text-neutral-400">{option.count} tur</span>
                      )}
                    </button>
                  ))}
                  {filteredDepartureCities.length === 0 && (
                    <p className="text-sm text-neutral-500 text-center py-4">Sonuç bulunamadı</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Tarih Sekmesi İçeriği */}
             {activeModalTab === 'dates' && (
                <div className="animate-fadeIn">
                  <h3 className="text-lg font-semibold mb-5 text-neutral-900">Tarih Aralığı Seçin</h3>
                  {/* Takvim stilleri güncellendi */}
                  <div className="flex justify-between items-center mb-4">
                    <button 
                      type="button" 
                       className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" 
                      onClick={() => setCurrentMonth(currentMonth - 1)} 
                      disabled={currentMonth === 0}
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    {/* Ay gösterimi */}
                    <div className="flex-grow text-center">
                      <div className="font-semibold text-neutral-800 text-sm">
                        {monthNames[generateCalendar(currentMonth).month]} {generateCalendar(currentMonth).year}
                      </div>
                      <div className="font-semibold text-neutral-800 text-sm ml-12 hidden sm:inline-block">
                         {monthNames[generateCalendar(currentMonth + 1).month]} {generateCalendar(currentMonth + 1).year}
                      </div>
                    </div>
                    <button 
                      type="button" 
                       className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors" 
                      onClick={() => setCurrentMonth(currentMonth + 1)}
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    {[generateCalendar(currentMonth), generateCalendar(currentMonth + 1)].map((cal, calIndex) => (
                       <div key={calIndex} className={`${calIndex === 0 ? "mb-4 sm:mb-0" : "hidden sm:block"} ${calIndex === 1 ? "sm:border-l sm:pl-6 sm:border-neutral-200" : ""}`}>
                         {/* Gün isimleri */} 
                         <div className="grid grid-cols-7 gap-y-1 text-center text-xs text-neutral-500 font-medium mb-2">
                          <div>Pt</div><div>Sa</div><div>Ça</div><div>Pe</div><div>Cu</div><div>Ct</div><div>Pa</div>
                        </div>
                        {/* Takvim günleri */} 
                         {cal.weeks.map((week, weekIdx) => (
                           <div key={weekIdx} className="grid grid-cols-7">
                            {week.map((date, dayIdx) => {
                              if (!date) return <div key={dayIdx} className="p-0.5"><div className="h-7"></div></div>;
                              const isPast = isPastDate(date);
                              const selectionState = isSelectedDate(date);
                              const isInRange = isInDateRange(date);
                              const isStart = selectionState === 'start';
                              const isEnd = selectionState === 'end';
                              
                              // Daha iyi UX için takvim gün stilleri
                              const dayWrapperClasses = `p-0.5 ${isInRange || isStart || isEnd ? 'bg-sky-100/70' : ''} ${isStart ? 'rounded-l-full' : ''} ${isEnd ? 'rounded-r-full' : ''}`;
                              const buttonClasses = `
                                h-7 w-full flex items-center justify-center rounded-full text-xs transition-colors duration-150 ease-out 
                                ${isPast ? 'text-neutral-300 cursor-not-allowed' 
                                  : isStart || isEnd ? 'bg-sky-600 text-white font-semibold' 
                                  : isInRange ? 'text-sky-700' 
                                  : 'text-neutral-700 hover:bg-neutral-100'}
                              `;

                              return (
                                <div key={dayIdx} className={dayWrapperClasses}>
                                  <button
                                    type="button"
                                    disabled={isPast}
                                    onClick={() => handleDateSelect(date)}
                                    className={buttonClasses}
                                  >
                                    {date.getDate()}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                   {/* Temizle butonu eklenebilir */} 
                  {(selectedStartDate || selectedEndDate) && (
                    <button 
                       onClick={() => {setSelectedStartDate(null); setSelectedEndDate(null);}}
                       className="text-xs text-neutral-500 hover:text-neutral-700 underline mt-4"
                     >
                      Tarihleri Temizle
                    </button>
                  )}
                </div>
             )}
            
            {/* Misafir Sekmesi İçeriği */} 
             {activeModalTab === 'guests' && (
               <div className="animate-fadeIn">
                 <h3 className="text-lg font-semibold mb-6 text-neutral-900">Misafir Sayısı Seçin</h3>
                  <div className="space-y-6 max-w-sm mx-auto">
                     {/* Yetişkinler */}
                     <div className="flex justify-between items-center">
                        <div>
                           {/* Misafir etiketleri güncellendi */}
                           <p className="font-medium text-neutral-800">Yetişkinler</p>
                           <p className="text-xs text-neutral-500">13 yaş ve üzeri</p>
                        </div>
                        <div className="flex items-center space-x-3">
                           {/* Sayaç butonları güncellendi */}
                           <button type="button" onClick={() => setAdultCount(Math.max(1, adultCount - 1))} disabled={adultCount <= 1} className="w-7 h-7 rounded-full border border-neutral-300 text-neutral-600 disabled:opacity-40 flex items-center justify-center hover:border-neutral-500 transition text-lg">-</button>
                           <span className="w-8 text-center font-medium text-base text-neutral-900">{adultCount}</span>
                           <button type="button" onClick={() => setAdultCount(adultCount + 1)} className="w-7 h-7 rounded-full border border-neutral-300 text-neutral-600 flex items-center justify-center hover:border-neutral-500 transition text-lg">+</button>
                        </div>
                     </div>
                     {/* Çocuklar */}
                     <div className="flex justify-between items-center">
                        <div>
                           <p className="font-medium text-neutral-800">Çocuklar</p>
                           <p className="text-xs text-neutral-500">2-12 yaş</p>
                        </div>
                        <div className="flex items-center space-x-3">
                           <button type="button" onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} disabled={childrenCount <= 0} className="w-7 h-7 rounded-full border border-neutral-300 text-neutral-600 disabled:opacity-40 flex items-center justify-center hover:border-neutral-500 transition text-lg">-</button>
                           <span className="w-8 text-center font-medium text-base text-neutral-900">{childrenCount}</span>
                           <button type="button" onClick={() => setChildrenCount(childrenCount + 1)} className="w-7 h-7 rounded-full border border-neutral-300 text-neutral-600 flex items-center justify-center hover:border-neutral-500 transition text-lg">+</button>
                        </div>
                     </div>
                  </div>
               </div>
             )}
          </div>

          {/* Modal Footer / Arama Butonu */} 
           <div className="bg-neutral-50 p-4 border-t border-neutral-200 flex items-center justify-between">
             {/* Seçimleri temizle butonu */} 
             <button 
               onClick={() => {
                 setSearchQuery("");
                 setSelectedLocation(null);
                 setSelectedDepartureCity(null);
                 setDepartureCitySearch("");
                 setSelectedStartDate(null);
                 setSelectedEndDate(null);
                 setAdultCount(2);
                 setChildrenCount(0);
                 setActiveModalTab('location');
               }}
               className="text-xs text-neutral-500 hover:text-neutral-700 underline"
             >
               Temizle
             </button>
            <button 
              onClick={handleFinalSearch}
               // Arama butonu stili güncellendi
               className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 text-white font-semibold rounded-lg transition-colors text-sm shadow-sm flex items-center gap-2"
            >
              <MagnifyingGlassIcon className="w-4 h-4"/>
              Ara
            </button>
          </div>

        </div>
      </div>,
      document.body
    );
  }; 
  // --- End Modal Render Fonksiyonu --- 

  useEffect(() => {
    if (variant !== "routes") return;
    setRouteSearchQuery(searchParams.get("search") || "");
    setRouteCategory(searchParams.get("category") || "");
    setRouteDuration(searchParams.get("duration") || "");
    setRouteSeason(searchParams.get("season") || "");
  }, [variant, searchParams]);

  const handleRouteSearch = () => {
    const params = new URLSearchParams();
    if (routeSearchQuery.trim()) params.set("search", routeSearchQuery.trim());
    if (routeCategory) params.set("category", routeCategory);
    if (routeDuration) params.set("duration", routeDuration);
    if (routeSeason) params.set("season", routeSeason);

    const query = params.toString();
    router.push(query ? `/routes?${query}` : "/routes");
    document.getElementById("popular-routes")?.scrollIntoView({ behavior: "smooth" });
  };

  const renderRoutesSearchForm = () => (
    <div className="w-full max-w-5xl animate-slideUp delay-200">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-6 text-left border border-neutral-200/30">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={routeSearchQuery}
            onChange={(e) => setRouteSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRouteSearch()}
            className="block w-full pl-12 pr-28 py-3.5 border border-neutral-300 rounded-xl text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 text-sm"
            placeholder="Rota ara... (örn: Kapadokya, Likya Yolu)"
          />
          <button
            type="button"
            onClick={handleRouteSearch}
            className="absolute right-2 top-2 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors text-sm"
          >
            Ara
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="route-category" className="block text-sm font-medium text-neutral-700 mb-1">
              Kategori
            </label>
            <select
              id="route-category"
              value={routeCategory}
              onChange={(e) => setRouteCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 border border-neutral-300 bg-white rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-sky-300 focus:border-sky-500"
            >
              <option value="">Tüm Kategoriler</option>
              <option value="historical">Tarihi & Kültürel</option>
              <option value="nature">Doğa & Manzara</option>
              <option value="beach">Deniz & Plaj</option>
              <option value="gastronomy">Gastronomi</option>
              <option value="family">Aile Dostu</option>
            </select>
          </div>
          <div>
            <label htmlFor="route-duration" className="block text-sm font-medium text-neutral-700 mb-1">
              Süre
            </label>
            <select
              id="route-duration"
              value={routeDuration}
              onChange={(e) => setRouteDuration(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 border border-neutral-300 bg-white rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-sky-300 focus:border-sky-500"
            >
              <option value="">Tüm Süreler</option>
              <option value="1-day">1 gün</option>
              <option value="2-3-days">2-3 gün</option>
              <option value="4-7-days">4-7 gün</option>
              <option value="7-plus-days">7+ gün</option>
            </select>
          </div>
          <div>
            <label htmlFor="route-season" className="block text-sm font-medium text-neutral-700 mb-1">
              Sezon
            </label>
            <select
              id="route-season"
              value={routeSeason}
              onChange={(e) => setRouteSeason(e.target.value)}
              className="block w-full pl-3 pr-10 py-2.5 border border-neutral-300 bg-white rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-sky-300 focus:border-sky-500"
            >
              <option value="">Tüm Sezonlar</option>
              <option value="spring">İlkbahar</option>
              <option value="summer">Yaz</option>
              <option value="autumn">Sonbahar</option>
              <option value="winter">Kış</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const isRoutesVariant = variant === "routes";

  const renderMobileSearchRow = ({
    icon: Icon,
    label,
    value,
    onClick,
    hasBorder = true,
  }: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: string;
    onClick: () => void;
    hasBorder?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-3.5 text-left transition-colors hover:bg-neutral-50/80 rounded-lg px-1 ${
        hasBorder ? 'border-b border-neutral-100' : ''
      }`}
    >
      <Icon className="w-5 h-5 text-sky-600 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-neutral-500 font-medium">{label}</p>
        <p className="text-sm text-neutral-800 truncate font-medium">{value}</p>
      </div>
      <ChevronRightIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
    </button>
  );

  const renderMobileSearchCard = () => (
    <div className="w-full -mt-6 px-1 animate-slideUp delay-200">
      <div className="bg-white rounded-2xl shadow-xl border border-neutral-100/80 p-4 text-left">
        {renderMobileSearchRow({
          icon: MapPinIcon,
          label: 'Nereye gidiyorsun?',
          value: formatDestinationDisplay(),
          onClick: () => openSearchModal('location'),
        })}
        {renderMobileSearchRow({
          icon: PaperAirplaneIcon,
          label: 'Nereden?',
          value: formatDepartureDisplay(),
          onClick: () => openSearchModal('departure'),
        })}
        {renderMobileSearchRow({
          icon: CalendarDaysIcon,
          label: 'Tarih aralığı',
          value: formatDateRangeDisplay(),
          onClick: () => openSearchModal('dates'),
        })}
        {renderMobileSearchRow({
          icon: UserGroupIcon,
          label: 'Misafir',
          value: formatGuestsMobile(),
          onClick: () => openSearchModal('guests'),
          hasBorder: false,
        })}
        <button
          type="button"
          onClick={handleFinalSearch}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl py-3.5 transition-colors shadow-sm"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          Tatil Ara
        </button>
      </div>
    </div>
  );

  const renderDesktopSearchBar = () => (
    <div className="w-full max-w-3xl animate-slideUp delay-200">
      <div className="w-full grid grid-cols-[1fr_auto_1fr_auto_1fr_auto] items-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg p-2 text-left border border-neutral-200/30 hover:shadow-xl transition-shadow duration-300">
        <button
          type="button"
          onClick={() => openSearchModal('location')}
          className="flex-1 flex items-center pl-3 pr-2 min-w-0 text-left"
        >
          <MapPinIcon className="w-4 h-4 text-sky-600 mr-2 flex-shrink-0"/>
          <span className="text-neutral-700 text-sm truncate font-medium">{selectedLocation || searchQuery || "Nereye?"}</span>
        </button>
        <div className="hidden md:block h-6 border-l border-neutral-200 mx-1"></div>
        <button
          type="button"
          onClick={() => openSearchModal('dates')}
          className="flex-1 flex items-center pl-3 pr-2 min-w-0 text-left"
        >
          <CalendarDaysIcon className="w-4 h-4 text-sky-600 mr-2 flex-shrink-0"/>
          <span className="text-neutral-700 text-sm truncate font-medium">{selectedStartDate ? `${formatDate(selectedStartDate)}${selectedEndDate ? ' - '+formatDate(selectedEndDate) : ''}` : "Tarihler"}</span>
        </button>
        <div className="hidden md:block h-6 border-l border-neutral-200 mx-1"></div>
        <button
          type="button"
          onClick={() => openSearchModal('guests')}
          className="flex-1 flex items-center pl-3 pr-2 min-w-0 text-left"
        >
          <UserGroupIcon className="w-4 h-4 text-sky-600 mr-2 flex-shrink-0"/>
          <span className="text-neutral-500 text-sm truncate font-medium whitespace-nowrap">{formatGuests()}</span>
        </button>
        <button
          type="button"
          onClick={handleFinalSearch}
          aria-label="Tur ara"
          className="flex-shrink-0 ml-2 w-8 h-8 md:w-9 md:h-9 bg-sky-600 rounded-full flex items-center justify-center shadow hover:bg-sky-700 transition-colors"
        >
          <MagnifyingGlassIcon className="w-4 h-4 text-white"/>
        </button>
      </div>
    </div>
  );

  return (
    <section className={`relative mt-0 w-full overflow-hidden flex ${
      isRoutesVariant
        ? 'min-h-[650px] h-[85vh] max-h-[900px] items-center justify-center'
        : 'flex-col md:items-center md:justify-center min-h-[480px] md:min-h-[650px] h-auto md:h-[85vh] md:max-h-[900px] pb-6 md:pb-0'
    }`}>
      {/* Arka Plan Görseli */}
      <div className="absolute inset-0 w-full h-full">
         <Image
            src={isRoutesVariant ? routesHeroImage : staticHeroImage} 
            alt={isRoutesVariant ? "Türkiye'nin popüler rotalarını keşfedin" : "Türkiye'nin güzelliklerini keşfedin"}
            fill
            sizes="100vw"
            priority
             // Parlaklık ayarı güncellendi
             className="object-cover object-center filter brightness-[0.6]"
          />
         {/* Gradient overlay güncellendi */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/50 md:from-black/40 md:via-black/20 md:to-black/60" />
      </div>

      {/* Hero İçeriği */}
      <div className={`relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center text-white w-full ${
        isRoutesVariant ? 'justify-center' : 'justify-start md:justify-center pt-20 md:pt-0'
      }`}>
        
         <div className={`w-full max-w-4xl animate-fadeIn ${isRoutesVariant ? 'mb-10 md:mb-12' : 'mb-5 md:mb-12'}`}>
           <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-[64px] font-bold mb-3 md:mb-5 !leading-tight tracking-tight">
            {isRoutesVariant ? (
              <>Popüler Rotaları <span className="text-sky-400">Keşfet</span></>
            ) : (
              <>
                <span className="md:hidden">Hayalindeki Tatili <span className="text-sky-400">Bul</span></span>
                <span className="hidden md:inline">Hayalindeki Tatili <span className="text-sky-400">Keşfet</span></span>
              </>
            )}
          </h1>
          <p className="text-base md:text-xl max-w-2xl mx-auto text-white/90 font-light px-2">
            {isRoutesVariant
              ? "Kapadokya, Likya Yolu, Pamukkale ve daha fazlası için tur seçeneklerini inceleyin."
              : (
                <>
                  <span className="md:hidden">Türkiye&apos;nin en güzel destinasyonlarında unutulmaz tatil deneyimleri seni bekliyor.</span>
                  <span className="hidden md:inline">Türkiye&apos;nin dört bir yanındaki eşsiz otelleri, turları ve deneyimleri kolayca bulun ve rezerve edin.</span>
                </>
              )}
          </p>

          {!isRoutesVariant && (
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 md:hidden">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.text} className="flex items-center gap-1.5 text-white/90">
                    <Icon className="w-4 h-4 text-sky-300 flex-shrink-0" />
                    <span className="text-xs font-medium">{badge.text}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {isRoutesVariant ? (
          renderRoutesSearchForm()
        ) : (
          <>
            <div className="md:hidden w-full max-w-lg">
              {renderMobileSearchCard()}
            </div>
            <div className="hidden md:block w-full">
              {renderDesktopSearchBar()}
            </div>
          </>
        )}
      </div>
      
      {!isRoutesVariant && renderSearchModal()} 
    </section>
  );
} 