'use client';

import { useState } from 'react';
import { PencilIcon, UserGroupIcon, CalendarIcon, StarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface ProfileInfoTabProps {
  user: { name: string; email: string } | null;
}

export default function ProfileInfoTab({ user }: ProfileInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Kişisel Bilgiler</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 text-sm rounded-lg flex items-center ${
            isEditing 
              ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
          }`}
        >
          {isEditing ? (
            <>
              <span>İptal</span>
            </>
          ) : (
            <>
              <PencilIcon className="h-4 w-4 mr-1" />
              <span>Düzenle</span>
            </>
          )}
        </button>
      </div>
      
      {/* Kişisel bilgi formları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ad Soyad
          </label>
          {isEditing ? (
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              defaultValue={user?.name || ''}
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              {user?.name || 'İsimsiz Kullanıcı'}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            E-posta
          </label>
          {isEditing ? (
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              defaultValue={user?.email || ''}
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              {user?.email || 'E-posta yok'}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Telefon
          </label>
          {isEditing ? (
            <input
              type="tel"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              defaultValue="+90 555 123 4567"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              +90 555 123 4567
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Doğum Tarihi
          </label>
          {isEditing ? (
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              defaultValue="1990-01-01"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              01.01.1990
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Adres
        </label>
        {isEditing ? (
          <textarea
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={3}
            defaultValue="Atatürk Caddesi No:123, Kadıköy, İstanbul"
          />
        ) : (
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            Atatürk Caddesi No:123, Kadıköy, İstanbul
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            onClick={() => {
              setIsEditing(false);
              toast.success('Profiliniz başarıyla güncellendi');
            }}
          >
            Kaydet
          </button>
        </div>
      )}
      
      {/* Üyelik bilgileri */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Üyelik Bilgileri</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Üyelik Durumu</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Premium Üye</p>
              </div>
            </div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">Aktif</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Üyelik Tarihi</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">01.01.2023 tarihinden beri üye</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center">
              <StarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Puan Durumu</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2450 puan (Gold seviye)</p>
              </div>
            </div>
            <Link 
              href="/rewards" 
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Puanları Kullan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 