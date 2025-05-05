'use client';

import { useState } from 'react';
import {
  GlobeAltIcon,
  UserPlusIcon,
  BellIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    currency: string;
    timezone: string;
    languages: string[];
    defaultLanguage: string;
  };
  registration: {
    requireApproval: boolean;
    allowAgencyRegistration: boolean;
    allowGuideRegistration: boolean;
    minPasswordLength: number;
    requireEmailVerification: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    notificationTypes: {
      newReservation: boolean;
      reservationCancelled: boolean;
      paymentReceived: boolean;
      systemUpdates: boolean;
    };
  };
  security: {
    twoFactorAuth: boolean;
    passwordResetEnabled: boolean;
    sessionTimeout: number;
    ipBlocking: boolean;
    maxLoginAttempts: number;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'TourTech',
      siteDescription: 'Türkiye\'nin En İyi Tur Platformu',
      currency: 'TRY',
      timezone: 'Europe/Istanbul',
      languages: ['tr', 'en', 'de', 'ru'],
      defaultLanguage: 'tr',
    },
    registration: {
      requireApproval: true,
      allowAgencyRegistration: true,
      allowGuideRegistration: true,
      minPasswordLength: 8,
      requireEmailVerification: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      notificationTypes: {
        newReservation: true,
        reservationCancelled: true,
        paymentReceived: true,
        systemUpdates: true,
      },
    },
    security: {
      twoFactorAuth: true,
      passwordResetEnabled: true,
      sessionTimeout: 30,
      ipBlocking: true,
      maxLoginAttempts: 5,
    },
  });

  const handleSettingChange = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNotificationTypeChange = (type: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        notificationTypes: {
          ...prev.notifications.notificationTypes,
          [type]: value,
        },
      },
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık */}
        <div className="pb-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
          <p className="text-gray-500 mt-1">Platform genel ayarlarının yönetimi</p>
        </div>

        {/* Sekmeler */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('general')}
              className={`${
                activeTab === 'general'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <GlobeAltIcon className="h-5 w-5 mr-2" />
              Genel Ayarlar
            </button>
            <button
              onClick={() => setActiveTab('registration')}
              className={`${
                activeTab === 'registration'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Kayıt Politikaları
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BellIcon className="h-5 w-5 mr-2" />
              Bildirim Ayarları
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Güvenlik
            </button>
          </nav>
        </div>

        {/* Ayarlar İçeriği */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                  Site Adı
                </label>
                <input
                  type="text"
                  id="siteName"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={settings.general.siteName}
                  onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                  Site Açıklaması
                </label>
                <input
                  type="text"
                  id="siteDescription"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={settings.general.siteDescription}
                  onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Para Birimi
                </label>
                <select
                  id="currency"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={settings.general.currency}
                  onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                >
                  <option value="TRY">Türk Lirası (₺)</option>
                  <option value="USD">Amerikan Doları ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                  Saat Dilimi
                </label>
                <select
                  id="timezone"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={settings.general.timezone}
                  onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                >
                  <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                  <option value="Europe/London">Londra (UTC+0)</option>
                  <option value="America/New_York">New York (UTC-5)</option>
                </select>
              </div>
              <div>
                <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700">
                  Varsayılan Dil
                </label>
                <select
                  id="defaultLanguage"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={settings.general.defaultLanguage}
                  onChange={(e) => handleSettingChange('general', 'defaultLanguage', e.target.value)}
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'registration' && (
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireApproval"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={settings.registration.requireApproval}
                  onChange={(e) => handleSettingChange('registration', 'requireApproval', e.target.checked)}
                />
                <label htmlFor="requireApproval" className="ml-2 block text-sm text-gray-900">
                  Kayıtlar için onay gerekli
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowAgencyRegistration"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={settings.registration.allowAgencyRegistration}
                  onChange={(e) => handleSettingChange('registration', 'allowAgencyRegistration', e.target.checked)}
                />
                <label htmlFor="allowAgencyRegistration" className="ml-2 block text-sm text-gray-900">
                  Acente kayıtlarına izin ver
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowGuideRegistration"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={settings.registration.allowGuideRegistration}
                  onChange={(e) => handleSettingChange('registration', 'allowGuideRegistration', e.target.checked)}
                />
                <label htmlFor="allowGuideRegistration" className="ml-2 block text-sm text-gray-900">
                  Rehber kayıtlarına izin ver
                </label>
              </div>
              <div>
                <label htmlFor="minPasswordLength" className="block text-sm font-medium text-gray-700">
                  Minimum Şifre Uzunluğu
                </label>
                <input
                  type="number"
                  id="minPasswordLength"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={settings.registration.minPasswordLength}
                  onChange={(e) => handleSettingChange('registration', 'minPasswordLength', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireEmailVerification"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={settings.registration.requireEmailVerification}
                  onChange={(e) => handleSettingChange('registration', 'requireEmailVerification', e.target.checked)}
                />
                <label htmlFor="requireEmailVerification" className="ml-2 block text-sm text-gray-900">
                  E-posta doğrulaması gerekli
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                  E-posta bildirimleri
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                />
                <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-900">
                  SMS bildirimleri
                </label>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900">Bildirim Türleri</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="newReservation"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.notifications.notificationTypes.newReservation}
                      onChange={(e) => handleNotificationTypeChange('newReservation', e.target.checked)}
                    />
                    <label htmlFor="newReservation" className="ml-2 block text-sm text-gray-900">
                      Yeni rezervasyon bildirimleri
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="reservationCancelled"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.notifications.notificationTypes.reservationCancelled}
                      onChange={(e) => handleNotificationTypeChange('reservationCancelled', e.target.checked)}
                    />
                    <label htmlFor="reservationCancelled" className="ml-2 block text-sm text-gray-900">
                      Rezervasyon iptal bildirimleri
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="paymentReceived"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.notifications.notificationTypes.paymentReceived}
                      onChange={(e) => handleNotificationTypeChange('paymentReceived', e.target.checked)}
                    />
                    <label htmlFor="paymentReceived" className="ml-2 block text-sm text-gray-900">
                      Ödeme alındı bildirimleri
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="systemUpdates"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={settings.notifications.notificationTypes.systemUpdates}
                      onChange={(e) => handleNotificationTypeChange('systemUpdates', e.target.checked)}
                    />
                    <label htmlFor="systemUpdates" className="ml-2 block text-sm text-gray-900">
                      Sistem güncelleme bildirimleri
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                />
                <label htmlFor="twoFactorAuth" className="ml-2 block text-sm text-gray-900">
                  İki faktörlü kimlik doğrulama
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="passwordResetEnabled"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={settings.security.passwordResetEnabled}
                  onChange={(e) => handleSettingChange('security', 'passwordResetEnabled', e.target.checked)}
                />
                <label htmlFor="passwordResetEnabled" className="ml-2 block text-sm text-gray-900">
                  Şifre sıfırlama özelliği
                </label>
              </div>
              <div>
                <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700">
                  Oturum Zaman Aşımı (dakika)
                </label>
                <input
                  type="number"
                  id="sessionTimeout"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ipBlocking"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={settings.security.ipBlocking}
                  onChange={(e) => handleSettingChange('security', 'ipBlocking', e.target.checked)}
                />
                <label htmlFor="ipBlocking" className="ml-2 block text-sm text-gray-900">
                  IP engelleme
                </label>
              </div>
              <div>
                <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700">
                  Maksimum Giriş Denemesi
                </label>
                <input
                  type="number"
                  id="maxLoginAttempts"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Kaydet Butonu */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ayarları Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 