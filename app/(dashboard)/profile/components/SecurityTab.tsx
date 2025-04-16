'use client';

import { KeyIcon, ShieldCheckIcon, UsersIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function SecurityTab() {
  const handlePasswordChange = () => {
    toast.success('Şifre değiştirme bağlantısı e-posta adresinize gönderildi.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Güvenlik Ayarları</h2>
      </div>
      
      <div className="space-y-4">
        {/* Şifre değiştirme */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <KeyIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Şifre Değiştir</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Hesabınızın güvenliği için şifrenizi düzenli olarak değiştirmenizi öneririz.
              </p>
              <button 
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                onClick={handlePasswordChange}
              >
                Şifre Değiştir
              </button>
            </div>
          </div>
        </div>
        
        {/* İki faktörlü kimlik doğrulama */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">İki Faktörlü Kimlik Doğrulama</h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300">
                  Aktif
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Hesabınız şu anda SMS ile iki faktörlü kimlik doğrulama koruması altındadır.
              </p>
              <button className="mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg">
                Ayarları Değiştir
              </button>
            </div>
          </div>
        </div>
        
        {/* Oturum açma geçmişi */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-medium text-gray-900 dark:text-white">Oturum Açma Geçmişi</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
            Hesabınızla ilgili son oturum açma etkinliklerini görüntüleyin.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <UsersIcon className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">İstanbul, Türkiye</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Bugün, 14:30 - iPhone 13
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 rounded-full">
                Şu anki oturum
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <UsersIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Ankara, Türkiye</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    3 gün önce - Windows PC
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <UsersIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">İstanbul, Türkiye</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    1 hafta önce - MacBook Pro
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 