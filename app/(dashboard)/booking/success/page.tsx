'use client';

import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Rezervasyonunuz Tamamlandı!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Rezervasyon detaylarınız e-posta adresinize gönderildi.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-left space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Rezervasyon Numarası</h3>
              <p className="mt-1 text-2xl font-bold text-blue-600">#123456</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Check-in Tarihi</h3>
              <p className="mt-1 text-gray-600">12 Mart 2024, 14:00</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900">Check-out Tarihi</h3>
              <p className="mt-1 text-gray-600">15 Mart 2024, 12:00</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Rezervasyonunuzla ilgili herhangi bir sorunuz olursa, lütfen bizimle iletişime geçin.
          </p>
          
          <div className="flex flex-col space-y-4">
            <Link
              href="/dashboard"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Rezervasyonlarıma Git
            </Link>
            
            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 