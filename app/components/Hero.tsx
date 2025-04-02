"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";

// Arka plan görselleri
const backgroundImages = [
  "/images/hero/istanbul.jpg",
  "/images/hero/cappadocia.jpg",
  "/images/hero/antalya.jpg",
  "/images/hero/pamukkale.jpg"
];

// Örnek arka plan görselleri (gerçek görseller yerine)
const placeholderImages = [
  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
  "https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1605217613423-0ebe71a1f71f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
];

// Arama önerileri
const searchSuggestions = [
  "İstanbul'da 5 yıldızlı oteller",
  "Kapadokya balon turu",
  "Antalya tekne turu",
  "Pamukkale termal otel"
];

// Lokasyon bilgileri
const locations = [
  {
    name: "İstanbul",
    description: "Boğaz manzarası ve tarihi yapılarıyla eşsiz bir şehir",
    image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
  },
  {
    name: "Kapadokya",
    description: "Peri bacaları ve balon turlarıyla büyüleyici bir deneyim",
    image: "https://images.unsplash.com/photo-1570654230464-9e63b3497a1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    name: "Antalya",
    description: "Turkuaz sahilleri ve lüks tatil köyleriyle tatil cenneti",
    image: "https://images.unsplash.com/photo-1605217613423-0ebe71a1f71f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  },
  {
    name: "Pamukkale",
    description: "Beyaz travertenler ve termal sularıyla doğal bir mucize",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
  }
];

// Öne çıkan fırsatlar
const promotions = [
  { 
    id: "promo1",
    title: "Erken Rezervasyon İndirimi", 
    discount: "%25", 
    expiry: "Son 3 gün", 
    color: "bg-orange-600" 
  },
  { 
    id: "promo2",
    title: "Aile Paketi", 
    discount: "1 Çocuk Ücretsiz", 
    expiry: "Sınırlı sayıda", 
    color: "bg-emerald-600" 
  },
  { 
    id: "promo3",
    title: "Son Dakika Fırsatı", 
    discount: "%30", 
    expiry: "Bugüne özel", 
    color: "bg-red-600" 
  }
];

// Tarih seçenekleri
const dateOptions = [
  { month: "Mart", year: 2024, dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], firstDayOffset: 4 }, // 1 Mart 2024 Cuma günüdür (offset 4)
  { month: "Nisan", year: 2024, dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], firstDayOffset: 0 }, // 1 Nisan 2024 Pazartesi günüdür (offset 0)
  { month: "Mayıs", year: 2024, dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], firstDayOffset: 2 }, // 1 Mayıs 2024 Çarşamba günüdür (offset 2)
  { month: "Haziran", year: 2024, dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], firstDayOffset: 5 }, // 1 Haziran 2024 Cumartesi günüdür (offset 5)
  { month: "Temmuz", year: 2024, dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], firstDayOffset: 0 }, // 1 Temmuz 2024 Pazartesi günüdür (offset 0)
  { month: "Ağustos", year: 2024, dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], firstDayOffset: 3 }  // 1 Ağustos 2024 Perşembe günüdür (offset 3)
];

// Ayların Türkçe isimleri
const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

// Kişi sayısı seçenekleri
const personOptions = [
  { count: 1, text: "1 Kişi" },
  { count: 2, text: "2 Kişi" },
  { count: 3, text: "3 Kişi" },
  { count: 4, text: "4 Kişi" },
  { count: 5, text: "5 Kişi" },
  { count: 6, text: "6+ Kişi" }
];

