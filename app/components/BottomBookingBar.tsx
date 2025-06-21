'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { 
  CalendarDaysIcon, 
  UserIcon,
  ArrowRightIcon, 
  CheckCircleIcon,
  ChevronUpIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CalendarIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface TourDateAgeRange {
  id: string;
  minAge: number;
  maxAge: number | null;
  pricingType: 'free' | 'half' | 'percentage' | 'fixed';
  value: number;
}

interface TourDate {
  id: string;
  startDate: Date;
  endDate: Date;
  price: number;
  availableSeats: number;
  ageRanges: TourDateAgeRange[];
  earlyBirdDiscount?: number;
  earlyBirdDeadline?: string;
  lastMinuteDiscount?: number;
  lastMinuteStart?: string;
  minParticipants?: number;
}

interface Tour {
  id: string;
  name: string;
  price: number;
  discount: number | null;
  tourDates: TourDate[];
}

export interface ActivityDateAgeRange {
  id: string;
  minAge: number;
  maxAge: number | null;
  pricingType: 'free' | 'half' | 'percentage' | 'fixed';
  value: number;
}

export interface ActivityDate {
  id: string;
  startDate: Date;
  endDate: Date;
  price: number;
  availableSeats: number;
  ageRanges?: ActivityDateAgeRange[];
}

interface Activity {
  id: string;
  name: string;
  price: number;
  activityDates: ActivityDate[];
  ageRestriction?: string;
}

interface Props {
  tour?: Tour;
  activity?: Activity;
  onDateSelect?: (date: TourDate | ActivityDate | null) => void;
  onParticipantsChange?: (participants: { [key: string]: number } | { total: number }) => void;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  selectedDate?: TourDate | ActivityDate | null;
  forceVisible?: boolean;
}

