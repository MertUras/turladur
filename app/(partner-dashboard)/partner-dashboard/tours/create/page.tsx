'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TourForm, { TourFormData } from '@/app/components/partner-dashboard/TourForm';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, InformationCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

interface FormData extends Partial<TourFormData> {
  [key: string]: any;
}

export default function CreateTourPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState<'basic' | 'details'>('basic');
  const [formData, setFormData] = useState<FormData>({});
  const [tourOperatorId, setTourOperatorId] = useState<string | null>(null);

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

    if (session) {
      fetchTourOperator();
    }
  }, [session]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    if (formStep === 'details') {
      try {
        if (!tourOperatorId) {
          throw new Error('Tur operatörü bilgisi bulunamadı');
        }

        const payload = {
          ...data,
          tourOperatorId,
        };

        const response = await fetch('/api/tours', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Tur oluşturulurken bir hata oluştu');
        }

        await response.json();
        router.push('/partner-dashboard/tours');
        return;
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormStep('details');
      setFormData(data);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Tur Oluştur</h1>
          <p className="text-gray-600">Müşterilerinize sunacağınız yeni bir tur oluşturun</p>
        </div>
        <Link href="/partner-dashboard/tours" className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
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
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${formStep === 'basic' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <span className="ml-2 font-medium text-gray-900">Temel Bilgiler</span>
          </div>
          <div className="flex items-center">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${formStep === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {formStep === 'details' ? <CheckCircleIcon className="h-5 w-5" /> : <span>2</span>}
            </div>
            <span className={`ml-2 font-medium ${formStep === 'details' ? 'text-gray-900' : 'text-gray-500'}`}>Detaylar</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-8">
              <TourForm 
                initialData={formData} 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting}
                currentStep={formStep}
                partnerId={tourOperatorId}
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
                    {formData?.description || 'Tur açıklaması burada görünecek...'}
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
                    <h3 className="text-sm font-medium text-blue-800">Bilgilendirme</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      {formStep === 'basic' ? (
                        <p>Temel bilgileri eksiksiz doldurmanız önemlidir. Müşterileriniz turunuzu seçerken öncelikle bu bilgilere göre karar verir.</p>
                      ) : (
                        <p>Turunuzun detaylarını ne kadar zengin tutarsanız, müşterilerinizin ilgisini o kadar çekersiniz. Turda neler dahil olduğu ve olmadığı konusunda açık olun.</p>
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
                  <>
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 