export default function Hero() {
  const [activeBackground, setActiveBackground] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [selectedPersonCount, setSelectedPersonCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  
  // Dropdown durumları
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);
  
  // Referanslar
  const searchFormRef = useRef<HTMLFormElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const guestsDropdownRef = useRef<HTMLDivElement>(null);

  // Modal'lar için DOM element referansı
  const [isBrowser, setIsBrowser] = useState(false);
  
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Arka plan resmini otomatik olarak değiştir
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBackground((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dışarı tıklandığında dropdown'ları kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (locationDropdownOpen && 
          locationDropdownRef.current && 
          !locationDropdownRef.current.contains(target) &&
          !target.closest('[data-dropdown="location"]')) {
        setLocationDropdownOpen(false);
      }
      
      if (dateDropdownOpen && 
          dateDropdownRef.current && 
          !dateDropdownRef.current.contains(target) &&
          !target.closest('[data-dropdown="date"]')) {
        setDateDropdownOpen(false);
      }
      
      if (guestsDropdownOpen && 
          guestsDropdownRef.current && 
          !guestsDropdownRef.current.contains(target) &&
          !target.closest('[data-dropdown="guests"]')) {
        setGuestsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [locationDropdownOpen, dateDropdownOpen, guestsDropdownOpen]);

  // Dropdown'ları açma fonksiyonları
  const toggleLocationDropdown = () => {
    setLocationDropdownOpen(!locationDropdownOpen);
    setDateDropdownOpen(false);
    setGuestsDropdownOpen(false);
  };

  const toggleDateDropdown = () => {
    setDateDropdownOpen(!dateDropdownOpen);
    setLocationDropdownOpen(false);
    setGuestsDropdownOpen(false);
  };

  const toggleGuestsDropdown = () => {
    setGuestsDropdownOpen(!guestsDropdownOpen);
    setLocationDropdownOpen(false);
    setDateDropdownOpen(false);
  };

  // Tarih seçme fonksiyonu
  const handleDateSelect = (date: Date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate) || date < selectedStartDate) {
      // Yeni bir tarih aralığı başlat
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      // Tarih aralığını tamamla
      setSelectedEndDate(date);
    }
  };

  // Tarih formatlama
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  // Tarih aralığı formatlama
  const formatDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      const startDay = selectedStartDate.getDate();
      const startMonth = monthNames[selectedStartDate.getMonth()];
      const endDay = selectedEndDate.getDate();
      const endMonth = monthNames[selectedEndDate.getMonth()];
      const endYear = selectedEndDate.getFullYear();
      
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
    } else if (selectedStartDate) {
      return `${formatDate(selectedStartDate)} (Giriş)`;
    }
    return "Tarih Seçin";
  };

  // Tarih geçmiş mi kontrolü
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Bugünün tarihi mi kontrolü
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Tarih aralığında mı kontrolü
  const isInDateRange = (date: Date) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date > selectedStartDate && date <= selectedEndDate;
  };

  // Seçili tarih mi kontrolü
  const isSelectedDate = (date: Date) => {
    if (selectedStartDate && 
        date.getDate() === selectedStartDate.getDate() && 
        date.getMonth() === selectedStartDate.getMonth() && 
        date.getFullYear() === selectedStartDate.getFullYear()) {
      return true;
    }
    
    if (selectedEndDate && 
        date.getDate() === selectedEndDate.getDate() && 
        date.getMonth() === selectedEndDate.getMonth() && 
        date.getFullYear() === selectedEndDate.getFullYear()) {
      return true;
    }
    
    return false;
  };

  // Lokasyon seçme
  const handleLocationSelect = (location: string) => {
    setSearchQuery(location);
    setSelectedLocation(location);
    setLocationDropdownOpen(false);
  };

  // Arama formunun submit edilmesi
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      alert("Lütfen bir lokasyon veya otel adı girin");
      return;
    }
    
    if (!selectedStartDate) {
      alert("Lütfen giriş tarihi seçin");
      return;
    }
    
    console.log("Arama:", {
      lokasyon: searchQuery,
      giriş: selectedStartDate,
      çıkış: selectedEndDate,
      kişi: selectedPersonCount
    });
    
    // Burada arama işlemi yapılacak
  };

  // Takvim oluşturma
  const generateCalendar = (monthIndex: number) => {
    const currentDate = new Date();
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthIndex, 1);
    const month = targetDate.getMonth();
    const year = targetDate.getFullYear();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Haftanın hangi günü ile başlıyor (0: Pazar, 1: Pazartesi, ..., 6: Cumartesi)
    let firstDayOffset = firstDayOfMonth.getDay() - 1; // Pazartesi başlangıç için
    if (firstDayOffset < 0) firstDayOffset = 6; // Pazar günü için
    
    const daysInMonth = lastDayOfMonth.getDate();
    const weeks: Date[][] = [];
    
    let currentWeek: Date[] = [];
    
    // Ayın ilk gününden önceki boşluklar
    for (let i = 0; i < firstDayOffset; i++) {
      currentWeek.push(new Date(year, month, -firstDayOffset + i + 1));
    }
    
    // Ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      currentWeek.push(date);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Ayın son gününden sonraki boşluklar
    if (currentWeek.length > 0) {
      const remainingDays = 7 - currentWeek.length;
      for (let i = 1; i <= remainingDays; i++) {
        currentWeek.push(new Date(year, month + 1, i));
      }
      weeks.push(currentWeek);
    }
    
    return {
      month,
      year,
      weeks
    };
  };

  // Kişi sayısını formatla
  const formatPersonCount = () => {
    let text = `${selectedPersonCount} Yetişkin`;
    
    if (childrenCount > 0) {
      text += `, ${childrenCount} Çocuk`;
    }
    
    if (infantCount > 0) {
      text += `, ${infantCount} Bebek`;
    }
    
    return text;
  };

  // Lokasyon Modal'ını oluştur
  const renderLocationModal = () => {
    if (locationDropdownOpen && isBrowser) {
      return createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4 animate-fadeInBg">
          <div 
            ref={locationDropdownRef}
            className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-zoomIn"
          >
            <div className="flex justify-between items-center border-b border-gray-100 p-4">
              <h3 className="font-semibold text-xl text-gray-800">Konum Seçin</h3>
              <button 
                type="button" 
                className="p-2 rounded-full hover:bg-gray-100" 
                onClick={() => setLocationDropdownOpen(false)}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <input
                    type="text"
                    className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Şehir veya otel adı yazın"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">Popüler Destinasyonlar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {locations.map((location) => (
                    <div 
                      key={location.name}
                      className="flex items-center p-3 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors border border-gray-100 shadow-sm"
                      onClick={() => handleLocationSelect(location.name)}
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                        <Image 
                          src={location.image} 
                          alt={location.name} 
                          width={64} 
                          height={64} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{location.name}</p>
                        <p className="text-sm text-gray-500">{location.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Önerilen Aramalar</h3>
                <div className="space-y-2">
                  {searchSuggestions.map((suggestion, index) => (
                    <button 
                      key={index}
                      type="button" 
                      className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 text-left"
                      onClick={() => handleLocationSelect(suggestion)}
                    >
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      <span className="text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      );
    }
    return null;
  };

  // Tarih Modal'ını oluştur
  const renderDateModal = () => {
    if (dateDropdownOpen && isBrowser) {
      return createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4 animate-fadeInBg">
          <div 
            ref={dateDropdownRef}
            className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto animate-zoomIn"
          >
            <div className="flex justify-between items-center border-b border-gray-100 p-4">
              <h3 className="font-semibold text-xl text-gray-800">Tarih Seçin</h3>
              <button 
                type="button" 
                className="p-2 rounded-full hover:bg-gray-100" 
                onClick={() => setDateDropdownOpen(false)}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <button 
                  type="button" 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
                  disabled={currentMonth === 0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                
                <h3 className="font-medium text-gray-800">
                  {monthNames[generateCalendar(currentMonth).month]} {generateCalendar(currentMonth).year}
                </h3>
                
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                  onClick={() => setCurrentMonth(currentMonth + 1)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                <div className="text-sm font-medium text-gray-500">Pt</div>
                <div className="text-sm font-medium text-gray-500">Sa</div>
                <div className="text-sm font-medium text-gray-500">Ça</div>
                <div className="text-sm font-medium text-gray-500">Pe</div>
                <div className="text-sm font-medium text-gray-500">Cu</div>
                <div className="text-sm font-medium text-gray-500">Ct</div>
                <div className="text-sm font-medium text-gray-500">Pa</div>
              </div>
              
              <div className="mb-6">
                {generateCalendar(currentMonth).weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.map((date, dayIndex) => {
                      const isCurrentMonth = date.getMonth() === generateCalendar(currentMonth).month;
                      const isPast = isPastDate(date);
                      const isTodayDate = isToday(date);
                      const isSelected = isSelectedDate(date);
                      const isInRange = isInDateRange(date);
                      
                      return (
                        <button
                          key={dayIndex}
                          type="button"
                          disabled={isPast || !isCurrentMonth}
                          onClick={() => handleDateSelect(date)}
                          className={`h-10 w-full flex items-center justify-center rounded-md text-sm transition-all ${
                            !isCurrentMonth ? 'text-gray-300 cursor-not-allowed' :
                            isPast ? 'text-gray-300 cursor-not-allowed' :
                            isSelected ? 'bg-blue-600 text-white font-medium' :
                            isInRange ? 'bg-blue-100 text-blue-800' :
                            isTodayDate ? 'border border-blue-300 font-medium text-blue-600' :
                            'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <button
                  type="button"
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    setSelectedStartDate(null);
                    setSelectedEndDate(null);
                  }}
                >
                  Temizle
                </button>
                
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                  onClick={() => setDateDropdownOpen(false)}
                >
                  Uygula
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      );
    }
    return null;
  };

  // Kişi Sayısı Modal'ını oluştur
  const renderGuestsModal = () => {
    if (guestsDropdownOpen && isBrowser) {
      const totalGuests = selectedPersonCount + childrenCount + infantCount;
      
      return createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4 animate-fadeInBg">
          <div 
            ref={guestsDropdownRef}
            className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto animate-zoomIn"
          >
            <div className="flex justify-between items-center border-b border-gray-100 p-5">
              <div>
                <h3 className="font-semibold text-xl text-gray-800">Misafir Bilgileri</h3>
                <p className="text-sm text-gray-500 mt-1">Konaklayacak kişi sayısını ve yaş gruplarını seçin</p>
              </div>
              <button 
                type="button" 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors" 
                onClick={() => setGuestsDropdownOpen(false)}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {/* Toplam Kişi Sayacı */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100 flex items-center justify-between">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  <div>
                    <p className="text-sm text-blue-700">Toplam {totalGuests} kişi</p>
                    <p className="text-xs text-blue-600 mt-1">Odalarımız, seçilen kişi sayısına uygun olarak filtrelenir.</p>
                  </div>
                </div>
                <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center text-lg font-bold text-blue-600 border border-blue-200">
                  {totalGuests}
                </div>
              </div>

              {/* Oda Bilgilendirmesi */}
              <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-100">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Önemli Bilgi</p>
                    <p className="mt-1">Bebekler için her zaman ücretsiz konaklama seçeneği sunulmaktadır. Çocuklar için indirimli tarifeler uygulanır.</p>
                  </div>
                </div>
              </div>

              {/* Yetişkin sayısı seçimi - Artırma/Azaltma kontrolleri ile */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">Yetişkinler</h4>
                    <p className="text-sm text-gray-500">13 yaş ve üzeri</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => {
                        if (selectedPersonCount > 1) {
                          setSelectedPersonCount(selectedPersonCount - 1);
                        }
                      }}
                      disabled={selectedPersonCount <= 1}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedPersonCount <= 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <span className="w-12 text-center font-medium text-lg text-black">{selectedPersonCount}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        if (selectedPersonCount < 10) {
                          setSelectedPersonCount(selectedPersonCount + 1);
                        }
                      }}
                      disabled={selectedPersonCount >= 10}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedPersonCount >= 10 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Çocuk Sayısı Seçimi */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">Çocuklar</h4>
                    <p className="text-sm text-gray-500">2-12 yaş arası</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => {
                        if (childrenCount > 0) {
                          setChildrenCount(childrenCount - 1);
                        }
                      }}
                      disabled={childrenCount <= 0}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        childrenCount <= 0 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <span className="w-12 text-center font-medium text-lg text-black">{childrenCount}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        if (childrenCount < 6) {
                          setChildrenCount(childrenCount + 1);
                        }
                      }}
                      disabled={childrenCount >= 6}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        childrenCount >= 6 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bebek Sayısı Seçimi */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">Bebekler</h4>
                    <p className="text-sm text-gray-500">0-2 yaş arası</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => {
                        if (infantCount > 0) {
                          setInfantCount(infantCount - 1);
                        }
                      }}
                      disabled={infantCount <= 0}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        infantCount <= 0 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <span className="w-12 text-center font-medium text-lg text-black">{infantCount}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        if (infantCount < 4) {
                          setInfantCount(infantCount + 1);
                        }
                      }}
                      disabled={infantCount >= 4}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        infantCount >= 4 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hızlı Seçim Butonları */}
              <div className="border-t border-gray-100 pt-5 mb-5">
                <h4 className="font-medium text-gray-700 mb-3">Hızlı Seçim</h4>
                <div className="grid grid-cols-3 gap-3">
                  {personOptions.map((option) => (
                    <button
                      key={option.count}
                      type="button"
                      onClick={() => {
                        setSelectedPersonCount(option.count);
                      }}
                      className={`py-2 px-3 rounded-lg text-center transition-colors border ${
                        selectedPersonCount === option.count 
                          ? 'bg-blue-100 text-blue-700 border-blue-200 font-medium' 
                          : 'hover:bg-gray-50 text-gray-700 border-gray-100'
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Uygula Butonu */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setGuestsDropdownOpen(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Seçimi Uygula ({totalGuests} Kişi)</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      );
    }
    return null;
  };

  return (
    <section className="relative mt-16 md:mt-0 min-h-[600px] h-[90vh] max-h-[900px] w-full overflow-hidden">
      {/* Arka Plan Görselleri */}
      <div className="absolute inset-0 w-full h-full">
        {placeholderImages.map((image, index) => (
          <div 
            key={index} 
            className={`absolute inset-0 w-full h-full transition-opacity duration-2000 ease-in-out ${
              index === activeBackground ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image} 
              alt={`Türkiye'nin güzelliklerini keşfedin ${index + 1}`}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover object-center filter brightness-[0.85]" 
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Hero İçeriği */}
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <div className="w-full text-center text-white animate-fadeIn">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight leading-tight">
            Türkiye'nin En İyi <span className="text-blue-400">Tatil Deneyimleri</span>
          </h1>
            <p className="text-lg md:text-xl text-center max-w-3xl mx-auto mb-8 text-white/90">
            Benzersiz otel konaklamaları, özel turlar ve unutulmaz deneyimler için sizin yanınızdayız.
          </p>
        </div>
        
        {/* Öne Çıkan Promosyonlar */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 animate-slideUp delay-300">
          {promotions.map((promo) => (
            <div 
              key={promo.id}
              className={`${promo.color} rounded-full px-4 py-1.5 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer shadow-md`}
            >
              <span className="font-bold">{promo.discount}</span>
              <span className="text-sm">{promo.title} | {promo.expiry}</span>
            </div>
          ))}
        </div>
      
          {/* Render the modals */}
          {renderLocationModal()}
          {renderDateModal()}
          {renderGuestsModal()}

          {/* Arama Formu */}
        <div className="w-full max-w-5xl animate-zoomIn" style={{ animationDelay: '0.5s' }}>
          <form 
            ref={searchFormRef}
            onSubmit={handleSearch} 
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Lokasyon Seçimi */}
              <div className="flex-1 relative border-b md:border-b-0 md:border-r border-gray-200">
                <button
                  type="button"
                  data-dropdown="location"
                  onClick={toggleLocationDropdown}
                  className="w-full h-full text-left p-5 flex items-start hover:bg-blue-50/50 transition-colors"
                >
                  <div className="mr-3 rounded-full p-2 bg-blue-50 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm font-medium">Nereye gidiyorsunuz?</p>
                    <p className="mt-1 text-gray-800 font-medium">
                      {selectedLocation || "Şehir veya otel adı yazın"}
                    </p>
                  </div>
                </button>
                </div>
              
              {/* Tarih Seçimi */}
              <div className="flex-1 relative border-b md:border-b-0 md:border-r border-gray-200">
                <button
                  type="button"
                  data-dropdown="date"
                  onClick={toggleDateDropdown}
                  className="w-full h-full text-left p-5 flex items-start hover:bg-blue-50/50 transition-colors"
                >
                  <div className="mr-3 rounded-full p-2 bg-blue-50 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Tarihler</p>
                    <p className="mt-1 text-gray-800 font-medium">
                      {formatDateRange()}
                    </p>
                  </div>
                </button>
                </div>
              
              {/* Kişi Sayısı */}
              <div className="relative md:w-[180px]">
                <button
                  type="button"
                  data-dropdown="guests"
                  onClick={toggleGuestsDropdown}
                  className="w-full h-full flex items-center p-5 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="mr-3 rounded-full p-2 bg-blue-50 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Kişi</p>
                    <p className="mt-1 text-gray-800 font-medium">{formatPersonCount()}</p>
                  </div>
                </button>
                </div>
              
              {/* Arama Butonu */}
              <div className="p-3 md:p-0">
                <button 
                  type="submit" 
                  className="w-full md:h-full md:px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-none py-3 font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  <span>Ara</span>
                </button>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    </section>
  );
} 