'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

interface CalendarProps {
  selectedDate: string;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  label: string;
}

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export function Calendar({
  selectedDate,
  onChange,
  minDate,
  maxDate,
  isOpen,
  onClose,
  triggerRef,
  label
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Takvim günlerini hesapla
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Ayın ilk günü
    const firstDay = new Date(year, month, 1);
    // Ayın son günü
    const lastDay = new Date(year, month + 1, 0);
    
    // Haftanın hangi gününden başlayacağını belirle (0: Pazar, 1: Pazartesi, ..., 6: Cumartesi)
    // Türkiye'de hafta Pazartesi'den başlar, bu yüzden 1'i baz alıyoruz
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek === -1) firstDayOfWeek = 6; // Pazar günü için
    
    // Önceki ayın son günlerini ekle
    const prevMonthDays = [];
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      prevMonthDays.push(date);
    }
    
    // Mevcut ayın günlerini ekle
    const currentMonthDays = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      currentMonthDays.push(date);
    }
    
    // Sonraki ayın ilk günlerini ekle (6 satır x 7 gün = 42 gün olacak şekilde)
    const nextMonthDays = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 42 - totalDays;
    
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      nextMonthDays.push(date);
    }
    
    setCalendarDays([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);
  }, [currentMonth]);
  
  // Dışarı tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current && 
        !calendarRef.current.contains(event.target as Node) &&
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, triggerRef]);
  
  // Önceki aya git
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Sonraki aya git
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Tarih seçildiğinde
  const handleDateSelect = (date: Date) => {
    // Tarihi YYYY-MM-DD formatına çevir (saat dilimi sorunlarını önlemek için)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    onChange(formattedDate);
    onClose();
  };
  
  // Tarih seçilebilir mi kontrol et
  const isDateSelectable = (date: Date) => {
    // Tarihi YYYY-MM-DD formatına çevir (saat dilimi sorunlarını önlemek için)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Minimum tarih kontrolü
    if (minDate && dateStr < minDate) {
      return false;
    }
    
    // Maksimum tarih kontrolü
    if (maxDate && dateStr > maxDate) {
      return false;
    }
    
    // Seçilebilir
    return true;
  };
  
  // Tarih giriş tarihi mi kontrol et (çıkış tarihi seçiminde)
  const isCheckInDate = (date: Date) => {
    // Eğer minDate varsa ve bu bir çıkış tarihi seçimi ise
    if (minDate && label.includes('Çıkış')) {
      // Tarihi YYYY-MM-DD formatına çevir
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      // minDate ile aynı tarih mi kontrol et (giriş tarihi)
      return dateStr === minDate.split('T')[0];
    }
    
    return false;
  };
  
  // Tarih seçili mi kontrol et
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    
    // Tarihi YYYY-MM-DD formatına çevir (saat dilimi sorunlarını önlemek için)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return dateStr === selectedDate;
  };
  
  // Tarih mevcut ayda mı kontrol et
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };
  
  // Bugün mü kontrol et
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  if (!isOpen) return null;
  
  // Portal kullanarak takvimi render et
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-labelledby={`${label}-calendar`}
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={calendarRef}
        className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id={`${label}-calendar`} className="text-lg font-semibold text-gray-900">
            {label}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Ay ve yıl navigasyonu */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="text-lg font-medium text-gray-900">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          
          <button
            type="button"
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        {/* Haftanın günleri */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Takvim günleri */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const selectable = isDateSelectable(date);
            const selected = isDateSelected(date);
            const currentMonth = isCurrentMonth(date);
            const today = isToday(date);
            
            return (
              <button
                key={index}
                type="button"
                disabled={!selectable || isCheckInDate(date)}
                onClick={() => selectable && handleDateSelect(date)}
                className={cn(
                  "h-10 w-full rounded-full flex items-center justify-center text-sm relative",
                  !currentMonth && "text-gray-400",
                  currentMonth && !selected && !today && !isCheckInDate(date) && "text-gray-900",
                  today && !selected && !isCheckInDate(date) && "bg-blue-50 text-blue-600",
                  selected && "bg-blue-600 text-white",
                  isCheckInDate(date) && "bg-green-100 text-green-800 border border-green-300",
                  selectable && !selected && !isCheckInDate(date) && "hover:bg-gray-100",
                  !selectable && "opacity-50 cursor-not-allowed bg-gray-100"
                )}
              >
                {date.getDate()}
                {isCheckInDate(date) && (
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-green-800 whitespace-nowrap">
                    Giriş Tarihi
                  </span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Bugüne git butonu */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              
              // Bugünün tarihini YYYY-MM-DD formatına çevir
              const year = today.getFullYear();
              const month = String(today.getMonth() + 1).padStart(2, '0');
              const day = String(today.getDate()).padStart(2, '0');
              const formattedToday = `${year}-${month}-${day}`;
              
              if (isDateSelectable(today)) {
                handleDateSelect(today);
              } else {
                setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
              }
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Bugüne Git
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
} 