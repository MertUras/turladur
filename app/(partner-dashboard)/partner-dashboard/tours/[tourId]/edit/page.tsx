'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import TourForm, {
  TourFormData,
} from '@/app/components/partner-dashboard/TourForm';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

interface FormData extends Partial<TourFormData> {
  [key: string]: any;
}

// API'den gelen tur verisini TourFormData'ya dönüştüren yardımcı fonksiyon
const transformApiDataToFormData = (apiData: any): TourFormData => {
  return {
    title: apiData.name || '',
    description: apiData.description || '',
    price: apiData.price?.toString() || '',
    location:
      Array.isArray(apiData.destinations) && apiData.destinations.length > 0
        ? apiData.destinations[0]?.city || ''
        : '',
    duration: apiData.duration?.toString() || '',
    nights: apiData.nights?.toString() || '',
    maxParticipants: apiData.maxParticipants || 0,
    currentParticipants: apiData.currentParticipants || 0,
    images: Array.isArray(apiData.images)
      ? apiData.images.map((img: string) => ({ url: img, file: null }))
      : [],
    includes: Array.isArray(apiData.inclusions) ? apiData.inclusions : [],
    excludes: Array.isArray(apiData.exclusions) ? apiData.exclusions : [],
    healthPrivileges: Array.isArray(apiData.healthPrivileges)
      ? apiData.healthPrivileges
      : [],
    itinerary: Array.isArray(apiData.itinerary) ? apiData.itinerary : [],
    status: apiData.status || 'draft',
    departureCity: apiData.departureCity?.split(', ') || [''],
    region: apiData.region || '',
    transportation: apiData.transportation || '',
    period: apiData.period || '',
    tourType: apiData.tourType || '',
    accommodationType: apiData.accommodationType || '',
    ageRestriction: apiData.ageRestriction?.toString() || '',
    languages: Array.isArray(apiData.languages) ? apiData.languages : [],
    tags: Array.isArray(apiData.tags) ? apiData.tags : [],
    tourDates: Array.isArray(apiData.tourDates)
      ? apiData.tourDates.map((date: any) => {
          // Nested tour objesini kaldır
          const { tour, ...dateWithoutTour } = date;

          // Tarih formatını dönüştür
          const earlyBirdDeadline = date.earlyBirdDeadline
            ? new Date(date.earlyBirdDeadline).toISOString().split('T')[0]
            : '';
          const lastMinuteStart = date.lastMinuteStart
            ? new Date(date.lastMinuteStart).toISOString().split('T')[0]
            : '';

          return {
            ...dateWithoutTour,
            startDate: date.startDate
              ? new Date(date.startDate).toISOString().split('T')[0]
              : '',
            endDate: date.endDate
              ? new Date(date.endDate).toISOString().split('T')[0]
              : '',
            price: date.price?.toString() || '0',
            availableSeats: date.availableSeats?.toString() || '0',
            soldSeats: date.soldSeats?.toString() || '0',
            minParticipants: date.minParticipants?.toString() || '',
            maxParticipants: date.maxParticipants?.toString() || '',
            earlyBirdDiscount: date.earlyBirdDiscount?.toString() || '',
            lastMinuteDiscount: date.lastMinuteDiscount?.toString() || '',
            earlyBirdDeadline: earlyBirdDeadline,
            lastMinuteStart: lastMinuteStart,
            // Form alanları için ayrı tarih alanları - null değerler için boş string
            earlyBirdDeadlineStart: earlyBirdDeadline,
            earlyBirdDeadlineEnd: earlyBirdDeadline,
            lastMinuteStartStart: lastMinuteStart,
            lastMinuteStartEnd: lastMinuteStart,
            notes: date.notes || '',
            status: date.status || 'ACTIVE',
            ageRanges: Array.isArray(date.ageRanges) ? date.ageRanges : [],
            isExpanded: false,
            waitingList: date.waitingList?.toString() || '0',
            discount: date.discount?.toString() || '0',
          };
        })
      : [],
    discount: apiData.discount || 0,
    destinations:
      Array.isArray(apiData.destinations) && apiData.destinations.length > 0
        ? apiData.destinations
        : [{ city: '', description: '' }],
    reviews: apiData.reviews || 0,
    isJointTour: apiData.isJointTour || false,
    features: Array.isArray(apiData.features) ? apiData.features : [],
    startDate: apiData.startDate
      ? new Date(apiData.startDate).toISOString().split('T')[0]
      : '',
    endDate: apiData.endDate
      ? new Date(apiData.endDate).toISOString().split('T')[0]
      : '',
    accommodationName: apiData.accommodation?.name || '',
    meetingPoint: apiData.meetingPoint || '',
    meetingTime: apiData.meetingTime || '',
    pickupPoints: Array.isArray(apiData.pickupPoints)
      ? apiData.pickupPoints
      : [],
    mainImage:
      Array.isArray(apiData.images) && apiData.images.length > 0
        ? { url: apiData.images[0], file: null }
        : null,
    galleryImages:
      Array.isArray(apiData.images) && apiData.images.length > 1
        ? apiData.images
            .slice(1)
            .map((img: string) => ({ url: img, file: null }))
        : [],
  };
};

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams();
  const tourId = params.tourId as string;
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState<'basic' | 'details'>('basic');
  const [formData, setFormData] = useState<FormData>({});
  const [tourOperatorId, setTourOperatorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTourOperator = async () => {
      try {
        const response = await fetch('/api/partner/me');
        if (response.ok) {
          const data = await response.json();
          setTourOperatorId(data.id);
        }
      } catch (error) {
        console.error('Error fetching tour operator:', error);
      }
    };

    const fetchTourData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/partner/tours/${tourId}`);
        if (!response.ok) {
          throw new Error('Tur verileri alınamadı');
        }
        const data = await response.json();
        const transformedData = transformApiDataToFormData(data);
        setFormData(transformedData);
      } catch (error) {
        console.error('Hata:', error);
        setError(error instanceof Error ? error.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTourOperator();
      fetchTourData();
    }
  }, [session, tourId]);

  const handleUpdate = async (formData: TourFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/partner/tours/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Tur güncellenirken bir hata oluştu.',
        );
      }

      router.push('/partner-dashboard/tours');
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      setError(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (formStep === 'details') {
      setFormStep('basic');
    } else {
      router.push('/partner-dashboard/tours');
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
            onClick={() => router.push('/partner-dashboard/tours')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tur Düzenle</h1>
          <p className="text-gray-600">
            Tur bilgilerini güncelleyin ve değişiklikleri kaydedin.
          </p>
        </div>
        <Link
          href="/partner-dashboard/tours"
          className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          İptal
        </Link>
      </div>

      {/* İlerleme göstergesi */}
      <div className="mb-8">
        <div className="overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-2.5 rounded-full bg-blue-600 transition-all duration-500 ease-in-out"
            style={{ width: formStep === 'basic' ? '50%' : '100%' }}
          ></div>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="flex items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${formStep === 'basic' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <span className="ml-2 font-medium text-gray-900">
              Temel Bilgiler
            </span>
          </div>
          <div className="flex items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full ${formStep === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {formStep === 'details' ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <span>2</span>
              )}
            </div>
            <span
              className={`ml-2 font-medium ${formStep === 'details' ? 'text-gray-900' : 'text-gray-500'}`}
            >
              Detaylar
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-8">
              <TourForm
                initialData={formData}
                onSubmit={handleUpdate}
                isSubmitting={isSubmitting}
                currentStep={formStep}
                partnerId={tourOperatorId || undefined}
                isUpdateMode={true}
                tourId={tourId}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Önizleme</h2>
                <div className="mt-4 space-y-4">
                  <div className="h-48 w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                    <PhotoIcon className="h-14 w-14 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {formData?.title || 'Tur başlığı'}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {formData?.description ||
                      'Tur açıklaması burada görünecek...'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {formData?.price ? `${formData.price} ₺` : '0 ₺'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {formData?.duration || '0 saat'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg bg-blue-50 shadow">
              <div className="p-6">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Bilgilendirme
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      {formStep === 'basic' ? (
                        <p>
                          Temel bilgileri eksiksiz doldurmanız önemlidir.
                          Müşterileriniz turunuzu seçerken öncelikle bu
                          bilgilere göre karar verir.
                        </p>
                      ) : (
                        <p>
                          Turunuzun detaylarını ne kadar zengin tutarsanız,
                          müşterilerinizin ilgisini o kadar çekersiniz. Turda
                          neler dahil olduğu ve olmadığı konusunda açık olun.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                className="flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <ArrowLeftIcon className="mr-2 h-5 w-5" />
                Geri
              </button>
              <button
                type="submit"
                form="tour-form"
                disabled={isSubmitting}
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
              >
                {formStep === 'basic' ? (
                  <>
                    Devam Et
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>{isSubmitting ? 'Güncelleniyor...' : 'Güncelle'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
