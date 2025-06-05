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
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface TourDateAgeRange {
  id: string;
  minAge: number;
  description: string;
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

interface Props {
  tour: Tour;
  onDateSelect?: (date: TourDate | null) => void;
  onParticipantsChange?: (participants: { [key: string]: number }) => void;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  selectedDate?: TourDate | null;
}

export default function BottomBookingBar({ 
  tour, 
  onDateSelect, 
  onParticipantsChange,
  isExpanded = false,
  onExpandedChange,
  selectedDate: initialSelectedDate = null
}: Props) {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(isExpanded)
  const [currentSelectedDate, setCurrentSelectedDate] = useState<TourDate | null>(initialSelectedDate)
  const [personCount, setPersonCount] = useState<number | string>(1)
  const [ageGroups, setAgeGroups] = useState<{ age: number; count: number }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDateAgeRanges, setSelectedDateAgeRanges] = useState<TourDateAgeRange[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [participants, setParticipants] = useState<{ [key: string]: number }>({})
  
  useEffect(() => {
    setCurrentSelectedDate(initialSelectedDate);
  }, [initialSelectedDate]);

  useEffect(() => {
    setExpanded(isExpanded);
  }, [isExpanded]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true)
      } else {
        setVisible(false)
        if (expanded) {
          setExpanded(false);
          onExpandedChange?.(false);
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [expanded, onExpandedChange])
  
  // En düşük fiyatlı tur tarihini bul
  const lowestPricedDate = tour.tourDates?.reduce((lowest, current) => {
    if (!lowest || current.price < lowest.price) {
      return current;
    }
    return lowest;
  }, null as TourDate | null);

  const price = lowestPricedDate?.price || tour.price;
  const discountedPrice = tour.discount && price 
    ? price * (1 - (tour.discount / 100))
    : price;

  const primaryButtonClasses = "inline-flex items-center justify-center px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out";
  const secondaryButtonClasses = "inline-flex items-center justify-center px-6 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.98] duration-150 ease-out";

  const formatSelectedDate = (dateString: string | null) => {
    if (!dateString) return 'Tarih seçilmedi';
    try {
      return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    } catch (error) {
      return 'Geçersiz tarih';
    }
  };

  const totalPeople = typeof personCount === 'number' ? personCount : parseInt(personCount, 10) || 1;

  // Seçilen tarihin fiyatını bul
  const selectedDatePrice = currentSelectedDate 
    ? currentSelectedDate.price
    : price;

  const selectedDateDiscountedPrice = tour.discount && selectedDatePrice
    ? selectedDatePrice * (1 - (tour.discount / 100))
    : selectedDatePrice;

  // Seçilen tarihin yaş aralıklarını bul
  const fetchAgeRanges = async (dateId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/tour-dates/${dateId}/age-ranges`);
      if (!response.ok) {
        throw new Error('Yaş aralıkları getirilemedi');
      }
      const data = await response.json();
      setSelectedDateAgeRanges(data);
    } catch (err) {
      setError('Yaş aralıkları yüklenirken bir hata oluştu');
      console.error('Yaş aralıkları getirilemedi:', err);
      setSelectedDateAgeRanges([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Tarih seçildiğinde yaş aralıklarını getir
  useEffect(() => {
    if (currentSelectedDate) {
      fetchAgeRanges(currentSelectedDate.id);
    } else {
      setSelectedDateAgeRanges([]);
    }
  }, [currentSelectedDate]);

  // Mevcut tarihi normalize et
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Kullanılabilir tarihleri filtrele
  const availableTourDates = useMemo(() => {
    return tour.tourDates
      .filter((date) => {
        const startDate = new Date(date.startDate);
        startDate.setHours(0, 0, 0, 0);
        return startDate >= today;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [tour.tourDates, today]);

  // Erken rezervasyon ve son dakika indirimlerini kontrol et
  const checkDiscounts = useCallback((date: TourDate) => {
    const earlyBirdDeadline = date.earlyBirdDeadline ? new Date(date.earlyBirdDeadline) : null;
    const lastMinuteStart = date.lastMinuteStart ? new Date(date.lastMinuteStart) : null;

    if (earlyBirdDeadline) earlyBirdDeadline.setHours(0, 0, 0, 0);
    if (lastMinuteStart) lastMinuteStart.setHours(0, 0, 0, 0);

    return {
      hasEarlyBirdDiscount: date.earlyBirdDiscount && earlyBirdDeadline && today <= earlyBirdDeadline,
      hasLastMinuteDiscount: date.lastMinuteDiscount && lastMinuteStart && today >= lastMinuteStart
    };
  }, [today]);

  // Fiyat hesaplama yardımcı fonksiyonu
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

  // Toplam fiyat hesaplama fonksiyonu
  const calculateTotalPrice = () => {
    if (!currentSelectedDate) return 0;
    
    let total = 0;
    const { hasEarlyBirdDiscount, hasLastMinuteDiscount } = checkDiscounts(currentSelectedDate);
    let basePrice = currentSelectedDate.price;

    // Early Bird veya Last Minute indirimi uygula
    if (hasEarlyBirdDiscount && currentSelectedDate.earlyBirdDiscount) {
      basePrice = basePrice * (1 - (currentSelectedDate.earlyBirdDiscount / 100));
    } else if (hasLastMinuteDiscount && currentSelectedDate.lastMinuteDiscount) {
      basePrice = basePrice * (1 - (currentSelectedDate.lastMinuteDiscount / 100));
    }
    
    selectedDateAgeRanges.forEach((range) => {
      const count = participants[range.id] || 0;
      if (count === 0) return;

      const priceForRange = calculatePriceForRange(basePrice, range);
      total += priceForRange * count;
    });

    return total;
  };

  // Fiyat formatlama yardımcı fonksiyonu
  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    }).replace(/,/g, '.');
  };

  // Yaş aralığı için fiyat gösterim metni
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

  // Bottom bar alt kısmındaki fiyat gösterimini güncelle
  const renderParticipantPrices = () => {
    if (!currentSelectedDate) return null;

    const { hasEarlyBirdDiscount, hasLastMinuteDiscount } = checkDiscounts(currentSelectedDate);
    let basePrice = currentSelectedDate.price;

    if (hasEarlyBirdDiscount && currentSelectedDate.earlyBirdDiscount) {
      basePrice = basePrice * (1 - (currentSelectedDate.earlyBirdDiscount / 100));
    } else if (hasLastMinuteDiscount && currentSelectedDate.lastMinuteDiscount) {
      basePrice = basePrice * (1 - (currentSelectedDate.lastMinuteDiscount / 100));
    }

    return selectedDateAgeRanges.map((range) => {
      const count = participants[range.id] || 0;
      if (count === 0) return null;

      const priceForRange = calculatePriceForRange(basePrice, range);

      return (
        <div key={range.id} className="text-xs text-neutral-600 flex justify-between">
          <span>{range.description} ({count} kişi)</span>
          <span>{(priceForRange * count).toLocaleString('tr-TR')} ₺</span>
        </div>
      );
    });
  };

  // Tarih seçimi işleyicisi
  const handleDateSelect = (date: TourDate | null) => {
    setCurrentSelectedDate(date);
    setAgeGroups([]); // Yeni tarih seçildiğinde yaş gruplarını sıfırla
    setShowDatePicker(false);
    // Katılımcı sayılarını sıfırla
    const newParticipants: { [key: string]: number } = {};
    date?.ageRanges.forEach(range => {
      newParticipants[range.id] = 0;
    });
    setParticipants(newParticipants);
    onDateSelect?.(date);
    onParticipantsChange?.(newParticipants);
  };

  // Yaş grubu değişikliği işleyicisi
  const handleAgeGroupChange = (age: number, count: number) => {
    if (!currentSelectedDate) return;

    // Toplam kişi sayısını kontrol et
    const currentTotal = ageGroups.reduce((sum, group) => {
      if (group.age !== age) {
        return sum + group.count;
      }
      return sum;
    }, 0) + count;

    // Kontenjan kontrolü
    if (currentTotal > currentSelectedDate.availableSeats) {
      setError(`Bu tarih için maksimum ${currentSelectedDate.availableSeats} kişi seçebilirsiniz.`);
      return;
    }

    // Minimum katılımcı kontrolü
    if (currentSelectedDate.minParticipants && currentTotal < currentSelectedDate.minParticipants) {
      setError(`Bu tur için minimum ${currentSelectedDate.minParticipants} kişi gereklidir.`);
      return;
    }

    setError(null);
    setAgeGroups(prev => {
      const existing = prev.find(g => g.age === age);
      if (existing) {
        return prev.map(g => g.age === age ? { ...g, count } : g);
      }
      return [...prev, { age, count }];
    });
  };

  const handleParticipantChange = (ageRangeId: string, value: number) => {
    if (!currentSelectedDate) return;

    const newParticipants = { ...participants };
    newParticipants[ageRangeId] = Math.max(0, value);

    // Sadece kontenjan kontrolü yap
    const totalParticipants = Object.values(newParticipants).reduce((sum, count) => sum + count, 0);
    if (totalParticipants <= currentSelectedDate.availableSeats) {
      setParticipants(newParticipants);
      onParticipantsChange?.(newParticipants);
    }
  };

  const handleExpandClick = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onExpandedChange?.(newExpanded);
  };

  return (
    <>
      <button 
        onClick={handleExpandClick}
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-white text-neutral-700 rounded-t-lg px-5 py-2.5 shadow-md border border-b-0 border-neutral-200/80 flex items-center gap-2 transition-all duration-300 ease-out hover:shadow-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 ${!visible && !expanded ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
        aria-expanded={expanded}
        aria-controls="booking-panel"
      >
        <span className="text-sm font-semibold">
          {expanded ? 'Seçenekleri Kapat' : 'Tarih ve Fiyat Seçenekleri'}
        </span>
        <ChevronUpIcon className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <div 
        id="booking-panel"
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200/80 shadow-lg z-40 transition-transform duration-300 ease-out ${expanded && visible ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: 'calc(100vh - 80px)' }}
      >
        <div className="container mx-auto px-4 pt-6 pb-4 h-full flex flex-col relative">
          <button 
            onClick={() => setExpanded(false)}
            className="absolute top-3 right-3 p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500"
            aria-label="Paneli Kapat"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-grow overflow-hidden mb-4 pt-6">
            <div className="bg-white rounded-xl p-4 border border-neutral-200/70 flex flex-col">
              <h3 className="text-base font-semibold text-neutral-800 mb-3 flex items-center flex-shrink-0">
                <CalendarIcon className="w-5 h-5 mr-2 text-sky-600" />
                Tur Tarihini Seçin
              </h3>
              <p className="text-xs text-neutral-600 mb-3 flex-shrink-0">
                {availableTourDates.length > 0 
                  ? 'Müsait tarihler aşağıdadır.'
                  : 'Şu anda müsait tarih bulunmuyor.'}
              </p>
              <div className="grid grid-cols-1 gap-2.5 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100 scrollbar-thumb-rounded-full flex-grow pr-1">
                {availableTourDates.length > 0 ? (
                  availableTourDates.map((date) => {
                    const startDate = new Date(date.startDate);
                    const endDate = new Date(date.endDate);
                    const isLimited = date.availableSeats <= 5;
                    const { hasEarlyBirdDiscount, hasLastMinuteDiscount } = checkDiscounts(date);
                    const isSelected = currentSelectedDate?.id === date.id;

                    return (
                      <button
                        key={date.id}
                        type="button"
                        onClick={() => handleDateSelect(date)}
                        className={`flex flex-col p-3 text-left rounded-lg transition-all duration-200 ease-out
                          ${isSelected 
                            ? 'bg-sky-100 border-sky-600 shadow-sm' 
                            : 'bg-white border-neutral-200 hover:bg-neutral-50'} 
                          border focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-sm font-medium text-neutral-800">
                              {format(startDate, 'd MMMM yyyy', { locale: tr })}
                            </span>
                            <span className="text-xs text-neutral-600 block mt-0.5">
                              {format(startDate, 'd MMMM')} - {format(endDate, 'd MMMM yyyy')}
                            </span>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            {(hasEarlyBirdDiscount || hasLastMinuteDiscount) && (
                              <span className="text-xs line-through text-neutral-500 mb-0.5">
                                {formatPrice(date.price)} ₺
                              </span>
                            )}
                            <span className="text-sm font-medium text-sky-700">
                              {formatPrice(hasEarlyBirdDiscount 
                                ? date.price * (1 - (date.earlyBirdDiscount || 0) / 100)
                                : hasLastMinuteDiscount 
                                  ? date.price * (1 - (date.lastMinuteDiscount || 0) / 100)
                                  : date.price
                              )} ₺
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isLimited ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {isLimited ? `Son ${date.availableSeats} kontenjan!` : `${date.availableSeats} kişilik kontenjan`}
                          </span>
                          {hasEarlyBirdDiscount && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                              Erken Rezervasyon: %{date.earlyBirdDiscount} İndirim
                            </span>
                          )}
                          {hasLastMinuteDiscount && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                              Son Dakika: %{date.lastMinuteDiscount} İndirim
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <CalendarDaysIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-sm text-neutral-500">
                      Şu anda müsait tarih bulunmuyor.
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Lütfen daha sonra tekrar kontrol edin.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-neutral-200/70 flex flex-col">
              <h3 className="text-base font-semibold text-neutral-800 mb-3 flex items-center flex-shrink-0">
                <UserIcon className="w-5 h-5 mr-2 text-emerald-600" />
                Katılımcı Bilgileri
              </h3>
              <p className="text-xs text-neutral-600 mb-3 flex-shrink-0">
                Katılımcıların yaş bilgilerini girin.
              </p>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mb-3"></div>
                  <p className="text-sm text-neutral-500">Yaş aralıkları yükleniyor...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <XMarkIcon className="w-12 h-12 text-red-300 mx-auto mb-3" />
                  <p className="text-sm text-red-600 font-medium">
                    {error}
                  </p>
                  <button
                    onClick={() => currentSelectedDate && fetchAgeRanges(currentSelectedDate.id)}
                    className="mt-3 text-xs text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Tekrar Dene
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                  {selectedDateAgeRanges.length === 0 ? (
                    <div className="text-center py-8">
                      <UserIcon className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-sm text-neutral-500">
                        Katılımcı Bilgileri
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Katılımcıların yaş bilgilerini girin
                      </p>
                    </div>
                  ) : (
                    selectedDateAgeRanges.map((range) => {
                      const { hasEarlyBirdDiscount, hasLastMinuteDiscount } = checkDiscounts(currentSelectedDate);
                      const originalPrice = currentSelectedDate?.price || 0;
                      let basePrice = originalPrice;

                      if (hasEarlyBirdDiscount && currentSelectedDate?.earlyBirdDiscount) {
                        basePrice = basePrice * (1 - (currentSelectedDate.earlyBirdDiscount / 100));
                      } else if (hasLastMinuteDiscount && currentSelectedDate?.lastMinuteDiscount) {
                        basePrice = basePrice * (1 - (currentSelectedDate.lastMinuteDiscount / 100));
                      }

                      return (
                        <div key={range.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors">
                          <div>
                            <span className="text-sm font-medium text-neutral-800">
                              {range.description}
                            </span>
                            <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                              <span className={range.pricingType === 'free' ? 'text-emerald-600' : 'text-sky-600'} style={{ fontWeight: '500' }}>
                                {getPriceDisplayText(range, basePrice, originalPrice)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const currentCount = participants[range.id] || 0;
                                if (currentCount > 0) {
                                  handleParticipantChange(range.id, currentCount - 1);
                                }
                              }}
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-800 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!participants[range.id]}
                            >
                              <span className="text-lg">-</span>
                            </button>
                            <input 
                              type="number" 
                              min="0"
                              value={participants[range.id] || 0}
                              onChange={(e) => handleParticipantChange(range.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center p-1.5 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const currentCount = participants[range.id] || 0;
                                handleParticipantChange(range.id, currentCount + 1);
                              }}
                              className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-neutral-800 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                            >
                              <span className="text-lg">+</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {selectedDateAgeRanges.length > 0 && ageGroups.length > 0 && (
                <div className="mt-4 pt-3 border-t border-neutral-200">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-600">Toplam Katılımcı</span>
                      <span className="font-medium text-neutral-800">
                        {ageGroups.reduce((sum, group) => sum + group.count, 0)} kişi
                      </span>
                    </div>
                    {ageGroups.map(group => {
                      const range = selectedDateAgeRanges.find(r => r.minAge === group.age);
                      if (!range || group.count === 0) return null;
                      
                      let priceText = '';
                      switch (range.pricingType) {
                        case 'free':
                          priceText = 'Ücretsiz';
                          break;
                        case 'half':
                          priceText = `${((selectedDatePrice * 0.5) * group.count).toLocaleString('tr-TR')} ₺`;
                          break;
                        case 'percentage':
                          priceText = `${((selectedDatePrice * (1 - range.value / 100)) * group.count).toLocaleString('tr-TR')} ₺`;
                          break;
                        case 'fixed':
                          priceText = `${(range.value * group.count).toLocaleString('tr-TR')} ₺`;
                          break;
                      }

                      return (
                        <div key={group.age} className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500">
                            {range.description} ({group.count} kişi)
                          </span>
                          <span className="font-medium text-neutral-600">{priceText}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-indigo-50/40 rounded-xl p-4 border border-indigo-200/50 flex flex-col">
              <h3 className="text-base font-semibold text-neutral-800 mb-3 flex items-center flex-shrink-0">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-indigo-600" />
                Avantajlarınız
              </h3>
              <ul className="space-y-2.5 flex-grow content-start">
                {[
                  "Ücretsiz iptal imkanı",
                  "Anında onay",
                  "Özel rehber eşliğinde",
                  "7/24 müşteri desteği"
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-sm text-neutral-700">
                    <CheckCircleIcon className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-center mt-auto pt-2 border-t border-indigo-200/50 flex-shrink-0">
                <p className="text-indigo-700 font-medium text-xs">
                  Ödeme şimdi yapılmayacak
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-3 border-t border-neutral-200/80 flex-shrink-0">
            <div className="flex-1 pr-4 order-2 sm:order-1 text-center sm:text-left">
              {Object.values(participants).some(count => count > 0) ? (
                <>
                  <div className="flex flex-col gap-1 mb-2">
                    {renderParticipantPrices()}
                  </div>
                  <div className="flex items-baseline justify-center sm:justify-start gap-2">
                    <span className="text-2xl font-bold text-sky-700">
                      {formatPrice(calculateTotalPrice())} ₺
                    </span>
                    <span className="text-neutral-500 text-xs">toplam fiyat</span>
                  </div>
                </>
              ) : (
                <div className="text-neutral-500 text-sm">
                  Lütfen katılımcı sayısını seçin
                </div>
              )}
            </div>
            
            <div className="flex gap-3 items-center flex-shrink-0 order-1 sm:order-2">
              <div className="hidden md:flex items-center bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200/80">
                <p className="text-xs text-neutral-600 font-medium">
                  {currentSelectedDate ? `${format(new Date(currentSelectedDate.startDate), 'd MMMM yyyy', { locale: tr })} - ${format(new Date(currentSelectedDate.endDate), 'd MMMM yyyy', { locale: tr })}` : 'Tarih seçilmedi'}
                </p>
              </div>
              
              <button 
                disabled={!currentSelectedDate || Object.values(participants).every(count => count === 0)}
                className={`${primaryButtonClasses} w-full sm:w-auto min-w-[160px] justify-center`}
                onClick={() => console.log('Booking:', { 
                  date: currentSelectedDate, 
                  participants,
                  totalPrice: calculateTotalPrice()
                })}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>{currentSelectedDate ? 'Rezervasyon Yap' : 'Tarih Seçin'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 