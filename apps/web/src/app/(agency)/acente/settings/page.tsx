'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Bell,
  Check,
  Globe,
  Key,
  Lock,
  Upload,
  UserCircle,
} from 'lucide-react';

import { resolveMediaUrl } from '@/lib/media';
import {
  getPartnerProfile,
  getPresignedUpload,
  updatePartnerProfile,
} from '@/services/partner-admin';
import { changePassword, updateProfile } from '@/services/identity';
import { useAuth } from '@/providers/auth-provider';

const LOGO_MAX_BYTES = 2 * 1024 * 1024;
const LOGO_CONTENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

type LogoContentType = (typeof LOGO_CONTENT_TYPES)[number];

function isLogoContentType(value: string): value is LogoContentType {
  return (LOGO_CONTENT_TYPES as readonly string[]).includes(value);
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profil', icon: UserCircle },
    { id: 'security', name: 'Güvenlik', icon: Key },
    { id: 'notifications', name: 'Bildirimler', icon: Bell },
    { id: 'company', name: 'Şirket Bilgileri', icon: Globe },
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
        <p className="text-indigo-100">
          Hesap bilgilerinizi ve tercihlerinizi yönetin
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <nav className="sticky top-4 space-y-1 bg-white shadow-md rounded-lg p-3 border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md w-full transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon
                  className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}`}
                  aria-hidden="true"
                />
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
  const { user, accessToken, refreshProfile } = useAuth();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPending, setLogoPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [about, setAbout] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    void getPartnerProfile(accessToken)
      .then((data) => {
        setPartnerId(data.id);
        setLogo(resolveMediaUrl(data.logo));
        setAbout(data.address ?? '');
      })
      .catch(() => setError('Şirket bilgileri yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [accessToken]);

  useEffect(() => {
    setFirstName(user?.firstName ?? '');
    setLastName(user?.lastName ?? '');
    setPhone(user?.phone ?? '');
  }, [user]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await updateProfile(
        {
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          phone: phone.trim() || null,
        },
        accessToken,
      );
      await refreshProfile();
      setMessage('Değişiklikler kaydedildi.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoFile(file: File | null) {
    if (!file || !accessToken || !partnerId) return;
    if (file.size > LOGO_MAX_BYTES) {
      setError('Dosya boyutu 2MB sınırını aşıyor.');
      return;
    }
    if (!isLogoContentType(file.type)) {
      setError('Sadece JPG, PNG, GIF veya WebP yükleyin.');
      return;
    }
    setLogoPending(true);
    setMessage(null);
    setError(null);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const presigned = await getPresignedUpload(
        {
          folder: 'operators',
          entityId: partnerId,
          filename: safeName,
          contentType: file.type,
        },
        accessToken,
      );
      const uploadRes = await fetch(presigned.uploadUrl, {
        method: 'PUT',
        headers:
          presigned.uploadHeaders ??
          ({ 'Content-Type': file.type } satisfies Record<string, string>),
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Yükleme başarısız');
      await updatePartnerProfile({ logo: presigned.publicUrl }, accessToken);
      setLogo(resolveMediaUrl(presigned.publicUrl) ?? presigned.publicUrl);
      setMessage('Logo güncellendi.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yükleme hatası');
    } finally {
      setLogoPending(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  }

  if (loading) return <div>Yükleniyor...</div>;
  if (error && !user) return <div className="text-gray-900">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-8 pb-2 border-b border-gray-200">
        Profil
      </h2>
      {message ? (
        <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <form className="space-y-8" onSubmit={handleSave}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="h-28 w-28 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveMediaUrl(logo) ?? logo}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <UserCircle className="h-24 w-24 text-gray-400" />
            )}
          </div>
          <div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => void handleLogoFile(e.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              disabled={logoPending || !accessToken || !partnerId}
              onClick={() => logoInputRef.current?.click()}
              className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Upload className="h-5 w-5 mr-2" />
              {logoPending ? 'Yükleniyor…' : 'Fotoğraf değiştir'}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              JPG, GIF veya PNG. Max 2MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ad
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Soyad
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              E-posta
            </label>
            <input
              type="email"
              id="email"
              readOnly
              value={user?.email ?? ''}
              className="w-full rounded-md bg-gray-50 border border-gray-300 text-gray-800 shadow-sm px-4 py-2"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Telefon
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hakkımda
          </label>
          <textarea
            id="bio"
            rows={4}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-6">
            Kişisel Tercihler
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Zaman Dilimi
              </label>
              <select
                id="timezone"
                className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                defaultValue="europe-istanbul"
              >
                <option value="europe-istanbul">Avrupa/İstanbul (UTC+3)</option>
                <option value="europe-london">Avrupa/Londra (UTC+0/+1)</option>
                <option value="america-new_york">
                  Amerika/New York (UTC-5/-4)
                </option>
                <option value="asia-tokyo">Asya/Tokyo (UTC+9)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center justify-center disabled:opacity-60"
          >
            <Check className="h-5 w-5 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}

function SecuritySettings() {
  const { accessToken } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await changePassword({ currentPassword, newPassword }, accessToken);
      setMessage('Şifreniz güncellendi.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Şifre değiştirilemedi');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-8 pb-2 border-b border-gray-200">
        Güvenlik
      </h2>
      {message ? (
        <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mevcut Şifre
            </label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Yeni Şifre
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">
                Şifre gereksinimleri:
              </div>
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
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Şifreyi Onayla
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center justify-center disabled:opacity-60"
          >
            <Key className="h-5 w-5 mr-2" />
            {saving ? 'Güncelleniyor...' : 'Şifreyi Değiştir'}
          </button>
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          İki Faktörlü Kimlik Doğrulama
        </h3>
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-700 font-medium">
              Daha güçlü güvenlik için 2FA&apos;yı açın
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Hesabınıza giriş yaparken ek bir güvenlik katmanı kullanın.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
            <button
              type="button"
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition shadow-sm flex items-center"
            >
              <Lock className="h-5 w-5 mr-2" />
              2FA Yapılandır
            </button>
          </div>
        </div>
      </div>

      <SecurityHistoryTable />
    </div>
  );
}

const SECURITY_LOGS = [
  {
    id: 1,
    event: 'Başarılı Giriş',
    location: 'İstanbul, TR',
    ip: '172.168.254.100',
    date: '22 Nis 2023, 14:32',
  },
  {
    id: 2,
    event: 'Şifre Değiştirildi',
    location: 'İstanbul, TR',
    ip: '172.168.254.100',
    date: '15 Nis 2023, 10:18',
  },
  {
    id: 3,
    event: 'Başarılı Giriş',
    location: 'İstanbul, TR',
    ip: '172.168.254.100',
    date: '10 Nis 2023, 09:45',
  },
  {
    id: 4,
    event: 'Başarısız Giriş Denemesi',
    location: 'Bilinmiyor',
    ip: '214.45.192.122',
    date: '8 Nis 2023, 22:14',
  },
  {
    id: 5,
    event: 'Başarılı Giriş',
    location: 'İstanbul, TR',
    ip: '172.168.254.100',
    date: '5 Nis 2023, 16:55',
  },
];

function SecurityHistoryTable() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-800">Güvenlik Geçmişi</h3>
        <button
          type="button"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition flex items-center mt-2 md:mt-0"
        >
          Tüm güvenlik etkinliklerini görüntüle
        </button>
      </div>
      <div className="overflow-hidden shadow-md border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Etkinlik
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Konum
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                IP Adresi
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tarih
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {SECURITY_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {log.event === 'Başarısız Giriş Denemesi' ? (
                    <span className="flex items-center">
                      <span className="h-2 w-2 bg-red-500 rounded-full mr-2" />{' '}
                      {log.event}
                    </span>
                  ) : log.event === 'Şifre Değiştirildi' ? (
                    <span className="flex items-center">
                      <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2" />{' '}
                      {log.event}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2" />{' '}
                      {log.event}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.ip}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-8 pb-2 border-b border-gray-200">
        Bildirim Ayarları
      </h2>
      {saved ? (
        <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
          Tercihler kaydedildi.
        </p>
      ) : null}

      <div className="space-y-10">
        <NotificationGroup
          title="E-posta Bildirimleri"
          items={[
            {
              id: 'new-booking',
              name: 'Yeni Rezervasyon Bildirimleri',
              description: 'Yeni bir rezervasyon yapıldığında bildirim alın',
              defaultOn: true,
            },
            {
              id: 'booking-cancel',
              name: 'İptal Edilen Rezervasyonlar',
              description: 'Bir rezervasyon iptal edildiğinde bildirim alın',
              defaultOn: true,
            },
            {
              id: 'new-review',
              name: 'Yeni Yorumlar',
              description:
                'Turlarınız için yeni yorumlar yapıldığında bildirim alın',
              defaultOn: true,
            },
            {
              id: 'finance-updates',
              name: 'Finansal Güncellemeler',
              description:
                'Ödemeler ve muhasebe işlemleri hakkında bildirim alın',
              defaultOn: true,
            },
            {
              id: 'marketing',
              name: 'Pazarlama Duyuruları ve İpuçları',
              description:
                'Pazarlama kampanyaları ve öneriler hakkında bildirim alın',
              defaultOn: true,
            },
          ]}
        />

        <NotificationGroup
          title="SMS Bildirimleri"
          items={[
            {
              id: 'sms-booking',
              name: 'Yeni Rezervasyon Bildirimleri',
              description: 'Yeni bir rezervasyon yapıldığında SMS alın',
              defaultOn: false,
            },
            {
              id: 'sms-cancel',
              name: 'İptal Edilen Rezervasyonlar',
              description: 'Bir rezervasyon iptal edildiğinde SMS alın',
              defaultOn: false,
            },
            {
              id: 'sms-reminder',
              name: 'Günlük Aktivite Hatırlatmaları',
              description:
                "Günlük turlarınız hakkında hatırlatma SMS'leri alın",
              defaultOn: false,
            },
          ]}
        />

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center justify-center"
          >
            <Check className="h-5 w-5 mr-2" />
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{
    id: string;
    name: string;
    description: string;
    defaultOn: boolean;
  }>;
}) {
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(items.map((item) => [item.id, item.defaultOn])),
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      <ul className="space-y-4">
        {items.map((notification) => (
          <li
            key={notification.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="mb-2 sm:mb-0">
              <span className="block text-gray-800 font-medium">
                {notification.name}
              </span>
              <span className="text-sm text-gray-500">
                {notification.description}
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={Boolean(toggles[notification.id])}
                onChange={(e) =>
                  setToggles((prev) => ({
                    ...prev,
                    [notification.id]: e.target.checked,
                  }))
                }
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompanySettings() {
  const { accessToken } = useAuth();
  const [partnerId, setPartnerId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    companyName: '',
    website: '',
    taxNumber: '',
    address: '',
    city: '',
    country: '',
    logo: null as string | null,
    about: '',
  });

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    void getPartnerProfile(accessToken)
      .then((data) => {
        setPartnerId(data.id);
        setForm({
          companyName: data.companyName,
          website: data.website ?? '',
          taxNumber: data.taxNumber ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          country: data.country ?? 'Türkiye',
          logo: resolveMediaUrl(data.logo),
          about: data.address ?? '',
        });
      })
      .catch(() => setError('Şirket bilgileri yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [accessToken]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await updatePartnerProfile(
        {
          companyName: form.companyName,
          website: form.website || null,
          taxNumber: form.taxNumber || null,
          address: form.about || form.address || null,
          city: form.city || null,
          country: form.country || null,
          logo: form.logo,
        },
        accessToken,
      );
      setMessage('Değişiklikler kaydedildi.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Yükleniyor...</div>;
  if (error && !partnerId) {
    return <div className="text-gray-900">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-8 pb-2 border-b border-gray-200">
        Şirket Bilgileri
      </h2>
      {message ? (
        <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="border-b border-gray-200 pb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-6">
            Marka Görünümü
          </h3>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gray-50 rounded-lg border border-gray-200 mb-6">
            <div className="h-28 w-28 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
              {form.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveMediaUrl(form.logo) ?? form.logo}
                  alt=""
                  className="h-full w-full object-contain"
                />
              ) : (
                <Globe className="h-20 w-20 text-gray-400" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="brand-color"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
          <label
            htmlFor="company-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Şirket Adı
          </label>
          <input
            type="text"
            id="company-name"
            value={form.companyName}
            onChange={(e) =>
              setForm((f) => ({ ...f, companyName: e.target.value }))
            }
            className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="business-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
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
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Web Sitesi
            </label>
            <input
              type="url"
              id="website"
              value={form.website}
              onChange={(e) =>
                setForm((f) => ({ ...f, website: e.target.value }))
              }
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ana Merkez
            </label>
            <input
              type="text"
              id="location"
              value={[form.city, form.country].filter(Boolean).join(', ')}
              onChange={(e) => {
                const parts = e.target.value.split(',').map((p) => p.trim());
                setForm((f) => ({
                  ...f,
                  city: parts[0] ?? f.city,
                  country: parts.slice(1).join(', ') || f.country,
                }));
              }}
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="establishment-year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
            <label
              htmlFor="employees"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
          <h3 className="text-lg font-medium text-gray-800 mb-6">
            Yasal Bilgiler
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tax-id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vergi Numarası
              </label>
              <input
                type="text"
                id="tax-id"
                value={form.taxNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, taxNumber: e.target.value }))
                }
                className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="tax-office"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
              <label
                htmlFor="registration-number"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
              <label
                htmlFor="license-number"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-6">Hakkında</h3>

          <div>
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Hakkında
            </label>
            <textarea
              id="about"
              name="about"
              rows={4}
              value={form.about}
              onChange={(e) =>
                setForm((f) => ({ ...f, about: e.target.value }))
              }
              className="w-full rounded-md bg-white border border-gray-300 text-gray-800 shadow-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition shadow-sm flex items-center justify-center disabled:opacity-60"
          >
            <Check className="h-5 w-5 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
