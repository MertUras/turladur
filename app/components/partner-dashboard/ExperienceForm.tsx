import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon, PlusIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { DatePicker } from '../../components/booking/DatePicker';

export interface ExperienceFormData {
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
  activityDates: { startDate: string; endDate: string; price: number; availableSeats: number }[];
  meetingPoint?: string;
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
};

const categories = [
  "Doğa", "Kültür", "Macera", "Deniz", "Tarihi", "Yemek", "Eğlence", "Spor", "Sanat"
];

export default function ExperienceForm({ initialData, onSubmit, isSubmitting = false }: ExperienceFormProps) {
  const [formData, setFormData] = useState<ExperienceFormData>({
    ...defaultFormData,
    ...initialData,
  });
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
  const [newDate, setNewDate] = useState({ startDate: '', endDate: '', price: 0, availableSeats: 1 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'price' || name === 'maxParticipants' || name === 'currentParticipants' ? Number(value) : value
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

  const handleFiles = (files: File[]) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
      }
    });
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
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
    if (!newDate.startDate || !newDate.endDate || newDate.price < 0 || newDate.availableSeats < 1) return;
    setFormData(prev => ({
      ...prev,
      activityDates: [...prev.activityDates, { ...newDate }]
    }));
    setNewDate({ startDate: '', endDate: '', price: 0, availableSeats: 1 });
  };

  const handleRemoveDate = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      activityDates: prev.activityDates.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.duration || !formData.price) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setError(null);
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
        </div>
        <hr className="my-6 border-neutral-200" />
        <h3 className="text-lg font-semibold text-sky-700 mb-2">Görseller</h3>
        <div className="space-y-2">
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition p-6 mb-2 ${dragActive ? 'border-sky-500 bg-sky-50' : 'border-neutral-300 bg-neutral-100 hover:border-sky-400'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleImageDrop}
            onClick={handleDropZoneClick}
          >
            <PhotoIcon className="w-10 h-10 text-sky-400 mb-2" />
            <span className="text-sky-700 font-medium">Görseli buraya sürükleyin veya tıklayın</span>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageInputChange}
            />
          </div>
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
        <div className="space-y-2">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Başlangıç</label>
              <DatePicker
                label=""
                value={newDate.startDate}
                onChange={date => setNewDate(nd => ({ ...nd, startDate: date }))}
                placeholder="gg.aa.yyyy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Bitiş</label>
              <DatePicker
                label=""
                value={newDate.endDate}
                onChange={date => setNewDate(nd => ({ ...nd, endDate: date }))}
                placeholder="gg.aa.yyyy"
                minDate={newDate.startDate}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Fiyat (₺)</label>
              <input type="number" min={0} value={newDate.price} onChange={e => setNewDate(nd => ({ ...nd, price: Number(e.target.value) }))} className="border border-neutral-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition w-24" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Kontenjan</label>
              <input type="number" min={1} value={newDate.availableSeats} onChange={e => setNewDate(nd => ({ ...nd, availableSeats: Number(e.target.value) }))} className="border border-neutral-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-sky-300 focus:border-sky-500 transition w-20" />
            </div>
            <button type="button" onClick={handleAddDate} className="bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition flex items-center"><PlusIcon className="h-5 w-5" /></button>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {formData.activityDates.map((date, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-neutral-100 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-700">{date.startDate} - {date.endDate}</span>
                <span className="text-sm text-gray-700">{date.price} ₺</span>
                <span className="text-sm text-gray-700">{date.availableSeats} kişilik</span>
                <button type="button" onClick={() => handleRemoveDate(idx)} className="ml-auto text-red-500 hover:text-red-700"><XMarkIcon className="h-5 w-5" /></button>
              </div>
            ))}
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <button type="submit" disabled={isSubmitting} className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-sky-700 transition mt-4 shadow-md">
          {isSubmitting ? "Ekleniyor..." : "Aktiviteyi Ekle"}
        </button>
      </form>
    </div>
  );
} 