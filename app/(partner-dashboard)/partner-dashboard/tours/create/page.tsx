'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TourForm, { TourFormData } from '@/app/components/partner-dashboard/TourForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CreateTourPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: TourFormData) => {
    setIsSubmitting(true);
    
    try {
      // Gerçek uygulamada burada backend'e veri gönderilir
      console.log('Tur oluşturma verileri:', data);
      
      // Simüle edilmiş gecikme
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Başarılı durumda:
      router.push('/partner-dashboard/tours');
    } catch (error) {
      console.error('Tur oluşturma hatası:', error);
      // Hata ile ilgili geri bildirim gösterilebilir
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-8">
        <Link
          href="/partner-dashboard/tours"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
          Turlara Dön
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Yeni Tur Oluştur</h1>
        <p className="mt-1 text-sm text-gray-500">
          Detayları doldurarak yeni bir tur oluşturun.
        </p>
      </div>
      
      <TourForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
} 