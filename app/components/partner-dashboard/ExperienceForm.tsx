import React, { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { PhotoIcon, XMarkIcon, PlusIcon, ClockIcon, CurrencyDollarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { DatePicker } from '../../components/booking/DatePicker';
import { parseJsonArray, parseJsonSchedule } from '@/lib/utils';

export interface ExperienceFormData {
  id?: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  images: string[];
  longDescription: string;
  location: string;
  included: string[];
  notIncluded: string[];
  highlights: string[];
  schedule: { time: string; activity: string }[];
  gallery: string[];
  maxParticipants: number;
  currentParticipants: number;
  activityDates: ActivityDate[];
  meetingPoint?: string;
  ageRestriction: string;
}

interface ActivityDate {
  id?: string;
  experienceId?: string;
  startDate: string;
  endDate: string;
  availableSeats: number;
}

interface ExperienceFormProps {
  initialData?: Partial<ExperienceFormData>;
  onSubmit: (data: ExperienceFormData) => void;
  isSubmitting?: boolean;
}

const defaultFormData: ExperienceFormData = {
  name: '',
  description: '',
  category: '',
  duration: 1,
  price: 0,
  images: [],
  longDescription: '',
  location: '',
  included: [],
  notIncluded: [],
  highlights: [],
  schedule: [],
  gallery: [],
  maxParticipants: 1,
  currentParticipants: 0,
  activityDates: [],
  meetingPoint: '',
  ageRestriction: 'everyone',
};

const categories = [
  "Doğa", "Kültür", "Macera", "Deniz", "Tarihi", "Yemek", "Eğlence", "Spor", "Sanat"
];

// API'den gelen initialData'yı forma güvenli şekilde uygulanabilecek bir
// başlangıç durumuna dönüştürür. Hem ilk state için hem de "değişiklik
// yapıldı mı" karşılaştırması için kullanılan referans anlık görüntüsü
// için tek bir yerden besleniyor.
function buildInitialFormData(initialData?: Partial<ExperienceFormData>): ExperienceFormData {
  return {
    ...defaultFormData,
    ...initialData,
    // API'den gelen Json alanları null ya da (eski/bozuk kayıtlarda)
    // stringify edilmiş metin olabilir; bunlar diziye zorlanmazsa
    // formData.included.map gibi çağrılar patlar.
    images: parseJsonArray<string>(initialData?.images),
    included: parseJsonArray<string>(initialData?.included),
    notIncluded: parseJsonArray<string>(initialData?.notIncluded),
    highlights: parseJsonArray<string>(initialData?.highlights),
    schedule: parseJsonSchedule(initialData?.schedule),
    activityDates: initialData?.activityDates || [],
    // `category` ve `ageRestriction` veritabanında null gelebilir
    // (özellikle ageRestriction opsiyonel bir alan); `<select>` bileşenine
    // null verilirse React "value prop on select should not be null"
    // hatasını fırlatır, bu yüzden burada güvenli varsayılanlara düşülür.
    category: initialData?.category ?? defaultFormData.category,
    ageRestriction: initialData?.ageRestriction ?? defaultFormData.ageRestriction,
  };
}

export default function ExperienceForm({ initialData, onSubmit, isSubmitting = false }: ExperienceFormProps) {
  const [formData, setFormData] = useState<ExperienceFormData>(() => buildInitialFormData(initialData));
  // Düzenleme sırasında hiçbir alan değişmediyse kaydetmeden önce kullanıcıya
  // sormak için formun ilk halinin anlık görüntüsü.
  const initialSnapshotRef = useRef(JSON.stringify(buildInitialFormData(initialData)));
  const [showNoChangesModal, setShowNoChangesModal] = useState(false);
  const [imageInput, setImageInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [includedInput, setIncludedInput] = useState('');
  const [notIncludedInput, setNotIncludedInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const [scheduleTimeInput, setScheduleTimeInput] = useState('');
  const [scheduleActivityInput, setScheduleActivityInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [newDate, setNewDate] = useState({ startDate: '', endDate: '', availableSeats: 1 });
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const isEditMode = Boolean(initialData?.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['duration', 'price', 'maxParticipants', 'currentParticipants'].includes(name) ? Number(value) : value
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
      setImageInput('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleAddGallery = () => {
    if (galleryInput.trim()) {
      setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, galleryInput.trim()] }));
      setGalleryInput('');
    }
  };

  const handleRemoveGallery = (idx: number) => {
    setFormData((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));
  };

  const handleAddIncluded = () => {
    if (includedInput.trim()) {
      setFormData((prev) => ({ ...prev, included: [...prev.included, includedInput.trim()] }));
      setIncludedInput('');
    }
  };

  const handleRemoveIncluded = (idx: number) => {
    setFormData((prev) => ({ ...prev, included: prev.included.filter((_, i) => i !== idx) }));
  };

  const handleAddNotIncluded = () => {
    if (notIncludedInput.trim()) {
      setFormData((prev) => ({ ...prev, notIncluded: [...prev.notIncluded, notIncludedInput.trim()] }));
      setNotIncludedInput('');
    }
  };

  const handleRemoveNotIncluded = (idx: number) => {
    setFormData((prev) => ({ ...prev, notIncluded: prev.notIncluded.filter((_, i) => i !== idx) }));
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormData((prev) => ({ ...prev, highlights: [...prev.highlights, highlightInput.trim()] }));
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setFormData((prev) => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== idx) }));
  };

  const handleAddSchedule = () => {
    if (scheduleTimeInput.trim() && scheduleActivityInput.trim()) {
      setFormData((prev) => ({ ...prev, schedule: [...prev.schedule, { time: scheduleTimeInput.trim(), activity: scheduleActivityInput.trim() }] }));
      setScheduleTimeInput('');
      setScheduleActivityInput('');
    }
  };

  const handleRemoveSchedule = (idx: number) => {
    setFormData((prev) => ({ ...prev, schedule: prev.schedule.filter((_, i) => i !== idx) }));
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  // Görseller `URL.createObjectURL` ile geçici bir blob: URL olarak
  // tutulursa, sayfa yenilendiğinde veya başka bir oturumda bu bağlantı
  // geçersiz kalır ve aktivite detayında fotoğraflar hiç görünmez. Bu
  // yüzden dosyalar seçildiği anda sunucuya yüklenip kalıcı bir URL
  // alınır.
  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setUploadError(null);
    setIsUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        const body = new FormData();
        body.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `${file.name} yüklenemedi`);
        }
        uploadedUrls.push(data.url);
      }
      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Görsel yüklenirken bir hata oluştu');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddDate = () => {
    if (!newDate.startDate || !newDate.endDate || newDate.availableSeats < 1) return;
    setFormData(prev => ({
      ...prev,
      activityDates: [...prev.activityDates, { ...newDate }]
    }));
    setNewDate({ startDate: '', endDate: '', availableSeats: 1 });
  };

  const handleRemoveDate = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      activityDates: prev.activityDates.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isUploadingImages) {
      setError('Görseller yüklenirken lütfen bekleyin.');
      return;
    }

    // Basic validation
    if (!formData.name || !formData.description || !formData.category || formData.price <= 0 || formData.maxParticipants < 1 || formData.images.length === 0) {
      setError('Lütfen tüm zorunlu alanları doldurun ve en az bir görsel ekleyin.');
      return;
    }

    // Düzenleme sırasında hiçbir alan değiştirilmediyse, gereksiz bir
    // kaydetme isteği göndermeden önce kullanıcıya onay soruyoruz.
    if (isEditMode && JSON.stringify(formData) === initialSnapshotRef.current) {
      setShowNoChangesModal(true);
      return;
    }

    onSubmit(formData);
  };

  const handleConfirmSubmitWithoutChanges = () => {
    setShowNoChangesModal(false);
    onSubmit(formData);
  };

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-10">
        <h2 className="text-2xl font-bold text-sky-800 mb-2">Aktivite Bilgileri</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Aktivite Adı *</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" placeholder="Örn. Kapadokya Balon Turu" />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Açıklama *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" placeholder="Kısa bir açıklama yazın..." />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Kategori</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition bg-white"
            >
              <option value="">Kategori seçin</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Süre (saat) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500"><ClockIcon className="w-5 h-5" /></span>
                <input
                  name="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="w-full border border-neutral-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition text-base"
                  placeholder="3"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Fiyat (₺) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500"><CurrencyDollarIcon className="w-5 h-5" /></span>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-neutral-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition text-base"
                  placeholder="Örn. 1500"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Maksimum Katılımcı *</label>
              <input
                name="maxParticipants"
                type="number"
                min={1}
                value={formData.maxParticipants}
                onChange={handleChange}
                required
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition"
                placeholder="Örn. 20"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-gray-700">Mevcut Katılımcı</label>
              <input
                name="currentParticipants"
                type="number"
                min={0}
                value={formData.currentParticipants}
                onChange={handleChange}
                className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition"
                placeholder="Örn. 0"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Yaş Sınırı</label>
            <select
              name="ageRestriction"
              value={formData.ageRestriction}
              onChange={handleChange}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition bg-white"
            >
              <option value="everyone">Herkes Katılabilir</option>
              <option value="18+">+18</option>
            </select>
          </div>
        </div>
        <hr className="my-6 border-neutral-200" />
        <h3 className="text-lg font-semibold text-sky-700 mb-2">Görseller</h3>
        <div className="space-y-2">
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition p-6 mb-2 ${dragActive ? 'border-sky-500 bg-sky-50' : 'border-neutral-300 bg-neutral-100 hover:border-sky-400'} ${isUploadingImages ? 'opacity-60 pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleImageDrop}
            onClick={handleDropZoneClick}
          >
            <PhotoIcon className="w-10 h-10 text-sky-400 mb-2" />
            <span className="text-sky-700 font-medium">
              {isUploadingImages ? 'Görseller yükleniyor...' : 'Görseli buraya sürükleyin veya tıklayın'}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageInputChange}
              disabled={isUploadingImages}
            />
          </div>
          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Görsel URL" value={imageInput} onChange={e => setImageInput(e.target.value)} className="flex-1 border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" />
            <button type="button" onClick={handleAddImage} className="bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition"><PlusIcon className="h-5 w-5" /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20">
                <Image src={img && img.trim() !== '' ? img : '/images/placeholder.jpg'} alt="Görsel" fill className="object-cover rounded-lg border border-neutral-200" />
                <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"><XMarkIcon className="h-4 w-4 text-red-500" /></button>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-6 border-neutral-200" />
        <h3 className="text-lg font-semibold text-sky-700 mb-2">Detaylar</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Detaylı Açıklama</label>
            <textarea name="longDescription" value={formData.longDescription} onChange={handleChange} className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" placeholder="Detaylı açıklama yazın..." />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Lokasyon</label>
            <input name="location" value={formData.location} onChange={handleChange} className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" placeholder="Örn. Kapadokya, Nevşehir" />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Buluşma Noktası (Google Maps Linki)</label>
            <input name="meetingPoint" value={formData.meetingPoint || ''} onChange={handleChange} className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" placeholder="https://maps.google.com/..." />
          </div>
        </div>
        <hr className="my-6 border-neutral-200" />
        <h3 className="text-lg font-semibold text-sky-700 mb-2">Hizmetler & Öne Çıkanlar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Dahil Olanlar</label>
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="Hizmet ekle" value={includedInput} onChange={e => setIncludedInput(e.target.value)} className="flex-1 border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" />
              <button type="button" onClick={handleAddIncluded} className="bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition"><PlusIcon className="h-5 w-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.included.map((item, idx) => (
                <div key={idx} className="flex items-center bg-sky-100 rounded-full px-3 py-1 text-sky-800 text-sm font-medium shadow-sm">
                  <span>{item}</span>
                  <button type="button" onClick={() => handleRemoveIncluded(idx)} className="ml-2 text-red-500"><XMarkIcon className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Dahil Olmayanlar</label>
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="Hariç hizmet ekle" value={notIncludedInput} onChange={e => setNotIncludedInput(e.target.value)} className="flex-1 border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" />
              <button type="button" onClick={handleAddNotIncluded} className="bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition"><PlusIcon className="h-5 w-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.notIncluded.map((item, idx) => (
                <div key={idx} className="flex items-center bg-rose-100 rounded-full px-3 py-1 text-rose-800 text-sm font-medium shadow-sm">
                  <span>{item}</span>
                  <button type="button" onClick={() => handleRemoveNotIncluded(idx)} className="ml-2 text-red-500"><XMarkIcon className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold text-gray-700">Öne Çıkanlar</label>
            <div className="flex gap-2 mb-2">
              <input type="text" placeholder="Öne çıkan ekle" value={highlightInput} onChange={e => setHighlightInput(e.target.value)} className="flex-1 border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" />
              <button type="button" onClick={handleAddHighlight} className="bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition"><PlusIcon className="h-5 w-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.highlights.map((item, idx) => (
                <div key={idx} className="flex items-center bg-yellow-100 rounded-full px-3 py-1 text-yellow-800 text-sm font-medium shadow-sm">
                  <span>{item}</span>
                  <button type="button" onClick={() => handleRemoveHighlight(idx)} className="ml-2 text-red-500"><XMarkIcon className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr className="my-6 border-neutral-200" />
        <h3 className="text-lg font-semibold text-sky-700 mb-2">Program Akışı</h3>
        <div className="space-y-2">
          <div className="flex gap-2 mb-2">
            <input type="time" value={scheduleTimeInput} onChange={e => setScheduleTimeInput(e.target.value)} className="w-32 border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" />
            <input type="text" placeholder="Açıklama" value={scheduleActivityInput} onChange={e => setScheduleActivityInput(e.target.value)} className="flex-1 border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition" />
            <button type="button" onClick={handleAddSchedule} className="bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition"><PlusIcon className="h-5 w-5" /></button>
          </div>
          <div className="flex flex-col gap-2">
            {formData.schedule.map((item, idx) => (
              <div key={idx} className="flex items-center bg-neutral-100 rounded-lg px-3 py-1 text-neutral-800 text-sm font-medium shadow-sm">
                <span className="font-mono text-xs mr-2">{item.time}</span>
                <span>{item.activity}</span>
                <button type="button" onClick={() => handleRemoveSchedule(idx)} className="ml-2 text-red-500"><XMarkIcon className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
        <hr className="my-6 border-neutral-200" />
        <h3 className="text-lg font-semibold text-sky-700 mb-2">Aktivite Tarihleri</h3>
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
              <div className="sm:col-span-2">
                <DatePicker
                  label="Başlangıç Tarihi"
                  value={newDate.startDate}
                  onChange={(date) => setNewDate({ ...newDate, startDate: date })}
                />
              </div>
              <div className="sm:col-span-2">
                <DatePicker
                  label="Bitiş Tarihi"
                  value={newDate.endDate}
                  onChange={(date) => setNewDate({ ...newDate, endDate: date })}
                  minDate={newDate.startDate}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="new-date-available-seats" className="block mb-2 text-sm font-medium text-gray-700">Kontenjan</label>
                <input
                  type="number"
                  id="new-date-available-seats"
                  value={newDate.availableSeats}
                  onChange={(e) => setNewDate({ ...newDate, availableSeats: parseInt(e.target.value) || 1 })}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition"
                  min="1"
                />
              </div>
            </div>
            <button 
              type="button" 
              onClick={handleAddDate} 
              className="w-full bg-sky-600 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-700 transition flex items-center justify-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Tarih Ekle
            </button>
        </div>

        {formData.activityDates.length > 0 && (
          <ul className="mt-6 space-y-3">
            <h4 className="text-base font-semibold text-gray-700">Eklenen Tarihler</h4>
            {formData.activityDates.map((date, dateIdx) => (
              <li key={date.id || dateIdx} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(date.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(date.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Kontenjan: {date.availableSeats} kişi
                    </p>
                  </div>
                  <button type="button" onClick={() => handleRemoveDate(dateIdx)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <button
          type="submit"
          disabled={isSubmitting || isUploadingImages}
          className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-sky-700 transition mt-4 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? (isEditMode ? "Güncelleniyor..." : "Ekleniyor...")
            : isUploadingImages
            ? "Görseller yükleniyor..."
            : (isEditMode ? "Aktiviteyi Güncelle" : "Aktiviteyi Ekle")}
        </button>
      </form>

      <Dialog
        open={showNoChangesModal}
        onClose={() => setShowNoChangesModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full rounded-lg bg-white p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-amber-100">
                <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Herhangi bir değişiklik yapmadınız
                </Dialog.Title>
                <p className="mt-2 text-sm text-gray-600">
                  Aktivite bilgilerinde herhangi bir değişiklik yapmadınız. Devam etmek istiyor musunuz?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowNoChangesModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmitWithoutChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Devam Et
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 