'use client';

import { useState, useRef, useEffect, RefObject } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Calendar } from './Calendar';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  placeholder?: string;
}

// window'a özel bir property ekleyeceğimiz için typescript'e bildir
declare global {
  interface Window { __openCalendar__?: any }
}

export function DatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Tarih seçin'
}: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  // Dışarı tıklanınca veya başka bir takvim açılınca popup'ı kapat
  // useEffect(() => {
  //   if (!isCalendarOpen) return;
  //   const handleClick = (event: MouseEvent) => {
  //     if (
  //       triggerRef.current &&
  //       !triggerRef.current.contains(event.target as Node)
  //     ) {
  //       setIsCalendarOpen(false);
  //     }
  //   };
  //   window.addEventListener('mousedown', handleClick);
  //   return () => {
  //     window.removeEventListener('mousedown', handleClick);
  //   };
  // }, [isCalendarOpen]);
  
  // Tarihi formatla
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    
    // Tarih string'ini parçalara ayır (YYYY-MM-DD)
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Yeni bir tarih oluştur (saat dilimi sorunlarını önlemek için)
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const handleCloseCalendar = () => setIsCalendarOpen(false);
  
  return (
    <div className="relative z-30">
      <label htmlFor={`date-${label}`} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div
        ref={triggerRef}
        className={`relative rounded-lg border ${
          disabled 
            ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
            : 'bg-white border-gray-300 cursor-pointer hover:border-blue-500'
        } transition-colors`}
        onClick={() => {
          if (!disabled) {
            setIsCalendarOpen(true);
          }
        }}
      >
        <div className="flex items-center px-3 py-2">
          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
          <input
            type="text"
            id={`date-${label}`}
            readOnly
            disabled={disabled}
            value={formatDisplayDate(value)}
            placeholder={placeholder}
            className={`block w-full border-0 p-0 focus:ring-0 text-sm ${
              disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'
            }`}
          />
        </div>
        <input 
          type="hidden" 
          name={`date-${label}-hidden`} 
          value={value} 
        />
      </div>
      <div style={{ position: 'relative', zIndex: 99999, pointerEvents: 'auto' }}>
        <Calendar
          selectedDate={value}
          onChange={onChange}
          minDate={minDate}
          maxDate={maxDate}
          isOpen={isCalendarOpen}
          onClose={handleCloseCalendar}
          triggerRef={triggerRef as RefObject<HTMLDivElement>}
          label={label}
        />
      </div>
    </div>
  );
} 