'use client';

import { useState, useRef } from 'react';
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
  const triggerRef = useRef<HTMLDivElement | null>(null);
  
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
  
  return (
    <div className="relative">
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
        onClick={() => !disabled && setIsCalendarOpen(true)}
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
        
        {/* Gizli input (form gönderimi için) */}
        <input 
          type="hidden" 
          name={`date-${label}-hidden`} 
          value={value} 
        />
      </div>
      
      <Calendar
        selectedDate={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        triggerRef={triggerRef}
        label={label}
      />
    </div>
  );
} 