export default function BottomBookingBar({ 
  tour, 
  activity,
  onDateSelect, 
  onParticipantsChange,
  isExpanded = false,
  onExpandedChange,
  selectedDate: initialSelectedDate = null,
  forceVisible = false
}: Props) {
  const [visible, setVisible] = useState(forceVisible)
  const [expanded, setExpanded] = useState(false)
  const [currentSelectedDate, setCurrentSelectedDate] = useState<TourDate | ActivityDate | null>(initialSelectedDate)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Tour specific state
  const [selectedDateAgeRanges, setSelectedDateAgeRanges] = useState<TourDateAgeRange[]>([])
  const [participants, setParticipants] = useState<{ [key: string]: number }>({})
  
  // Activity specific state
  const [activityParticipantCount, setActivityParticipantCount] = useState<number>(1);

  const data = useMemo(() => tour || activity, [tour, activity]);
  const entityType = useMemo(() => (tour ? 'tour' : 'activity'), [tour]);
  const dates = useMemo(() => entityType === 'tour' ? tour!.tourDates : activity!.activityDates, [tour, activity, entityType]);
  
  useEffect(() => { setCurrentSelectedDate(initialSelectedDate); }, [initialSelectedDate]);
  
  useEffect(() => {
    // If the parent wants it expanded (i.e., on mount),
    // we use a short delay to allow the CSS transition to fire correctly.
    if (isExpanded) {
      const timer = setTimeout(() => {
        setExpanded(true);
      }, 50); // A minimal delay is enough
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (forceVisible) { setVisible(true); return; }
    const handleScroll = () => {
      const shouldBeVisible = window.scrollY > 400;
      setVisible(shouldBeVisible);
      if (!shouldBeVisible && expanded) {
        setExpanded(false);
        onExpandedChange?.(false);
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [expanded, onExpandedChange, forceVisible]);

  const fetchAgeRanges = async (dateId: string) => {
    if (entityType !== 'tour') return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/tour-dates/${dateId}/age-ranges`);
      if (!response.ok) throw new Error('Yaş aralıkları getirilemedi');
      setSelectedDateAgeRanges(await response.json());
    } catch (err) {
      setError('Yaş aralıkları yüklenirken bir hata oluştu');
      setSelectedDateAgeRanges([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentSelectedDate && entityType === 'tour') {
      fetchAgeRanges(currentSelectedDate.id);
    } else {
      setSelectedDateAgeRanges([]);
    }
  }, [currentSelectedDate, entityType]);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const availableDates = useMemo(() => {
    return (dates || [])
      .filter(date => new Date(date.startDate) >= today)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [dates, today]);
  
  const formatPrice = (price: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
  const checkDiscounts = useCallback((date: TourDate | ActivityDate) => {
    const hasEarlyBird = 'earlyBirdDeadline' in date && 'earlyBirdDiscount' in date;
    const hasLastMinute = 'lastMinuteStart' in date && 'lastMinuteDiscount' in date;
    return {
      hasEarlyBirdDiscount: hasEarlyBird && (date as TourDate).earlyBirdDiscount && new Date((date as TourDate).earlyBirdDeadline!) >= today,
      hasLastMinuteDiscount: hasLastMinute && (date as TourDate).lastMinuteDiscount && new Date((date as TourDate).lastMinuteStart!) <= today
    };
  }, [today]);
  
  const calculatePriceForRange = (basePrice: number, range: TourDateAgeRange) => {
    switch (range.pricingType) {
      case 'free':
        return 0;
      case 'half':
        return basePrice * 0.5;
      case 'percentage':
        return basePrice * (1 - (range.value / 100));
      case 'fixed':
        return basePrice;
      default:
        return basePrice;
    }
  };

  const getPriceDisplayText = (range: TourDateAgeRange, basePrice: number, originalPrice: number) => {
    const hasDiscount = basePrice !== originalPrice;
    
    switch (range.pricingType) {
      case 'free':
        return 'Ücretsiz';
      case 'half': {
        const finalPrice = basePrice * 0.5;
        return hasDiscount 
          ? `%50 İndirimli (${formatPrice(originalPrice * 0.5)} ₺ yerine ${formatPrice(finalPrice)} ₺)`
          : `%50 İndirimli (${formatPrice(finalPrice)} ₺)`;
      }
      case 'percentage': {
        const finalPrice = basePrice * (1 - range.value / 100);
        return hasDiscount
          ? `%${range.value} İndirimli (${formatPrice(originalPrice * (1 - range.value / 100))} ₺ yerine ${formatPrice(finalPrice)} ₺)`
          : `%${range.value} İndirimli (${formatPrice(finalPrice)} ₺)`;
      }
      case 'fixed':
        return hasDiscount
          ? `${formatPrice(originalPrice)} ₺ yerine ${formatPrice(basePrice)} ₺`
          : `${formatPrice(basePrice)} ₺`;
      default:
        return '';
    }
  };

  function formatAgeRange(minAge: number, maxAge: number | null): string {
    if (maxAge === null) {
      return `${minAge}+`;
    }
    return `${minAge}-${maxAge}`;
  }

  const handleExpandClick = () => {
    // We are closing the bar, so trigger animation then notify parent
    if (expanded) {
      setExpanded(false);
      setTimeout(() => {
        onExpandedChange?.(false);
      }, 700); // Duration matches the transition duration
    } else if (onExpandedChange) {
      onExpandedChange(true);
    }
  };

  const handleDateSelect = (date: TourDate | ActivityDate | null) => {
    setCurrentSelectedDate(date);
    onDateSelect?.(date);
    if (entityType === 'activity') {
      setActivityParticipantCount(1);
      onParticipantsChange?.({ total: 1 });
    } else {
      setParticipants({});
      onParticipantsChange?.({});
    }
  };
  const handleTourParticipantChange = (ageRangeId: string, delta: number) => {
    if (!currentSelectedDate) return;
    const newCount = (participants[ageRangeId] || 0) + delta;
    const newParticipants = { ...participants, [ageRangeId]: Math.max(0, newCount) };
    const total = Object.values(newParticipants).reduce((sum, count) => sum + count, 0);
    if (total <= currentSelectedDate.availableSeats) {
      setParticipants(newParticipants);
      onParticipantsChange?.(newParticipants);
    }
  };
  const handleActivityParticipantChange = (delta: number) => {
    const newCount = activityParticipantCount + delta;
    if (newCount < 1) return;
    if (currentSelectedDate && newCount > currentSelectedDate.availableSeats) return;
    setActivityParticipantCount(newCount);
    onParticipantsChange?.({ total: newCount });
  };

  const totalPrice = useMemo(() => {
    if (!currentSelectedDate) return 0;
    if (entityType === 'activity') {
      return activityParticipantCount * currentSelectedDate.price;
    }
    // Tour price calculation...
    const { hasEarlyBirdDiscount, hasLastMinuteDiscount } = checkDiscounts(currentSelectedDate);
    let basePrice = currentSelectedDate.price;
    // ... apply discounts ...
    return Object.entries(participants).reduce((total, [rangeId, count]) => {
      const range = selectedDateAgeRanges.find(r => r.id === rangeId);
      return total + (range ? calculatePriceForRange(basePrice, range) * count : 0);
    }, 0);
  }, [currentSelectedDate, entityType, activityParticipantCount, participants, selectedDateAgeRanges]);
  
  const renderDatePickerColumn = () => (
    <div className="bg-white rounded-xl p-4 border border-neutral-200/70 flex flex-col h-full">
      <h3 className="text-base font-semibold text-neutral-800 mb-3 flex items-center flex-shrink-0">
        <CalendarIcon className="w-5 h-5 mr-2 text-sky-600" />
        Tarih Seçin
      </h3>
      <div className="grid grid-cols-1 gap-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100 scrollbar-thumb-rounded-full flex-grow pr-1">
        {availableDates.length > 0 ? (
          availableDates.map((date) => (
            <button
              key={date.id} type="button" onClick={() => handleDateSelect(date)}
              className={`flex flex-col p-3 text-left rounded-lg transition-all duration-200 ease-out border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 ${currentSelectedDate?.id === date.id ? 'bg-sky-100 border-sky-600 shadow-sm' : 'bg-white border-neutral-200 hover:bg-neutral-50'}`}
            >
              <span className="text-sm font-medium text-neutral-800">{format(new Date(date.startDate), 'd MMMM yyyy', { locale: tr })}</span>
              <span className="text-xs text-neutral-600 block mt-0.5">{format(new Date(date.startDate), 'eeee')}</span>
              <span className="text-sm font-medium text-sky-700 mt-1">{formatPrice(date.price)} / kişi</span>
              {date.availableSeats <= 10 && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 mt-2">Son {date.availableSeats} koltuk!</span>}
            </button>
          ))
        ) : <p className="text-sm text-neutral-500 text-center py-8">Müsait tarih bulunmuyor.</p>}
      </div>
    </div>
  );

  const renderActivityParticipantPicker = () => (
    <div className="bg-white rounded-xl p-4 border border-neutral-200/70 flex flex-col h-full">
        <h3 className="text-base font-semibold text-neutral-800 mb-3 flex items-center flex-shrink-0">
            <UserIcon className="w-5 h-5 mr-2 text-emerald-600" />
            Kişi Sayısı
        </h3>
        <div className="flex-grow flex flex-col justify-center items-center">
             <div className="flex items-center gap-4">
                <button onClick={() => handleActivityParticipantChange(-1)} className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-neutral-800 bg-white border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={activityParticipantCount <= 1}><span className="text-2xl">-</span></button>
                <span className="text-3xl font-bold w-16 text-center text-gray-900">{activityParticipantCount}</span>
                <button onClick={() => handleActivityParticipantChange(1)} className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-neutral-800 bg-white border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors disabled:opacity-50" disabled={!!currentSelectedDate && activityParticipantCount >= currentSelectedDate.availableSeats}><span className="text-2xl">+</span></button>
            </div>
        </div>
        <div className="mt-4 border-t border-neutral-200 pt-3">
            <h4 className="text-sm font-semibold text-neutral-700 mb-2 flex items-center">
                <InformationCircleIcon className="w-4 h-4 mr-2 text-sky-600"/>
                Aktivite Kuralı
            </h4>
            <div className="flex items-start text-sm text-neutral-600">
                <p>
                    {activity?.ageRestriction === '18+'
                        ? 'Bu aktiviteye katılım için 18 yaşından büyük olmak gerekmektedir.'
                        : 'Bu aktivite her yaş için uygundur.'
                    }
                </p>
            </div>
        </div>
    </div>
  );
  
  const renderTourParticipantPicker = () => {
    if (isLoading) {
      return (
        <div className="bg-white rounded-xl p-4 border border-neutral-200/70 flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-white rounded-xl p-4 border border-neutral-200/70 flex flex-col justify-center items-center h-full text-center">
          <ExclamationCircleIcon className="w-10 h-10 text-red-500 mb-2" />
          <p className="text-sm font-semibold text-neutral-700">Bir Hata Oluştu</p>
          <p className="text-xs text-neutral-500">{error}</p>
        </div>
      );
    }
    
    if (selectedDateAgeRanges.length === 0) {
      return (
        <div className="bg-white rounded-xl p-4 border border-neutral-200/70 flex flex-col justify-center items-center h-full text-center">
          <InformationCircleIcon className="w-10 h-10 text-sky-500 mb-2" />
          <p className="text-sm font-semibold text-neutral-700">Katılımcı Bilgisi Yok</p>
          <p className="text-xs text-neutral-500">Bu tarih için özel yaş aralığı veya katılımcı türü bulunmamaktadır.</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl p-4 border border-neutral-200/70 flex flex-col h-full">
        <h3 className="text-base font-semibold text-neutral-800 mb-3 flex items-center flex-shrink-0">
          <UserIcon className="w-5 h-5 mr-2 text-emerald-600" />
          Kişi Sayısı
        </h3>
        <div className="flex-grow flex flex-col justify-center items-center">
              <div className="flex items-center gap-4">
                <button onClick={() => handleTourParticipantChange(selectedDateAgeRanges[0].id, -1)} disabled={(participants[selectedDateAgeRanges[0].id] || 0) <= 0} className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-neutral-800 bg-white border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><span className="text-2xl">-</span></button>
                <span className="text-3xl font-bold w-16 text-center text-gray-900">{participants[selectedDateAgeRanges[0].id] || 0}</span>
                <button onClick={() => handleTourParticipantChange(selectedDateAgeRanges[0].id, 1)} disabled={!currentSelectedDate || (Object.values(participants).reduce((a, b) => a + b, 0)) >= currentSelectedDate.availableSeats} className="w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-neutral-800 bg-white border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors disabled:opacity-50"><span className="text-2xl">+</span></button>
              </div>
        </div>
      </div>
    );
  };

  const renderAdvantagesColumn = () => (
    <div className="bg-indigo-50/40 rounded-xl p-4 border border-indigo-200/50 flex flex-col h-full">
       <h3 className="text-base font-semibold text-neutral-800 mb-3 flex items-center flex-shrink-0">
         <CheckCircleIcon className="w-5 h-5 mr-2 text-indigo-600" />
         Avantajlarınız
       </h3>
       <ul className="space-y-2.5 flex-grow content-start">
         {["Ücretsiz iptal imkanı", "Anında onay", "Özel rehber eşliğinde", "7/24 müşteri desteği"].map((item, index) => (
           <li key={index} className="flex items-start text-sm text-neutral-700">
             <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
             <span>{item}</span>
           </li>
         ))}
       </ul>
    </div>
  );

  if (!visible && !forceVisible) return null;
  
  return (
    <>
      <button 
        onClick={handleExpandClick}
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-white text-neutral-700 rounded-t-lg px-5 py-2.5 shadow-md border border-b-0 border-neutral-200/80 flex items-center gap-2 transition-all duration-300 ease-out hover:shadow-lg hover:bg-neutral-50 ${visible && !expanded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
      >
        <span className="text-sm font-semibold">Tarih ve Fiyat Seçenekleri</span>
        <ChevronUpIcon className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <div 
        id="booking-panel"
        className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-neutral-200/80 shadow-lg z-40 transition-transform duration-700 ease-out ${visible && expanded ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ height: 'auto', maxHeight: '85vh' }}
      >
        <div className="container mx-auto px-4 py-6 h-full flex flex-col">
          <button onClick={handleExpandClick} className="absolute top-3 right-3 p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full z-10"><XMarkIcon className="w-5 h-5" /></button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-grow overflow-hidden mb-4 pt-6" style={{minHeight: '300px'}}>
            {renderDatePickerColumn()}
            {entityType === 'tour' ? renderTourParticipantPicker() : renderActivityParticipantPicker()}
            {renderAdvantagesColumn()}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-3 border-t border-neutral-200/80 flex-shrink-0">
             <div className="flex-1 pr-4 text-center sm:text-left">
                <span className="text-2xl font-bold text-sky-700">{formatPrice(totalPrice)}</span>
                <span className="text-neutral-500 text-sm ml-2">toplam fiyat</span>
             </div>
             <div className="flex gap-3 items-center flex-shrink-0">
                <p className="text-sm text-neutral-600 font-medium hidden md:block">{currentSelectedDate ? format(new Date(currentSelectedDate.startDate), 'd MMMM yyyy') : 'Tarih seçilmedi'}</p>
                <Link href="/checkout" className={`inline-flex items-center justify-center px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm ${!currentSelectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <span>Rezervasyon Yap</span>
                </Link>
             </div>
          </div>
        </div>
      </div>
    </>
  )
} 