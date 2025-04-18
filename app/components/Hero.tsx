"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Using a single, static background image
const staticHeroImage = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"; 
// Example, replace with your preferred high-quality image

// Re-added necessary data (Keep only what's needed for the modal)
const locations = [
  { name: "İstanbul", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { name: "Kapadokya", image: "https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { name: "Antalya", image: "https://images.unsplash.com/photo-1605217613423-0ebe71a1f71f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { name: "Bodrum", image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" }
];
const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

export default function Hero() {
  // Re-added necessary state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [adultCount, setAdultCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'location' | 'dates' | 'guests'>('location');
  const [currentMonth, setCurrentMonth] = useState(0); // For calendar navigation
  
  const modalRef = useRef<HTMLDivElement>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Re-added logic to close modal on outside click
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

  // Simplified search trigger (opens modal)
  const openSearchModal = () => {
    setIsSearchModalOpen(true);
    setActiveModalTab('location'); // Start with location tab
  };

  // Final search action (from modal)
  const handleFinalSearch = () => {
    console.log("Final Arama:", {
      lokasyon: selectedLocation || searchQuery,
      giriş: selectedStartDate,
      çıkış: selectedEndDate,
      yetişkin: adultCount,
      çocuk: childrenCount
    });
    setIsSearchModalOpen(false);
    // Redirect or API call here
  };

  // --- Re-added Helper Functions (Formatters, Calendar Logic, etc.) ---
  const formatDate = (date: Date | null) => {
    if (!date) return "Tarih Ekle";
    return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(date);
  };

  const formatGuests = () => {
    const total = adultCount + childrenCount;
    if (total === 0) return "Kişi Ekle";
    return `${total} Kişi`;
  };

  const handleDateSelect = (date: Date) => {
     if (!selectedStartDate || (selectedStartDate && selectedEndDate) || date < selectedStartDate) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      setSelectedEndDate(date);
      // Optional: move to next tab after selecting end date
      // setActiveModalTab('guests'); 
    }
  };
  
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelectedDate = (date: Date) => {
    if (selectedStartDate && date.getTime() === selectedStartDate.getTime()) return true;
    if (selectedEndDate && date.getTime() === selectedEndDate.getTime()) return true;
    return false;
  };

  const isInDateRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date > selectedStartDate && date < selectedEndDate;
  };
  
  const generateCalendar = (monthOffset: number) => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
      const month = targetDate.getMonth();
      const year = targetDate.getFullYear();

      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);

      let firstDayOffset = firstDayOfMonth.getDay(); // 0=Sun, 1=Mon ... 6=Sat
      firstDayOffset = firstDayOffset === 0 ? 6 : firstDayOffset - 1; // Adjust to make Monday 0

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
  // --- End Helper Functions ---

  // --- Modal Rendering Function ---
  const renderSearchModal = () => {
    if (!isSearchModalOpen || !isBrowser) return null;

    return createPortal(
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fadeInBg">
        <div 
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-slideDownEnter overflow-hidden"
        >
          {/* Modal Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveModalTab('location')}
              className={`flex-1 py-4 px-2 text-center text-sm font-medium transition-colors border-b-2 ${activeModalTab === 'location' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Konum
            </button>
            <button 
              onClick={() => setActiveModalTab('dates')}
              className={`flex-1 py-4 px-2 text-center text-sm font-medium transition-colors border-b-2 ${activeModalTab === 'dates' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Tarihler
            </button>
            <button 
              onClick={() => setActiveModalTab('guests')}
              className={`flex-1 py-4 px-2 text-center text-sm font-medium transition-colors border-b-2 ${activeModalTab === 'guests' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Misafirler
            </button>
          </div>

          {/* Modal Content */} 
          <div className="p-6 min-h-[300px]">
            {/* Location Tab Content */}
            {activeModalTab === 'location' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Nereye gitmek istersiniz?</h3>
                <div className="relative mb-6">
                   <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                   <input
                     type="text"
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                     placeholder="Şehir, otel veya bölge adı..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Popüler Destinasyonlar</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {locations.map((location) => (
                    <button 
                      key={location.name}
                      onClick={() => { setSelectedLocation(location.name); setActiveModalTab('dates'); }}
                      className="text-left group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 relative">
                        <Image src={location.image} alt={location.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, 25vw" />
                      </div>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">{location.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Dates Tab Content */} 
            {activeModalTab === 'dates' && (
               <div>
                 <h3 className="text-xl font-semibold mb-4 text-gray-900">Tarih Aralığı Seçin</h3>
                 {/* Calendar Implementation */} 
                 <div className="flex justify-between items-center mb-3">
                   <button 
                     type="button" 
                     className="p-2 rounded-full hover:bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                     onClick={() => setCurrentMonth(currentMonth - 1)} 
                     disabled={currentMonth === 0}
                   >
                     <ChevronLeftIcon className="w-5 h-5" />
                   </button>
                   <div className="font-semibold text-gray-800">
                     {monthNames[generateCalendar(currentMonth).month]} {generateCalendar(currentMonth).year}
                   </div>
                   <div className="font-semibold text-gray-800 ml-12 hidden sm:block">
                      {monthNames[generateCalendar(currentMonth + 1).month]} {generateCalendar(currentMonth + 1).year}
                   </div>
                   <button 
                     type="button" 
                     className="p-2 rounded-full hover:bg-gray-100 text-gray-500" 
                     onClick={() => setCurrentMonth(currentMonth + 1)}
                   >
                     <ChevronRightIcon className="w-5 h-5" />
                   </button>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                   {[generateCalendar(currentMonth), generateCalendar(currentMonth + 1)].map((cal, calIndex) => (
                      <div key={calIndex} className={calIndex === 0 ? "mb-4 sm:mb-0" : "hidden sm:block"}> {/* Hide second calendar on mobile */}
                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-medium mb-2">
                          <div>Pt</div><div>Sa</div><div>Ça</div><div>Pe</div><div>Cu</div><div>Ct</div><div>Pa</div>
                        </div>
                        {cal.weeks.map((week, weekIdx) => (
                          <div key={weekIdx} className="grid grid-cols-7 gap-1">
                            {week.map((date, dayIdx) => {
                              if (!date) return <div key={dayIdx} className="h-9"></div>;
                              const isPast = isPastDate(date);
                              const isSelected = isSelectedDate(date);
                              const isInRange = isInDateRange(date);
                              return (
                                <button
                                  key={dayIdx}
                                  type="button"
                                  disabled={isPast}
                                  onClick={() => handleDateSelect(date)}
                                  className={`h-9 w-full flex items-center justify-center rounded text-sm transition-colors ${isPast ? 'text-gray-300 cursor-not-allowed' : isSelected ? 'bg-indigo-600 text-white font-semibold' : isInRange ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                  {date.getDate()}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                   ))}
                 </div>
                 {/* Add clear button? */}
               </div>
            )}
            
            {/* Guests Tab Content */}
            {activeModalTab === 'guests' && (
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Misafir Sayısı Seçin</h3>
                 <div className="space-y-5">
                    {/* Adults */}
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="font-medium text-gray-800">Yetişkinler</p>
                          <p className="text-sm text-gray-500">13 yaş ve üzeri</p>
                       </div>
                       <div className="flex items-center space-x-3">
                          <button type="button" onClick={() => setAdultCount(Math.max(1, adultCount - 1))} disabled={adultCount <= 1} className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 disabled:opacity-50 flex items-center justify-center hover:border-gray-500 transition">-</button>
                          <span className="w-8 text-center font-medium text-lg text-black">{adultCount}</span>
                          <button type="button" onClick={() => setAdultCount(adultCount + 1)} className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center hover:border-gray-500 transition">+</button>
                       </div>
                    </div>
                    {/* Children */}
                    <div className="flex justify-between items-center">
                       <div>
                          <p className="font-medium text-gray-800">Çocuklar</p>
                          <p className="text-sm text-gray-500">2-12 yaş</p>
                       </div>
                       <div className="flex items-center space-x-3">
                          <button type="button" onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} disabled={childrenCount <= 0} className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 disabled:opacity-50 flex items-center justify-center hover:border-gray-500 transition">-</button>
                          <span className="w-8 text-center font-medium text-lg text-black">{childrenCount}</span>
                          <button type="button" onClick={() => setChildrenCount(childrenCount + 1)} className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center hover:border-gray-500 transition">+</button>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Modal Footer / Search Button */}
          <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
            <button 
              onClick={handleFinalSearch}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white font-semibold rounded-lg transition-colors text-sm shadow-sm flex items-center gap-2"
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
  // --- End Modal Rendering Function ---

  return (
    <section className="relative mt-16 md:mt-0 min-h-[600px] h-[85vh] max-h-[800px] w-full overflow-hidden flex items-center justify-center">
      {/* Static Background Image (Keep as is) */}
      <div className="absolute inset-0 w-full h-full">
         <Image
            src={staticHeroImage} 
            alt="Türkiye'nin güzelliklerini keşfedin"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center filter brightness-[0.7]"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/50 to-black/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center text-center text-white">
        
        <div className="w-full max-w-4xl mb-10 md:mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-5 leading-tight">
            Hayalindeki Tatili <span className="text-blue-400">Keşfet</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-white/90">
            Türkiye'nin dört bir yanındaki eşsiz otelleri, turları ve deneyimleri kolayca bulun ve rezerve edin.
          </p>
        </div>
        
        {/* Clickable Search Bar Trigger */}
        <div className="w-full max-w-2xl animate-slideUp delay-200">
          <button 
            onClick={openSearchModal}
            className="w-full flex items-center bg-white/90 backdrop-blur-sm rounded-full shadow-xl p-3 text-left border border-gray-200/50 hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex-1 flex items-center px-3 border-r border-gray-200 mr-3">
               <MapPinIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0"/>
               <span className="text-gray-700 text-sm md:text-base truncate">{selectedLocation || "Nereye?"}</span>
            </div>
             <div className="flex-1 flex items-center px-3 border-r border-gray-200 mr-3">
               <CalendarDaysIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0"/>
               <span className="text-gray-700 text-sm md:text-base truncate">{selectedStartDate ? `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}` : "Tarihler"}</span>
            </div>
             <div className="flex-1 flex items-center px-3 mr-3">
               <UserGroupIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0"/>
               <span className="text-gray-700 text-sm md:text-base truncate">{formatGuests()}</span>
            </div>
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                 <MagnifyingGlassIcon className="w-5 h-5 text-white"/>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      {/* Render the Search Modal */} 
      {renderSearchModal()} 
    </section>
  );
} 