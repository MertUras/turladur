'use client';

import { useState, useEffect } from 'react';
import { UserCircleIcon, KeyIcon, BellIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

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
    <div className="flex flex-col space-y-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">Hesap Ayarları</h1>
        <p className="text-indigo-100">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <nav className="sticky top-4 space-y-1 bg-white shadow-md rounded-lg p-3 border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}`} aria-hidden="true" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white shadow-md rounded-lg p-8 border border-gray-200">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const { data: session } = useSession();
  // Split name for Ad/Soyad if possible
  const fullName = session?.user?.name || '';
  const [firstName, ...lastNameArr] = fullName.split(' ');
  const lastName = lastNameArr.join(' ');
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-8 pb-2 border-b border-gray-200">Profil</h2>
      <form className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="h-28 w-28 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
            <UserCircleIcon className="h-24 w-24 text-gray-400" />
          </div>
          <div>
            <button className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
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
              defaultValue={firstName || 'Ahmet'}
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Soyad
            </label>
            <input
              type="text"
              id="lastName"
              defaultValue={lastName || 'Yılmaz'}
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              defaultValue={session?.user?.email || 'ahmet@ornek.com'}
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              Pozisyon
            </label>
            <input
              type="text"
              id="position"
              defaultValue="Tur Yöneticisi"
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Departman
            </label>
            <input
              type="text"
              id="department"
              defaultValue="Operasyon"
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Hakkımda
          </label>
          <textarea
            id="bio"
            rows={4}
            defaultValue="10 yıllık seyahat ve turizm deneyimi ile İstanbul'da yaşıyorum. Yeni ve heyecan verici tur deneyimleri oluşturmak için tutkulu bir şekilde çalışıyorum."
            className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          ></textarea>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-6">Kişisel Tercihler</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Dil
              </label>
              <select
                id="language"
                className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                defaultValue="tr"
              >
                <option value="tr">Türkçe</option>
                <option value="en">İngilizce</option>
                <option value="de">Almanca</option>
                <option value="fr">Fransızca</option>
                <option value="es">İspanyolca</option>
              </select>
            </div>
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                Zaman Dilimi
              </label>
              <select
                id="timezone"
                className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                defaultValue="europe-istanbul"
              >
                <option value="europe-istanbul">Avrupa/İstanbul (UTC+3)</option>
                <option value="europe-london">Avrupa/Londra (UTC+0/+1)</option>
                <option value="america-new_york">Amerika/New York (UTC-5/-4)</option>
                <option value="asia-tokyo">Asya/Tokyo (UTC+9)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
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
      <h2 className="text-xl font-semibold text-gray-800 mb-8 pb-2 border-b border-gray-200">Güvenlik</h2>
      <form className="space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
              Mevcut Şifre
            </label>
            <input
              type="password"
              id="current-password"
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              Yeni Şifre
            </label>
            <input
              type="password"
              id="new-password"
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Şifre gereksinimleri:</div>
              <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
                <li>En az 8 karakter uzunluğunda</li>
                <li>En az bir büyük harf</li>
                <li>En az bir küçük harf</li>
                <li>En az bir rakam</li>
                <li>En az bir özel karakter</li>
              </ul>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifreyi Onayla
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1h3a1 1 0 110 2h-.086l.707 1.707a1 1 0 11-1.414 1.414L11.5 7.414V17a1 1 0 11-2 0V7.414L7.793 9.121a1 1 0 01-1.414-1.414L7.086 6H7a1 1 0 110-2h3V3a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Şifreyi Değiştir
          </button>
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">İki Faktörlü Kimlik Doğrulama</h3>
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-700 font-medium">Daha güçlü güvenlik için 2FA'yı açın</p>
            <p className="text-sm text-gray-500 mt-1">
              Hesabınıza giriş yaparken ek bir güvenlik katmanı kullanın.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
            <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition shadow-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              2FA Yapılandır
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-800">Güvenlik Geçmişi</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition flex items-center mt-2 md:mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
            </svg>
            Tüm güvenlik etkinliklerini görüntüle
          </button>
        </div>
        <div className="overflow-hidden shadow-md border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etkinlik
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Adresi
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 1, event: 'Başarılı Giriş', location: 'İstanbul, TR', ip: '172.168.254.100', date: '22 Nis 2023, 14:32' },
                { id: 2, event: 'Şifre Değiştirildi', location: 'İstanbul, TR', ip: '172.168.254.100', date: '15 Nis 2023, 10:18' },
                { id: 3, event: 'Başarılı Giriş', location: 'İstanbul, TR', ip: '172.168.254.100', date: '10 Nis 2023, 09:45' },
                { id: 4, event: 'Başarısız Giriş Denemesi', location: 'Bilinmiyor', ip: '214.45.192.122', date: '8 Nis 2023, 22:14' },
                { id: 5, event: 'Başarılı Giriş', location: 'İstanbul, TR', ip: '172.168.254.100', date: '5 Nis 2023, 16:55' },
              ].map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.event === 'Başarısız Giriş Denemesi' ? (
                      <span className="flex items-center">
                        <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span> {log.event}
                      </span>
                    ) : log.event === 'Şifre Değiştirildi' ? (
                      <span className="flex items-center">
                        <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span> {log.event}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span> {log.event}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-8 pb-2 border-b border-gray-200">Bildirim Ayarları</h2>
      
      <div className="space-y-10">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">E-posta Bildirimleri</h3>
          <ul className="space-y-4">
            {[
              { id: 'new-booking', name: 'Yeni Rezervasyon Bildirimleri', description: 'Yeni bir rezervasyon yapıldığında bildirim alın' },
              { id: 'booking-cancel', name: 'İptal Edilen Rezervasyonlar', description: 'Bir rezervasyon iptal edildiğinde bildirim alın' },
              { id: 'new-review', name: 'Yeni Yorumlar', description: 'Turlarınız için yeni yorumlar yapıldığında bildirim alın' },
              { id: 'finance-updates', name: 'Finansal Güncellemeler', description: 'Ödemeler ve muhasebe işlemleri hakkında bildirim alın' },
              { id: 'marketing', name: 'Pazarlama Duyuruları ve İpuçları', description: 'Pazarlama kampanyaları ve öneriler hakkında bildirim alın' },
            ].map((notification) => (
              <li key={notification.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="mb-2 sm:mb-0">
                  <span className="block text-gray-800 font-medium">{notification.name}</span>
                  <span className="text-sm text-gray-500">{notification.description}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked={true} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">SMS Bildirimleri</h3>
          <ul className="space-y-4">
            {[
              { id: 'sms-booking', name: 'Yeni Rezervasyon Bildirimleri', description: 'Yeni bir rezervasyon yapıldığında SMS alın' },
              { id: 'sms-cancel', name: 'İptal Edilen Rezervasyonlar', description: 'Bir rezervasyon iptal edildiğinde SMS alın' },
              { id: 'sms-reminder', name: 'Günlük Aktivite Hatırlatmaları', description: 'Günlük turlarınız hakkında hatırlatma SMS\'leri alın' },
            ].map((notification) => (
              <li key={notification.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="mb-2 sm:mb-0">
                  <span className="block text-gray-800 font-medium">{notification.name}</span>
                  <span className="text-sm text-gray-500">{notification.description}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked={false} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function CompanySettings() {
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/partner/me')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        setCompanyInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) {
    // Mock veri ile formu göster (sadece geliştirme kolaylığı için)
    if (!companyInfo) {
      setCompanyInfo({
        description: "Benzersiz tur deneyimleri sunan lider tur operatörü. 10 yılı aşkın deneyimimizle müşterilerimize unutulmaz anılar yaratıyoruz."
      });
      // companyInfo set edildikten sonra component tekrar render olacak
      return null;
    }
  }
  if (error && !companyInfo) return <div className="text-gray-900">Şirket bilgileri yüklenemedi.</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-8 pb-2 border-b border-gray-200">Şirket Bilgileri</h2>
      
      <form className="space-y-8">
        <div className="border-b border-gray-200 pb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-6">Marka Görünümü</h3>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="h-28 w-28 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
              <GlobeAltIcon className="h-20 w-20 text-gray-400" />
            </div>
            <div>
              <button className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Logo Yükle
              </button>
              <p className="text-sm text-gray-500 mt-2">SVG, PNG, veya JPG (ideal boyut 160x160px).</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="brand-color" className="block text-sm font-medium text-gray-700 mb-1">
                Marka Rengi
              </label>
              <div className="flex">
                <input
                  type="color"
                  id="brand-color"
                  defaultValue="#4F46E5"
                  className="w-12 h-10 rounded-l-md border border-gray-300 p-0"
                />
                <input
                  type="text"
                  defaultValue="#4F46E5"
                  className="flex-1 rounded-r-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-1">
            Şirket Adı
          </label>
          <input
            type="text"
            id="company-name"
            defaultValue="Tur Teknolojileri Ltd. Şti."
            className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        
        <div>
          <label htmlFor="business-type" className="block text-sm font-medium text-gray-700 mb-1">
            İşletme Türü
          </label>
          <select
            id="business-type"
            className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            defaultValue="tur-operatoru"
          >
            <option value="tur-operatoru">Tur Operatörü</option>
            <option value="seyahat-acentesi">Seyahat Acentesi</option>
            <option value="konaklama">Konaklama İşletmesi</option>
            <option value="aktivite-saglayici">Aktivite Sağlayıcı</option>
            <option value="diger">Diğer</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Web Sitesi
            </label>
            <input
              type="url"
              id="website"
              defaultValue={companyInfo?.website || ''}
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="establishment-year" className="block text-sm font-medium text-gray-700 mb-1">
              Kuruluş Yılı
            </label>
            <input
              type="number"
              id="establishment-year"
              defaultValue="2010"
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label htmlFor="employees" className="block text-sm font-medium text-gray-700 mb-1">
              Çalışan Sayısı
            </label>
            <select
              id="employees"
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              defaultValue="10-50"
            >
              <option value="1-9">1-9</option>
              <option value="10-50">10-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="500+">500+</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-6">Yasal Bilgiler</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tax-id" className="block text-sm font-medium text-gray-700 mb-1">
                Vergi Numarası
              </label>
              <input
                type="text"
                id="tax-id"
                defaultValue="1234567890"
                className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label htmlFor="tax-office" className="block text-sm font-medium text-gray-700 mb-1">
                Vergi Dairesi
              </label>
              <input
                type="text"
                id="tax-office"
                defaultValue="Kadıköy"
                className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label htmlFor="registration-number" className="block text-sm font-medium text-gray-700 mb-1">
                Ticaret Sicil No
              </label>
              <input
                type="text"
                id="registration-number"
                defaultValue="123456"
                className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label htmlFor="license-number" className="block text-sm font-medium text-gray-700 mb-1">
                Tursab Belge No
              </label>
              <input
                type="text"
                id="license-number"
                defaultValue="A-12345"
                className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
} 