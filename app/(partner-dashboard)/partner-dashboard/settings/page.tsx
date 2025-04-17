'use client';

import { useState } from 'react';
import { UserCircleIcon, KeyIcon, BellIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserCircleIcon },
    { id: 'security', name: 'Güvenlik', icon: KeyIcon },
    { id: 'notifications', name: 'Bildirimler', icon: BellIcon },
    { id: 'company', name: 'Şirket Bilgileri', icon: GlobeAltIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'company':
        return <CompanySettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Hesap Ayarları</h1>
        <p className="text-gray-500">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <nav className="space-y-1 bg-white shadow-sm rounded-lg p-2 border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}`} aria-hidden="true" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Profil</h2>
      <form className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            <UserCircleIcon className="h-20 w-20 text-gray-400" />
          </div>
          <div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
              Fotoğraf değiştir
            </button>
            <p className="text-sm text-gray-500 mt-2">JPG, GIF veya PNG. Max 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Ad
            </label>
            <input
              type="text"
              id="firstName"
              defaultValue="Ahmet"
              className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Soyad
            </label>
            <input
              type="text"
              id="lastName"
              defaultValue="Yılmaz"
              className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              defaultValue="ahmet@ornek.com"
              className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              defaultValue="+90 555 123 4567"
              className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Güvenlik</h2>
      <form className="space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
              Mevcut Şifre
            </label>
            <input
              type="password"
              id="current-password"
              className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              Yeni Şifre
            </label>
            <input
              type="password"
              id="new-password"
              className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifreyi Onayla
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Şifreyi Değiştir
          </button>
        </div>
      </form>

      <div className="mt-10 pt-10 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">İki Faktörlü Kimlik Doğrulama</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700">Daha güçlü güvenlik için 2FA'yı açın</p>
            <p className="text-sm text-gray-500 mt-1">
              Hesabınıza giriş yaparken ek bir güvenlik katmanı kullanın.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Bildirim Ayarları</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">E-posta Bildirimleri</h3>
          <ul className="space-y-4">
            {[
              { id: 'new-booking', name: 'Yeni Rezervasyon Bildirimleri' },
              { id: 'booking-cancel', name: 'İptal Edilen Rezervasyonlar' },
              { id: 'new-review', name: 'Yeni Yorumlar' },
              { id: 'finance-updates', name: 'Finansal Güncellemeler' },
              { id: 'marketing', name: 'Pazarlama Duyuruları ve İpuçları' },
            ].map((notification) => (
              <li key={notification.id} className="flex items-center justify-between">
                <span className="text-gray-700">{notification.name}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked={true} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">SMS Bildirimleri</h3>
          <ul className="space-y-4">
            {[
              { id: 'sms-booking', name: 'Yeni Rezervasyon Bildirimleri' },
              { id: 'sms-cancel', name: 'İptal Edilen Rezervasyonlar' },
              { id: 'sms-reminder', name: 'Günlük Aktivite Hatırlatmaları' },
            ].map((notification) => (
              <li key={notification.id} className="flex items-center justify-between">
                <span className="text-gray-700">{notification.name}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked={false} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function CompanySettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Şirket Bilgileri</h2>
      
      <form className="space-y-6">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
            Şirket Adı
          </label>
          <input
            type="text"
            id="company-name"
            defaultValue="Tur Teknolojileri Ltd. Şti."
            className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
          />
        </div>
        
        <div>
          <label htmlFor="business-type" className="block text-sm font-medium text-gray-700 mb-1">
            İşletme Türü
          </label>
          <select
            id="business-type"
            className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            defaultValue="tur-operatoru"
          >
            <option value="tur-operatoru">Tur Operatörü</option>
            <option value="seyahat-acentesi">Seyahat Acentesi</option>
            <option value="konaklama">Konaklama İşletmesi</option>
            <option value="aktivite-saglayici">Aktivite Sağlayıcı</option>
            <option value="diger">Diğer</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="company-description" className="block text-sm font-medium text-gray-700 mb-1">
            Şirket Açıklaması
          </label>
          <textarea
            id="company-description"
            rows={4}
            className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            defaultValue="Benzersiz tur deneyimleri sunan lider tur operatörü. 10 yılı aşkın deneyimimizle müşterilerimize unutulmaz anılar yaratıyoruz."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Web Sitesi
            </label>
            <input
              type="url"
              id="website"
              defaultValue="https://www.ornek-tur.com"
              className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Ana Merkez
            </label>
            <input
              type="text"
              id="location"
              defaultValue="İstanbul, Türkiye"
              className="w-full rounded-md bg-white border-gray-300 text-gray-800 shadow-sm"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
} 