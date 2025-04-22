'use client';

import { KeyIcon, ShieldCheckIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Example Session Data
const sessions = [
  {
    id: 1,
    device: 'iPhone 13',
    location: 'İstanbul, Türkiye',
    time: 'Bugün, 14:30',
    isCurrent: true,
    icon: DevicePhoneMobileIcon,
  },
  {
    id: 2,
    device: 'Windows PC',
    location: 'Ankara, Türkiye',
    time: '3 gün önce',
    isCurrent: false,
    icon: ComputerDesktopIcon,
  },
  {
    id: 3,
    device: 'MacBook Pro',
    location: 'İstanbul, Türkiye',
    time: '1 hafta önce',
    isCurrent: false,
    icon: ComputerDesktopIcon,
  },
];

export default function SecurityTab() {
  const handlePasswordChange = () => {
    toast.success('Şifre değiştirme bağlantısı e-posta adresinize gönderildi.');
    // TODO: Implement actual password change request logic
  };

  const handleTwoFactorChange = () => {
    toast('İki faktörlü kimlik doğrulama ayarları sayfasına yönlendiriliyorsunuz.');
    // TODO: Implement navigation or modal logic for 2FA settings
  };

  const handleLogoutDevice = (sessionId: number, deviceName: string) => {
    toast.success(`Oturum sonlandırıldı: ${deviceName}`);
    // TODO: Implement actual logout logic for the specific session
    // Maybe update the 'sessions' state locally after successful logout
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Güvenlik Ayarları</h2>
        <p className="mt-1 text-sm text-neutral-600">Hesap şifrenizi, kimlik doğrulama yöntemlerinizi ve aktif oturumlarınızı yönetin.</p>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200/50 shadow-sm p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-sky-50 text-sky-600 rounded-full p-2 mt-0.5">
              <KeyIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-neutral-900">Şifre Değiştir</h3>
              <p className="mt-1 text-sm text-neutral-600">
                Hesabınızın güvenliği için şifrenizi düzenli olarak değiştirmenizi öneririz.
              </p>
              <button 
                className="mt-3 inline-flex items-center justify-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                onClick={handlePasswordChange}
              >
                Şifre Değiştirme İsteği Gönder
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-neutral-200/50 shadow-sm p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-green-50 text-green-600 rounded-full p-2 mt-0.5">
              <ShieldCheckIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-base font-semibold text-neutral-900">İki Faktörlü Kimlik Doğrulama (2FA)</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 ring-1 ring-inset ring-green-200 w-fit">
                  Aktif (SMS)
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                Hesabınız ek bir güvenlik katmanıyla korunmaktadır.
              </p>
              <button 
                onClick={handleTwoFactorChange}
                className="mt-3 inline-flex items-center justify-center px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                2FA Ayarlarını Yönet
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-neutral-200/50 shadow-sm">
          <div className="p-5 border-b border-neutral-100">
            <h3 className="text-base font-semibold text-neutral-900">Aktif Oturumlar ve Geçmiş</h3>
            <p className="mt-1 text-sm text-neutral-600">Hesabınıza giriş yapılan cihazları ve konumları yönetin.</p>
          </div>
          
          <div className="divide-y divide-neutral-100">
            {sessions.map((session) => (
              <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 gap-3">
                <div className="flex items-center gap-3 flex-grow">
                  <div className={`p-2 rounded-full ${session.isCurrent ? 'bg-sky-50 text-sky-600' : 'bg-neutral-100 text-neutral-500'}`}>
                    <session.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{session.device}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {session.location} - {session.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 mt-2 sm:mt-0">
                  {session.isCurrent ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 ring-1 ring-inset ring-green-200">
                      Şu anki oturum
                    </span>
                  ) : (
                    <button
                      onClick={() => handleLogoutDevice(session.id, session.device)}
                      className="text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1 rounded-md transition-colors"
                      title="Bu cihazdan çıkış yap"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 inline-block mr-1 -mt-0.5" />
                      Çıkış Yap
                    </button>
                  )}
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
               <p className="text-sm text-neutral-500 text-center p-6">Görüntülenecek oturum bilgisi yok.</p>
            )}
          </div>
          <div className="p-5 border-t border-neutral-100 bg-neutral-50/50">
            <button className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
              Tüm Diğer Oturumlardan Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 