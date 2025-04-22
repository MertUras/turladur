'use client';

import { useState } from 'react';
import { PencilIcon, UserGroupIcon, CalendarIcon, StarIcon, UserCircleIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

interface ProfileInfoTabProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    birthDate?: string;
    address?: string;
    membershipStatus: string;
    memberSince: string;
    points: number;
    pointsLevel: string;
    avatarUrl?: string;
  } | null;
}

const dummyUser = {
  id: 'user123',
  name: 'Hasan Mert Öğüt',
  email: 'hasan@ikas.com',
  phone: '+90 555 123 45 67',
  birthDate: '1990-01-01',
  address: 'Teknopark İstanbul No:1/4A/201, Pendik, İstanbul',
  membershipStatus: 'Premium Üye',
  memberSince: '2023-01-01',
  points: 2450,
  pointsLevel: 'Gold',
  avatarUrl: '/avatar-placeholder.png',
};

export default function ProfileInfoTab({ user: initialUser }: ProfileInfoTabProps) {
  const user = initialUser || dummyUser;
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '', 
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    address: user?.address || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    console.log('Saving profile:', formData);
    if (avatarFile) {
      console.log('Uploading avatar:', avatarFile.name);
      // TODO: Implement avatar upload logic
    }
    // TODO: Implement API call to save formData
    setIsEditing(false);
    toast.success('Profil bilgileri güncellendi');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      birthDate: user?.birthDate || '',
      address: user?.address || '',
    });
    setAvatarFile(null);
    setAvatarPreview(user?.avatarUrl || null);
    setIsEditing(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));
    } catch { return '-'; }
  };

  return (
    <div className="space-y-8 mt-16"> 
      {/* Header - Refined */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Profil Bilgileri</h2>
          <p className="mt-1 text-sm text-neutral-600">Kişisel bilgilerinizi ve üyelik detaylarınızı görüntüleyin veya güncelleyin.</p>
        </div>
        {/* Edit/Cancel Buttons - Refined */}
        <button
          type="button"
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className={`inline-flex items-center justify-center px-4 py-2 border text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-300`}
        >
          {isEditing ? (
            <><XMarkIcon className="h-4 w-4 mr-1.5" /><span>İptal</span></>
          ) : (
            <><PencilIcon className="h-4 w-4 mr-1.5" /><span>Düzenle</span></>
          )}
        </button>
      </div>
      
      {/* Profile Info Form/Display - Refined */}
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
         {/* Avatar Section */}
         <div className="flex items-center gap-5 p-5 bg-white rounded-xl border border-neutral-200/50 shadow-sm">
           <div className="relative h-20 w-20 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center flex-shrink-0">
             {avatarPreview ? (
               <Image src={avatarPreview} alt="Profil Resmi" layout="fill" objectFit="cover" />
             ) : (
               <UserCircleIcon className="h-12 w-12 text-neutral-400" />
             )}
             {isEditing && (
               <label 
                 htmlFor="avatar-upload"
                 className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-full"
               >
                 <PencilIcon className="h-5 w-5 mb-1" />
                 <span className="text-xs">Değiştir</span>
                 <input id="avatar-upload" name="avatar" type="file" className="sr-only" onChange={handleAvatarChange} accept="image/*" />
               </label>
             )}
           </div>
           <div className="flex-grow">
             <p className="text-lg font-semibold text-neutral-900">{isEditing ? formData.name : user?.name || '-'}</p>
             <p className="text-sm text-neutral-600">{user?.email || '-'}</p>
            {isEditing && (
             <div className="mt-2">
               <label 
                  htmlFor="avatar-upload-button" 
                  className="inline-flex items-center px-3 py-1.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Resim Seç
                </label>
                <input id="avatar-upload-button" name="avatar-btn" type="file" className="sr-only" onChange={handleAvatarChange} accept="image/*" />
                {avatarPreview && avatarFile && (
                  <button type="button" onClick={() => { setAvatarFile(null); setAvatarPreview(user?.avatarUrl || null); }} className="ml-2 text-xs text-red-600 hover:text-red-800">
                    Kaldır
                  </button>
                )}
             </div>
            )}
           </div>
         </div>

        {/* Personal Details in a Card */} 
        <div className="bg-white rounded-xl border border-neutral-200/50 shadow-sm p-5">
          <h3 className="text-base font-semibold text-neutral-900 mb-4">Kişisel Detaylar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">Ad Soyad</label>
              {isEditing ? (
                <input
                  type="text" id="name" name="name" required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
              ) : (
                <p className="text-sm text-neutral-800 pt-1.5">{user?.name || '-'}</p>
              )}
            </div>
            
            {/* Email (Display Only Example) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">E-posta Adresi</label>
               <p className="text-sm text-neutral-800 pt-1.5">{user?.email || '-'}</p>
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">Telefon Numarası</label>
              {isEditing ? (
                <input
                  type="tel" id="phone" name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  placeholder='+90 5XX XXX XX XX'
                />
              ) : (
                <p className="text-sm text-neutral-800 pt-1.5">{user?.phone || '-'}</p>
              )}
            </div>
            
            {/* Birth Date */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-neutral-700 mb-1.5">Doğum Tarihi</label>
              {isEditing ? (
                <input
                  type="date" id="birthDate" name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                />
              ) : (
                <p className="text-sm text-neutral-800 pt-1.5">{formatDate(user?.birthDate)}</p>
              )}
            </div>

             {/* Address */} 
             <div className="md:col-span-2">
               <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1.5">Adres</label>
               {isEditing ? (
                 <textarea
                   id="address" name="address" rows={3}
                   value={formData.address}
                   onChange={handleInputChange}
                   className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                 />
               ) : (
                 <p className="text-sm text-neutral-800 pt-1.5 whitespace-pre-line">{user?.address || '-'}</p>
               )}
             </div>
          </div>
        </div>
        
        {/* Save Button (only in editing mode) */}
        {isEditing && (
          <div className="flex justify-end pt-5">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <CheckIcon className="h-4 w-4 mr-1.5" />
              Değişiklikleri Kaydet
            </button>
          </div>
        )}
      </form>
      
      {/* Membership Info Section - Refined */}
      {!isEditing && user && (
        <div className="bg-white rounded-xl border border-neutral-200/50 shadow-sm">
          <h3 className="text-base font-semibold text-neutral-900 p-5 border-b border-neutral-100">Üyelik Bilgileri</h3>
          <div className="divide-y divide-neutral-100">
            {/* Membership Status */}
            <div className="flex justify-between items-center p-5 gap-4">
              <div className="flex items-center gap-3">
                <UserGroupIcon className="h-5 w-5 text-sky-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-800">Üyelik Durumu</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{user.membershipStatus || '-'}</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 ring-1 ring-inset ring-green-200">
                Aktif
              </span>
            </div>
            
            {/* Member Since */}
            <div className="flex justify-between items-center p-5 gap-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-neutral-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-800">Üyelik Başlangıcı</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{formatDate(user.memberSince)} tarihinden beri</p>
                </div>
              </div>
            </div>
            
            {/* Points Status */}
            <div className="flex justify-between items-center p-5 gap-4">
              <div className="flex items-center gap-3">
                <StarIcon className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-800">Puan Durumu</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{user.points || 0} puan ({user.pointsLevel || '-'} seviye)</p>
                </div>
              </div>
              <Link 
                href="/rewards" // Assuming a rewards page exists
                className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
              >
                Puanları Yönet
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 