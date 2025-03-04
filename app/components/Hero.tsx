"use client";

import { useState, useEffect, useRef } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState("promo1");
  
  // Tarih state'leri
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPersonPicker, setShowPersonPicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Mart");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [checkInDate, setCheckInDate] = useState<{day: number, month: string, year: number} | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<{day: number, month: string, year: number} | null>(null);
  const [dateSelectionStage, setDateSelectionStage] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [selectedPersonCount, setSelectedPersonCount] = useState(2);
  
  // Bugünün tarihini al
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = monthNames[today.getMonth()];
  const currentYear = today.getFullYear();
  
  // Referanslar - dışarı tıklama işlemleri için
  const datePickerRef = useRef<HTMLDivElement>(null);
  const personPickerRef = useRef<HTMLDivElement>(null);

  // Client-side rendering kontrolü için useEffect
  useEffect(() => {
    // Slider için interval
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % placeholderImages.length);
    }, 6000);

    // Dışarı tıklama işlemleri için event listener
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (personPickerRef.current && !personPickerRef.current.contains(event.target as Node)) {
        setShowPersonPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Arama işlemi
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic
    console.log(`Searching for: ${searchQuery}`);
    console.log(`Check-in date: ${checkInDate ? `${checkInDate.day} ${checkInDate.month} ${checkInDate.year}` : 'Not selected'}`);
    console.log(`Check-out date: ${checkOutDate ? `${checkOutDate.day} ${checkOutDate.month} ${checkOutDate.year}` : 'Not selected'}`);
    console.log(`Person count: ${selectedPersonCount}`);
    setShowSuggestions(false);
  };

  // Tarih seçimi
  const handleDateSelect = (date: number) => {
    if (dateSelectionStage === 'checkIn') {
      // Giriş tarihi seçimi
      setCheckInDate({
        day: date,
        month: selectedMonth,
        year: selectedYear
      });
      // Çıkış tarihi seçimine geç
      setDateSelectionStage('checkOut');
    } else {
      // Çıkış tarihi seçimi, giriş tarihinden önce olamaz
      const checkInOption = dateOptions.find(option => option.month === checkInDate?.month && option.year === checkInDate?.year);
      const checkInIdx = checkInOption ? checkInOption.dates.indexOf(checkInDate!.day) : -1;
      const currentOption = dateOptions.find(option => option.month === selectedMonth && option.year === selectedYear);
      const currentIdx = currentOption ? dateOptions.indexOf(currentOption) : -1;
      
      // Aynı ay içinde ve seçilen gün, giriş gününden küçükse seçilemez
      if (selectedMonth === checkInDate?.month && selectedYear === checkInDate?.year && date <= checkInDate.day) {
        // Minimum 1 gün sonrası için çıkış tarihi ayarla
        if (date === checkInDate.day) {
          // Aynı gün seçilirse, bir sonraki günü oto seç
          const nextDayIndex = checkInOption?.dates.indexOf(checkInDate.day) ?? 0;
          if (nextDayIndex < (checkInOption?.dates.length ?? 0) - 1) {
            // Aynı ay içinde bir sonraki gün
            setCheckOutDate({
              day: checkInOption?.dates[nextDayIndex + 1] ?? 1,
              month: selectedMonth,
              year: selectedYear
            });
          } else if (currentIdx < dateOptions.length - 1) {
            // Sonraki ayın ilk günü
            const nextMonth = dateOptions[currentIdx + 1];
            setCheckOutDate({
              day: nextMonth.dates[0],
              month: nextMonth.month,
              year: nextMonth.year
            });
            setSelectedMonth(nextMonth.month);
            setSelectedYear(nextMonth.year);
          }
        }
        return;
      }
      
      // Geçerli bir çıkış tarihi
      setCheckOutDate({
        day: date,
        month: selectedMonth,
        year: selectedYear
      });
      
      // Tarih seçimi tamamlandı, dropdown'u kapat
      setTimeout(() => {
        setShowDatePicker(false);
        setDateSelectionStage('checkIn'); // Bir sonraki açılışta tekrar giriş tarihi seçimiyle başla
      }, 300);
    }
  };

  // Giriş-çıkış tarihlerini temizle
  const clearDates = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
    setDateSelectionStage('checkIn');
  };

  // Tarih formatlama
  const formatDate = (date: {day: number, month: string, year: number} | null) => {
    if (!date) return "";
    return `${date.day} ${date.month} ${date.year}`;
  };

  // Seçili tarih aralığını formatlar
  const formatSelectedDateRange = () => {
    if (checkInDate && checkOutDate) {
      return `${checkInDate.day} ${checkInDate.month} - ${checkOutDate.day} ${checkOutDate.month} ${checkOutDate.year}`;
    } else if (checkInDate) {
      return `${formatDate(checkInDate)} (Giriş)`;
    }
    return "Tarih Seçin";
  };

  // Tarih aynı mı kontrolü (gün, ay, yıl karşılaştırması)
  const isSameDate = (date1: {day: number, month: string, year: number} | null, date2: {day: number, month: string, year: number} | null) => {
    if (!date1 || !date2) return false;
    return date1.day === date2.day && date1.month === date2.month && date1.year === date2.year;
  };

  // Giriş ve çıkış tarihleri arasında mı kontrolü
  const isInRange = (day: number, month: string, year: number) => {
    if (!checkInDate || !checkOutDate) return false;
    
    // Tarih objelerini oluştur
    const date = new Date(year, monthNames.indexOf(month), day);
    const start = new Date(checkInDate.year, monthNames.indexOf(checkInDate.month), checkInDate.day);
    const end = new Date(checkOutDate.year, monthNames.indexOf(checkOutDate.month), checkOutDate.day);
    
    // Aralıkta mı kontrol et (başlangıç tarihi hariç, bitiş tarihi dahil)
    return date > start && date <= end;
  };

  // Tarih geçmiş mi kontrolü
  const isPastDate = (day: number, month: string, year: number) => {
    const date = new Date(year, monthNames.indexOf(month), day);
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayWithoutTime;
  };

  // Bugünün tarihi mi kontrolü
  const isToday = (day: number, month: string, year: number) => {
    return day === currentDay && month === currentMonth && year === currentYear;
  };

  // Kişi sayısını formatlar
  const formatPersonCount = () => {
    const option = personOptions.find(option => option.count === selectedPersonCount);
    return option ? option.text : "2 Kişi";
  };

  return (
    <section className="relative bg-gradient-to-b from-blue-900 to-blue-800 text-white overflow-hidden">
      {/* Arka plan görseli */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src={placeholderImages[activeIndex]}
          alt="Background"
          fill
          className="object-cover object-center transition-opacity duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-blue-800/80"></div>
      </div>

      {/* Hero içeriği */}
      <div className="container relative z-10 px-4 pt-24 pb-12 md:pt-32 md:pb-24">
        {/* Üst Fırsat Bandı */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-4 no-scrollbar">
          {promotions.map((promo) => (
            <div 
              key={promo.id}
              onClick={() => setSelectedPromotion(promo.id)}
              className={`flex-shrink-0 px-5 py-3 rounded-full cursor-pointer transition-all 
                ${selectedPromotion === promo.id 
                  ? `${promo.color} shadow-lg` 
                  : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center ${selectedPromotion === promo.id ? 'text-white' : 'text-white/80'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                  </svg>
                  <span className="font-medium ml-1">{promo.title}</span>
                </div>
                <div className="h-5 w-px bg-white/30"></div>
                <span className={`font-bold ${selectedPromotion === promo.id ? 'text-white' : 'text-white/80'}`}>{promo.discount}</span>
                <div className="h-5 w-px bg-white/30"></div>
                <span className={`text-sm ${selectedPromotion === promo.id ? 'text-white/90' : 'text-white/60'}`}>{promo.expiry}</span>
              </div>
            </div>
          ))}
          <Link href="/promotions" className="flex-shrink-0 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center gap-2 text-sm transition-all">
            Tüm Fırsatlar
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      
        {/* Ana Başlık */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            <span className="block">Hayalinizdeki tatil için</span>
            <span className="block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">en iyi fiyat garantisi</span>
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            500'den fazla tur operatörü ve 10.000+ tur seçeneği ile hayalinizdeki tatili %40'a varan indirimlerle keşfedin.
          </p>
        </div>

        {/* Arama formu */}
        <div className="max-w-4xl mx-auto relative z-20 mb-8">
          <form onSubmit={handleSearch} className="bg-white p-2 rounded-xl shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-1 px-3 py-2 md:border-r border-gray-200">
                <label className="block text-xs font-medium text-gray-500 mb-1">Nereye gitmek istersiniz?</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Şehir, bölge veya tur adı"
                    className="w-full text-gray-800 text-lg focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                  />
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50">
                      <ul>
                        {searchSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 flex items-center"
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setShowSuggestions(false);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 mr-2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tarih Select Box'ı (Geliştirilmiş) */}
              <div className="flex-1 px-3 py-2 md:border-r border-gray-200 relative" ref={datePickerRef}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Giriş - Çıkış Tarihi</label>
                <div 
                  className="w-full text-gray-800 text-lg cursor-pointer flex justify-between items-center"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <span className="truncate">{formatSelectedDateRange()}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 text-gray-500 transition-transform ${showDatePicker ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                
                {showDatePicker && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 p-3">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-2">
                        {dateOptions.map((option, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`px-3 py-1 rounded-full text-sm ${selectedMonth === option.month && selectedYear === option.year
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                            onClick={() => {
                              setSelectedMonth(option.month);
                              setSelectedYear(option.year);
                            }}
                          >
                            {option.month}
                          </button>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {dateSelectionStage === 'checkIn' ? 
                          <span className="font-medium text-blue-600">Giriş Tarihi Seçin</span> : 
                          <span className="font-medium text-green-600">Çıkış Tarihi Seçin</span>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].map((day, idx) => (
                        <div key={idx} className="text-xs text-center font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}
                      
                      {/* Boşluk bırakarak doğru gün hizalaması */}
                      {(() => {
                        const currentOption = dateOptions.find(option => option.month === selectedMonth && option.year === selectedYear);
                        const offset = currentOption ? currentOption.firstDayOffset : 0;
                        
                        // Offset kadar boş hücre ekle
                        return Array.from({ length: offset }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="p-1"></div>
                        ));
                      })()}
                      
                      {/* Günleri göster */}
                      {dateOptions.find(option => option.month === selectedMonth && option.year === selectedYear)?.dates.map((date, idx) => {
                        // Geçmiş tarih kontrolü
                        const isPast = isPastDate(date, selectedMonth, selectedYear);
                        // Bugünün tarihi kontrolü
                        const isCurrentDay = isToday(date, selectedMonth, selectedYear);
                        // Giriş tarihi mi kontrolü
                        const isCheckIn = checkInDate && date === checkInDate.day && selectedMonth === checkInDate.month && selectedYear === checkInDate.year;
                        // Çıkış tarihi mi kontrolü
                        const isCheckOut = checkOutDate && date === checkOutDate.day && selectedMonth === checkOutDate.month && selectedYear === checkOutDate.year;
                        // Giriş ile çıkış arasında mı kontrolü
                        const isRange = isInRange(date, selectedMonth, selectedYear);
                        
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={isPast}
                            className={`p-1 text-sm rounded-md hover:bg-blue-50 relative
                              ${isPast ? 'text-gray-400 bg-gray-50 cursor-not-allowed hover:bg-gray-50' : 'cursor-pointer'} 
                              ${isCheckIn ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                              ${isCheckOut ? 'bg-green-600 text-white hover:bg-green-700' : ''}
                              ${isRange ? 'bg-blue-100' : ''}
                              ${isCurrentDay && !isCheckIn && !isCheckOut ? 'font-bold border border-blue-400' : ''}
                            `}
                            onClick={() => !isPast && handleDateSelect(date)}
                          >
                            {date}
                            {isCurrentDay && !isCheckIn && !isCheckOut && (
                              <div className="absolute w-1 h-1 bg-blue-500 rounded-full bottom-0.5 left-1/2 transform -translate-x-1/2"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="mt-3 flex justify-between">
                      <button
                        type="button"
                        className="text-sm text-gray-500 hover:text-gray-800 flex items-center"
                        onClick={clearDates}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Tarihleri Temizle
                      </button>
                      <button
                        type="button"
                        className="text-sm text-blue-600 font-medium hover:text-blue-800"
                        onClick={() => {
                          if (!checkInDate) {
                            // Eğer tarih seçilmediyse, bugünün tarihini giriş tarihi olarak seç
                            setCheckInDate({
                              day: currentDay,
                              month: currentMonth,
                              year: currentYear
                            });
                            setDateSelectionStage('checkOut');
                          } else if (dateSelectionStage === 'checkOut' && !checkOutDate) {
                            // Çıkış tarihi seçilmediyse, giriş tarihinden bir gün sonrasını seç
                            const checkInDate = new Date(selectedYear, monthNames.indexOf(selectedMonth), currentDay);
                            checkInDate.setDate(checkInDate.getDate() + 1);
                            setCheckOutDate({
                              day: checkInDate.getDate(),
                              month: monthNames[checkInDate.getMonth()],
                              year: checkInDate.getFullYear()
                            });
                            setShowDatePicker(false);
                            setDateSelectionStage('checkIn');
                          } else {
                            setShowDatePicker(false);
                            setDateSelectionStage('checkIn');
                          }
                        }}
                      >
                        Tamam
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Kişi Sayısı Select Box'ı (Geliştirilmiş) */}
              <div className="flex-initial px-3 py-2 relative" ref={personPickerRef}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Kişi Sayısı</label>
                <div 
                  className="w-full text-gray-800 text-lg cursor-pointer flex justify-between items-center"
                  onClick={() => setShowPersonPicker(!showPersonPicker)}
                >
                  <span>{formatPersonCount()}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 text-gray-500 transition-transform ${showPersonPicker ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                
                {showPersonPicker && (
                  <div className="absolute top-full right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 p-2 min-w-[150px]">
                    <ul>
                      {personOptions.map((option, idx) => (
                        <li
                          key={idx}
                          className={`px-3 py-2 rounded-md flex items-center justify-between cursor-pointer ${
                            selectedPersonCount === option.count 
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-800 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            setSelectedPersonCount(option.count);
                            // Otomatik olarak kapat
                            setTimeout(() => setShowPersonPicker(false), 300);
                          }}
                        >
                          <span className="flex items-center">
                            {option.count <= 5 && (
                              <>
                                {[...Array(option.count)].map((_, i) => (
                                  <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                  </svg>
                                ))}
                              </>
                            )}
                            {option.count > 5 && (
                              <>
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                  </svg>
                                ))}
                                <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-1.5 py-0.5">+</span>
                              </>
                            )}
                            <span className="ml-2">{option.text}</span>
                          </span>
                          
                          {selectedPersonCount === option.count && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-4 font-medium flex items-center justify-center whitespace-nowrap transition-all cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                Ara
              </button>
            </div>
          </form>

          {/* Hızlı fırsat butonları */}
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            <Link 
              href="/tours/last-minute" 
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Son Dakika Fırsatları
            </Link>
            <Link 
              href="/tours/summer" 
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
              Yaz Turları
            </Link>
            <Link 
              href="/tours/family" 
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              Aile Turları
            </Link>
            <Link 
              href="/tours/exclusive" 
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              VIP Turlar
            </Link>
          </div>
        </div>

        {/* Öne çıkan satış kartları */}
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
          <div className="bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl p-5 flex flex-col items-center text-center max-w-xs md:max-w-sm mx-auto md:mx-0 shadow-xl transform hover:scale-105 transition-all">
            <div className="bg-white/20 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2">En İyi Fiyat Garantisi</h3>
            <p className="text-white/90 mb-4">Aynı turu daha ucuza bulursanız, aradaki farkı iade ediyoruz!</p>
            <Link href="/price-guarantee" className="bg-white text-red-600 hover:bg-white/90 font-medium py-2 px-4 rounded-lg mt-auto flex items-center">
              Detaylı Bilgi
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          
          <div className="bg-gradient-to-tr from-blue-500 to-violet-600 rounded-xl p-5 flex flex-col items-center text-center max-w-xs md:max-w-sm mx-auto md:mx-0 shadow-xl transform hover:scale-105 transition-all">
            <div className="bg-white/20 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-2">İptal Güvencesi</h3>
            <p className="text-white/90 mb-4">48 saat öncesine kadar ücretsiz iptal ve değişiklik imkanı!</p>
            <Link href="/cancellation-policy" className="bg-white text-blue-600 hover:bg-white/90 font-medium py-2 px-4 rounded-lg mt-auto flex items-center">
              Detaylı Bilgi
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Lokasyonlar */}
      <div className="container px-4 pb-16 md:pb-24 relative z-10">
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          {locations.map((location, index) => (
            <Link
              href={`/tours/${location.name.toLowerCase()}`}
              key={index}
              className="relative min-w-[260px] h-32 rounded-xl overflow-hidden flex-shrink-0 group"
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="font-bold text-xl text-white">{location.name}</h3>
                <p className="text-sm text-white/80">{location.description}</p>
              </div>
            </Link>
          ))}
          <Link
            href="/destinations"
            className="flex items-center justify-center min-w-[120px] h-32 rounded-xl bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/30 flex-shrink-0 group transition-all"
          >
            <div className="text-center">
              <span className="font-semibold text-white block mb-1">Tüm Destinasyonlar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mx-auto text-white/70 group-hover:text-white transition-all"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
} 