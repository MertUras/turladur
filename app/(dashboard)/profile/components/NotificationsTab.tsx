'use client';

import { useState } from 'react';
import { ArrowPathIcon, CalendarIcon, StarIcon, HeartIcon, CheckIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Interface for Notification item (optional, for structuring data)
interface NotificationItem {
  id: number;
  icon: React.ElementType;
  iconColor: string; // e.g., 'text-sky-600'
  iconBg: string; // e.g., 'bg-sky-100'
  title: string;
  timestamp: string;
  isNew: boolean;
}

// Sample notification data
const sampleNotifications: NotificationItem[] = [
  {
    id: 1,
    icon: CalendarIcon,
    iconColor: 'text-sky-600',
    iconBg: 'bg-sky-50',
    title: 'Kapadokya Balon Turu için rezervasyonunuz onaylandı',
    timestamp: '2 saat önce',
    isNew: true,
  },
  {
    id: 2,
    icon: StarIcon, // Assuming StarIcon is relevant for points
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-50',
    title: 'Blue Resort Fethiye\'deki konaklamanız için 250 puan kazandınız',
    timestamp: '1 gün önce',
    isNew: false,
  },
  {
    id: 3,
    icon: HeartIcon,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
    title: 'Favori oteliniz Grand Hotel Antalya\'da %15 indirim fırsatı',
    timestamp: '2 gün önce',
    isNew: false,
  },
];

// Toggle Component (based on Tailwind UI)
function Toggle({ enabled, setEnabled }: { enabled: boolean; setEnabled: (enabled: boolean) => void }) {
  return (
    <button
      type="button"
      className={`${enabled ? 'bg-sky-600' : 'bg-neutral-200'}
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2`}
      role="switch"
      aria-checked={enabled}
      onClick={() => setEnabled(!enabled)}
    >
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
          transition duration-200 ease-in-out`}
      />
    </button>
  );
}

export default function NotificationsTab() {
  // States for toggles (example)
  const [emailBookingConfirm, setEmailBookingConfirm] = useState(true);
  const [emailTravelReminders, setEmailTravelReminders] = useState(true);
  const [emailPriceDrops, setEmailPriceDrops] = useState(false);
  const [emailCampaigns, setEmailCampaigns] = useState(true);
  const [smsBookingStatus, setSmsBookingStatus] = useState(true);
  const [smsTravelReminders, setSmsTravelReminders] = useState(false);
  const [smsEmergency, setSmsEmergency] = useState(true);
  const [appPush, setAppPush] = useState(true);
  const [appPoints, setAppPoints] = useState(true);

  const [notifications, setNotifications] = useState(sampleNotifications);

  const handleSaveSettings = () => {
    // TODO: Implement actual save logic
    console.log("Saving settings:", {
      emailBookingConfirm, emailTravelReminders, emailPriceDrops, emailCampaigns,
      smsBookingStatus, smsTravelReminders, smsEmergency,
      appPush, appPoints
    });
    toast.success('Bildirim ayarları kaydedildi');
  };

  const handleMarkAllAsRead = () => {
    // TODO: Implement actual logic
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
    toast.success('Tüm bildirimler okundu olarak işaretlendi');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold text-neutral-900">Bildirim Ayarları</h2>
        <button
          className="inline-flex items-center justify-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98]"
          onClick={handleSaveSettings}
        >
          <CheckIcon className="h-4 w-4 mr-1.5" />
          <span>Değişiklikleri Kaydet</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200/50 shadow-sm p-5 space-y-4">
          <h3 className="text-base font-semibold text-neutral-900">E-posta Bildirimleri</h3>
          <div className="divide-y divide-neutral-100">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">Rezervasyon Onayları</p>
                <p className="text-xs text-neutral-500 mt-0.5">Onay e-postaları</p>
              </div>
              <Toggle enabled={emailBookingConfirm} setEnabled={setEmailBookingConfirm} />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">Seyahat Hatırlatıcıları</p>
                <p className="text-xs text-neutral-500 mt-0.5">24 saat önce hatırlatma</p>
              </div>
              <Toggle enabled={emailTravelReminders} setEnabled={setEmailTravelReminders} />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">Fiyat İndirimleri</p>
                <p className="text-xs text-neutral-500 mt-0.5">Favorilerdeki değişiklikler</p>
              </div>
              <Toggle enabled={emailPriceDrops} setEnabled={setEmailPriceDrops} />
            </div>
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">Kampanya Duyuruları</p>
                <p className="text-xs text-neutral-500 mt-0.5">Özel teklifler</p>
              </div>
              <Toggle enabled={emailCampaigns} setEnabled={setEmailCampaigns} />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200/50 shadow-sm p-5 space-y-4">
          <h3 className="text-base font-semibold text-neutral-900">SMS Bildirimleri</h3>
          <div className="divide-y divide-neutral-100">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">Rezervasyon Durumu</p>
                <p className="text-xs text-neutral-500 mt-0.5">Durum güncellemeleri</p>
              </div>
              <Toggle enabled={smsBookingStatus} setEnabled={setSmsBookingStatus} />
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">Seyahat Hatırlatıcıları</p>
                <p className="text-xs text-neutral-500 mt-0.5">3 saat önce hatırlatma</p>
              </div>
              <Toggle enabled={smsTravelReminders} setEnabled={setSmsTravelReminders} />
            </div>
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">Acil Duyurular</p>
                <p className="text-xs text-neutral-500 mt-0.5">İptal/değişiklikler</p>
              </div>
              <Toggle enabled={smsEmergency} setEnabled={setSmsEmergency} />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1 bg-white rounded-xl border border-neutral-200/50 shadow-sm p-5 space-y-4">
          <h3 className="text-base font-semibold text-neutral-900">Uygulama Bildirimleri</h3>
          <div className="divide-y divide-neutral-100">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">Anlık Bildirimler</p>
                <p className="text-xs text-neutral-500 mt-0.5">Uygulama içi güncellemeler</p>
              </div>
              <Toggle enabled={appPush} setEnabled={setAppPush} />
            </div>
            <div className="flex items-center justify-between pt-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">Puan Bildirimleri</p>
                <p className="text-xs text-neutral-500 mt-0.5">Puan kazanımları</p>
              </div>
              <Toggle enabled={appPoints} setEnabled={setAppPoints} />
            </div>
          </div>
        </div>
      </div>
        
      <div className="bg-white rounded-xl border border-neutral-200/50 shadow-sm">
        <div className="flex justify-between items-center p-5 border-b border-neutral-100">
          <h3 className="text-base font-semibold text-neutral-900">Son Bildirimler</h3>
          <button 
            className="text-xs font-medium text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-2.5 py-1 rounded-md transition-colors"
            onClick={handleMarkAllAsRead}
            disabled={notifications.every(n => !n.isNew)}
          >
            Tümünü Oku
          </button>
        </div>
          
        <div className="p-5 space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-neutral-500 text-center py-4">Görüntülenecek bildirim yok.</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className={`flex items-start p-3 rounded-lg transition-colors ${notification.isNew ? 'bg-neutral-50' : 'hover:bg-neutral-50'}`}> 
                <div className={`flex-shrink-0 p-1.5 ${notification.iconBg} rounded-full mr-3 mt-0.5`}> 
                  <notification.icon className={`h-4 w-4 ${notification.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-800">
                    {notification.title}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {notification.timestamp}
                  </p>
                </div>
                {notification.isNew && (
                  <span className="h-2 w-2 rounded-full bg-sky-500 ml-3 mt-1 flex-shrink-0" title="Yeni"></span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 