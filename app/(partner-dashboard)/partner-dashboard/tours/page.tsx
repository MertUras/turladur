'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import TourDateModal from '@/app/components/partner-dashboard/TourDateModal';
import ConfirmDialog from '@/app/components/partner-dashboard/ConfirmDialog';

interface TourDate {
  id: string;
  startDate: Date;
  endDate: Date;
  price: number;
  availableSeats: number;
  earlyBirdDiscount?: number;
  lastMinuteDiscount?: number;
  earlyBirdDeadlineStart?: Date;
  earlyBirdDeadline?: Date;
  lastMinuteStart?: Date;
  lastMinuteStartEnd?: Date;
  minParticipants?: number;
  maxParticipants?: number;
  notes?: string;
  status?: string;
  isActive?: boolean;
}

interface Tour {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  discount: number | null;
  maxParticipants: number | null;
  destinations: string[];
  departureCity: string | null;
  images: string[];
  tourDates: TourDate[];
  tourOperator: {
    id: string;
    companyName: string;
    logo: string | null;
  };
}

export default function PartnerToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTour, setExpandedTour] = useState<string | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<TourDate | null>(null);
  const [statusConfirm, setStatusConfirm] = useState<{
    tourId: string;
    dateId: string;
    tourName: string;
    startDate: Date;
    endDate: Date;
    action: 'complete' | 'cancel';
  } | null>(null);
  const [statusActionLoading, setStatusActionLoading] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'authenticated') {
      fetchTours();
      return;
    }
    setLoading(false);
    setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.');
  }, [status]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/partner/tours', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Turlar yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      console.log('API response - tours:', data);
      console.log('First tour dates:', data[0]?.tourDates);
      setTours(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    if (!confirm('Bu turu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/partner/tours/${tourId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Tur silinirken bir hata oluştu');
      }

      setTours(tours.filter(tour => tour.id !== tourId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const toggleTourDates = (tourId: string) => {
    setExpandedTour(expandedTour === tourId ? null : tourId);
  };

  const handleAddDate = (tourId: string) => {
    setSelectedTour(tourId);
    setSelectedDate(null);
    setIsDateModalOpen(true);
  };

  const handleEditDate = (tourId: string, date: TourDate) => {
    console.log('=== EDIT DATE DEBUG ===');
    console.log('Tour ID:', tourId);
    console.log('Selected date object:', date);
    console.log('Date ID:', date.id);
    console.log('Start Date:', date.startDate);
    console.log('End Date:', date.endDate);
    console.log('Price:', date.price);
    console.log('Available Seats:', date.availableSeats);
    console.log('Early Bird Discount:', date.earlyBirdDiscount);
    console.log('Last Minute Discount:', date.lastMinuteDiscount);
    console.log('Early Bird Deadline Start:', date.earlyBirdDeadlineStart);
    console.log('Early Bird Deadline:', date.earlyBirdDeadline);
    console.log('Last Minute Start:', date.lastMinuteStart);
    console.log('Last Minute Start End:', date.lastMinuteStartEnd);
    console.log('Min Participants:', date.minParticipants);
    console.log('Max Participants:', date.maxParticipants);
    console.log('Notes:', date.notes);
    console.log('======================');
    
    setSelectedTour(tourId);
    setSelectedDate(date);
    setIsDateModalOpen(true);
  };

  const isDateTerminal = (status?: string) =>
    status === 'COMPLETED' || status === 'CANCELLED';

  const getDateStatusBadge = (status?: string) => {
    if (status === 'COMPLETED') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          Tamamlandı
        </span>
      );
    }
    if (status === 'CANCELLED') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
          İptal Edildi
        </span>
      );
    }
    return null;
  };

  const formatDateRange = (startDate: Date, endDate: Date) =>
    `${new Date(startDate).toLocaleDateString('tr-TR')} - ${new Date(endDate).toLocaleDateString('tr-TR')}`;

  const openDateStatusConfirm = (
    tour: Tour,
    date: TourDate,
    action: 'complete' | 'cancel'
  ) => {
    setStatusConfirm({
      tourId: tour.id,
      dateId: date.id,
      tourName: tour.name,
      startDate: date.startDate,
      endDate: date.endDate,
      action,
    });
  };

  const closeDateStatusConfirm = () => {
    if (statusActionLoading) return;
    setStatusConfirm(null);
  };

  const executeDateStatusAction = async () => {
    if (!statusConfirm) return;

    const { tourId, dateId, action } = statusConfirm;

    try {
      setStatusActionLoading(true);
      const response = await fetch(`/api/partner/tours/${tourId}/dates/${dateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Tur tarihi güncellenirken bir hata oluştu');
      }

      const result = await response.json();
      const updatedDate = result.tourDate;

      setTours((prev) =>
        prev.map((tour) => {
          if (tour.id !== tourId) return tour;
          return {
            ...tour,
            tourDates: tour.tourDates.map((date) =>
              date.id === dateId
                ? {
                    ...date,
                    status: updatedDate.status,
                    isActive: updatedDate.isActive,
                  }
                : date
            ),
          };
        })
      );
      setStatusConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setStatusActionLoading(false);
    }
  };

  const handleDeleteDate = async (tourId: string, dateId: string) => {
    if (!confirm('Bu tarihi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/partner/tours/${tourId}/dates/${dateId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Tarih silinirken bir hata oluştu');
      }

      // Turları güncelle
      setTours(tours.map(tour => {
        if (tour.id === tourId) {
          return {
            ...tour,
            tourDates: tour.tourDates.filter(date => date.id !== dateId)
          };
        }
        return tour;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const handleDateSubmit = async (data: {
    startDate: string;
    endDate: string;
    price: number;
    availableSeats: number;
    earlyBirdDiscount?: number;
    lastMinuteDiscount?: number;
    earlyBirdDeadlineStart?: string;
    earlyBirdDeadlineEnd?: string;
    lastMinuteStartStart?: string;
    lastMinuteStartEnd?: string;
    minParticipants?: number;
    maxParticipants?: number;
    notes?: string;
  }) => {
    if (!selectedTour) return;

    try {
      const url = selectedDate
        ? `/api/partner/tours/${selectedTour}/dates/${selectedDate.id}`
        : `/api/partner/tours/${selectedTour}/dates`;
      
      const response = await fetch(url, {
        method: selectedDate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(selectedDate ? 'Tarih güncellenirken bir hata oluştu' : 'Tarih eklenirken bir hata oluştu');
      }

      const updatedDate = await response.json();

      // Turları güncelle
      setTours(tours.map(tour => {
        if (tour.id === selectedTour) {
          return {
            ...tour,
            tourDates: selectedDate
              ? tour.tourDates.map(date => (date.id === selectedDate.id ? updatedDate : date))
              : [...tour.tourDates, updatedDate]
          };
        }
        return tour;
      }));

      setIsDateModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hata</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchTours}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turlarım</h1>
          <p className="text-gray-600">Tüm turlarınızı buradan yönetebilirsiniz</p>
        </div>
        <Link
          href="/partner-dashboard/tours/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Tur Ekle
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between bg-white rounded-lg shadow p-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tur ara..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="ml-4 flex items-center space-x-4">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filtrele
              </button>
              <button
                onClick={fetchTours}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
          </div>
        </div>

      <div className="grid grid-cols-1 gap-6">
              {tours.map((tour) => (
          <div key={tour.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 relative">
                      {tour.images && tour.images.length > 0 && tour.images[0] ? (
                        <Image
                          src={tour.images[0]}
                          alt={tour.name}
                          fill
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-lg font-medium">
                            {tour.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{tour.name}</h2>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        {tour.departureCity && (
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {tour.departureCity}
                          </div>
                        )}
                        {tour.maxParticipants && (
                          <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-1" />
                            {tour.maxParticipants} kişi
                          </div>
                        )}
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {tour.price} ₺'den başlayan
                      </div>
                      </div>
                    </div>
                    </div>
                    </div>
                <div className="flex items-center space-x-2">
                      <Link
                        href={`/partner-dashboard/tours/${tour.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                      >
                    <EyeIcon className="h-4 w-4 mr-1.5" />
                    İncele
                      </Link>
                      <Link
                        href={`/partner-dashboard/tours/${tour.id}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                      >
                    <PencilSquareIcon className="h-4 w-4 mr-1.5" />
                    Düzenle
                      </Link>
                      <button
                        onClick={() => handleDeleteTour(tour.id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <TrashIcon className="h-4 w-4 mr-1.5" />
                    Sil
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => toggleTourDates(tour.id)}
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  {expandedTour === tour.id ? (
                    <ChevronUpIcon className="h-5 w-5 mr-1" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 mr-1" />
                  )}
                  Tur Tarihleri ({tour.tourDates.length})
                </button>
              </div>
              {expandedTour === tour.id && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Tur Tarihleri</h3>
                    <button
                      onClick={() => handleAddDate(tour.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-1.5" />
                      Yeni Tarih
                    </button>
                  </div>
                  {tour.tourDates && tour.tourDates.length > 0 ? (
                    <div className="space-y-4">
                      {tour.tourDates.map((date) => {
                        const terminal = isDateTerminal(date.status);
                        return (
                        <div key={date.id} className="flex items-center justify-between bg-white p-4 rounded-md border border-gray-200">
                          <div className="flex items-center space-x-4">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900">
                                  {new Date(date.startDate).toLocaleDateString('tr-TR')} - {new Date(date.endDate).toLocaleDateString('tr-TR')}
                                </p>
                                {getDateStatusBadge(date.status)}
                              </div>
                              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                <span>{date.availableSeats} kişilik kontenjan</span>
                                <span>{date.price} ₺</span>
                                {date.earlyBirdDiscount && date.earlyBirdDiscount > 0 && (
                                  <span className="text-green-600">%{date.earlyBirdDiscount} Erken Rezervasyon</span>
                                )}
                                {date.lastMinuteDiscount && date.lastMinuteDiscount > 0 && (
                                  <span className="text-orange-600">%{date.lastMinuteDiscount} Son Dakika</span>
                                )}
                              </div>
                              {(date.earlyBirdDeadlineStart || date.earlyBirdDeadline || date.lastMinuteStart || date.lastMinuteStartEnd) && (
                                <div className="mt-1 text-xs text-gray-400">
                                  {date.earlyBirdDeadlineStart && date.earlyBirdDeadline && (
                                    <span>Erken Rez: {new Date(date.earlyBirdDeadlineStart).toLocaleDateString('tr-TR')} - {new Date(date.earlyBirdDeadline).toLocaleDateString('tr-TR')}</span>
                                  )}
                                  {date.lastMinuteStart && date.lastMinuteStartEnd && (
                                    <span className="ml-2">Son Dakika: {new Date(date.lastMinuteStart).toLocaleDateString('tr-TR')} - {new Date(date.lastMinuteStartEnd).toLocaleDateString('tr-TR')}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!terminal && (
                              <>
                                <button
                                  onClick={() => openDateStatusConfirm(tour, date, 'complete')}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                                  Tamamlandı
                                </button>
                                <button
                                  onClick={() => openDateStatusConfirm(tour, date, 'cancel')}
                                  className="inline-flex items-center px-2.5 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <XCircleIcon className="h-4 w-4 mr-1" />
                                  İptal
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleEditDate(tour.id, date)}
                              disabled={terminal}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <PencilSquareIcon className="h-4 w-4 mr-1" />
                              Düzenle
                            </button>
                            <button
                              onClick={() => handleDeleteDate(tour.id, date.id)}
                              disabled={terminal}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Sil
                            </button>
                          </div>
                        </div>
                      );})}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Henüz tur tarihi eklenmemiş</p>
                      <button
                        onClick={() => handleAddDate(tour.id)}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                      >
                        <PlusIcon className="h-4 w-4 mr-1.5" />
                        Tarih Ekle
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(() => {
        console.log('=== MODAL RENDER DEBUG ===');
        console.log('selectedDate:', selectedDate);
        console.log('isDateModalOpen:', isDateModalOpen);
        
        const modalInitialData = selectedDate ? {
          startDate: new Date(selectedDate.startDate).toISOString().split('T')[0],
          endDate: new Date(selectedDate.endDate).toISOString().split('T')[0],
          price: selectedDate.price,
          availableSeats: selectedDate.availableSeats,
          earlyBirdDiscount: selectedDate.earlyBirdDiscount,
          lastMinuteDiscount: selectedDate.lastMinuteDiscount,
          earlyBirdDeadlineStart: selectedDate.earlyBirdDeadlineStart ? new Date(selectedDate.earlyBirdDeadlineStart).toISOString().split('T')[0] : '',
          earlyBirdDeadlineEnd: selectedDate.earlyBirdDeadline ? new Date(selectedDate.earlyBirdDeadline).toISOString().split('T')[0] : '',
          lastMinuteStartStart: selectedDate.lastMinuteStart ? new Date(selectedDate.lastMinuteStart).toISOString().split('T')[0] : '',
          lastMinuteStartEnd: selectedDate.lastMinuteStartEnd ? new Date(selectedDate.lastMinuteStartEnd).toISOString().split('T')[0] : '',
          minParticipants: selectedDate.minParticipants,
          maxParticipants: selectedDate.maxParticipants,
          notes: selectedDate.notes
        } : undefined;

        console.log('Modal initialData:', modalInitialData);
        console.log('Modal title:', selectedDate ? 'Tur Tarihini Düzenle' : 'Yeni Tur Tarihi Ekle');
        console.log('Modal isEditMode:', !!selectedDate);
        console.log('==========================');

        return (
          <TourDateModal
            isOpen={isDateModalOpen}
            onClose={() => setIsDateModalOpen(false)}
            onSubmit={handleDateSubmit}
            initialData={modalInitialData}
            title={selectedDate ? 'Tur Tarihini Düzenle' : 'Yeni Tur Tarihi Ekle'}
            isEditMode={!!selectedDate}
          />
        );
      })()}

      <ConfirmDialog
        isOpen={!!statusConfirm}
        onClose={closeDateStatusConfirm}
        onConfirm={executeDateStatusAction}
        isLoading={statusActionLoading}
        title={
          statusConfirm?.action === 'complete'
            ? 'Turu Tamamlandı Olarak İşaretle'
            : 'Tur Tarihini İptal Et'
        }
        description={
          statusConfirm?.action === 'complete'
            ? 'Bu işlem sonrasında ilgili onaylı rezervasyonlar tamamlandı durumuna geçecek ve müşterileriniz tur deneyimlerini değerlendirebilecek.'
            : 'Bu işlem sonrasında bu tarihe bağlı tüm rezervasyonlar iptal edilecek. Bu işlem geri alınamaz.'
        }
        confirmLabel={
          statusConfirm?.action === 'complete'
            ? 'Tamamlandı Olarak İşaretle'
            : 'İptal Et'
        }
        variant={statusConfirm?.action === 'complete' ? 'success' : 'danger'}
      >
        {statusConfirm && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{statusConfirm.tourName}</p>
            <p className="mt-1 text-sm text-gray-500">
              {formatDateRange(statusConfirm.startDate, statusConfirm.endDate)}
            </p>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
} 