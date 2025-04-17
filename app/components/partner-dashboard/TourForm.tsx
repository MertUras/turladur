import { useState, useEffect } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export interface TourFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  duration: string;
  maxParticipants: number;
  images: string[];
  includes: string[];
  excludes: string[];
  itinerary: { title: string; description: string }[];
  status: 'active' | 'draft' | 'archived';
}

interface TourFormProps {
  initialData?: Partial<TourFormData>;
  onSubmit: (data: TourFormData) => void;
  isSubmitting?: boolean;
}

const defaultFormData: TourFormData = {
  title: '',
  description: '',
  price: '',
  location: '',
  duration: '',
  maxParticipants: 10,
  images: [],
  includes: ['Rehber', 'Ulaşım', 'Öğle yemeği'],
  excludes: ['Akşam yemeği', 'Kişisel harcamalar'],
  itinerary: [{ title: '1. Gün', description: '' }],
  status: 'draft'
};

export default function TourForm({ initialData, onSubmit, isSubmitting = false }: TourFormProps) {
  const [formData, setFormData] = useState<TourFormData>({ ...defaultFormData, ...initialData });
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof TourFormData, string>>>({});

  // Form değişikliklerini yönet
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Hata varsa temizle
    if (errors[name as keyof TourFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Sayısal değerleri yönet
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numberValue = parseInt(value);
    if (!isNaN(numberValue)) {
      setFormData(prev => ({ ...prev, [name]: numberValue }));
      if (errors[name as keyof TourFormData]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  // Dahil olanları yönet
  const handleAddInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, newInclude.trim()]
      }));
      setNewInclude('');
    }
  };

  const handleRemoveInclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  // Hariç olanları yönet
  const handleAddExclude = () => {
    if (newExclude.trim()) {
      setFormData(prev => ({
        ...prev,
        excludes: [...prev.excludes, newExclude.trim()]
      }));
      setNewExclude('');
    }
  };

  const handleRemoveExclude = (index: number) => {
    setFormData(prev => ({
      ...prev,
      excludes: prev.excludes.filter((_, i) => i !== index)
    }));
  };

  // Program (itinerary) yönetimi
  const handleItineraryChange = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const handleAddItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { title: `${prev.itinerary.length + 1}. Gün`, description: '' }]
    }));
  };

  const handleRemoveItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
    }));
  };

  // Resim ekleme - gerçek uygulamada resim yükleme API'si kullanılır
  const handleAddImage = () => {
    // Demo için rasgele bir resim URL'i ekliyoruz
    const randomId = Math.floor(Math.random() * 1000);
    const placeholderImage = `https://source.unsplash.com/random/800x600/?travel&sig=${randomId}`;
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, placeholderImage]
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Form doğrulama
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TourFormData, string>> = {};
    
    if (!formData.title) newErrors.title = 'Tur adı gerekli';
    if (!formData.description) newErrors.description = 'Açıklama gerekli';
    if (!formData.price) newErrors.price = 'Fiyat gerekli';
    if (!formData.location) newErrors.location = 'Konum gerekli';
    if (!formData.duration) newErrors.duration = 'Süre gerekli';
    if (formData.images.length === 0) newErrors.images = 'En az bir resim gerekli';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Temel Bilgiler */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Tur Bilgileri</h2>
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Tur Adı */}
          <div className="sm:col-span-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Tur Adı
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.title ? 'border-red-300' : ''}`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
          </div>

          {/* Fiyat */}
          <div className="sm:col-span-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Fiyat (₺)
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="1500"
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.price ? 'border-red-300' : ''}`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
          </div>

          {/* Konum */}
          <div className="sm:col-span-3">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Konum
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Kapadokya, Nevşehir"
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.location ? 'border-red-300' : ''}`}
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
          </div>

          {/* Süre */}
          <div className="sm:col-span-2">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Süre
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="duration"
                id="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="2 gün 1 gece"
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.duration ? 'border-red-300' : ''}`}
              />
              {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
            </div>
          </div>

          {/* Katılımcı Sayısı */}
          <div className="sm:col-span-1">
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
              Maksimum Kişi
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="maxParticipants"
                id="maxParticipants"
                min="1"
                value={formData.maxParticipants}
                onChange={handleNumberChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Açıklama */}
          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.description ? 'border-red-300' : ''}`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Turunuzun detaylı açıklamasını yazın.
            </p>
          </div>

          {/* Durum */}
          <div className="sm:col-span-2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Durum
            </label>
            <div className="mt-1">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="draft">Taslak</option>
                <option value="active">Aktif</option>
                <option value="archived">Arşivlenmiş</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resimler */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Tur Resimleri</h2>
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Resimler</h3>
                <p className="text-xs text-gray-500">JPG, PNG veya GIF, maksimum 10MB</p>
              </div>
              <button
                type="button"
                onClick={handleAddImage}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PhotoIcon className="h-4 w-4 mr-1" />
                Resim Ekle
              </button>
            </div>
            
            {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
            
            {formData.images.length > 0 ? (
              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 relative">
                      <Image
                        src={image}
                        alt={`Tour image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <p>Yüklemek için resim seçin veya sürükleyin</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dahil Olanlar & Olmayanlar */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Dahil Olanlar & Olmayanlar</h2>
        
        <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
          {/* Dahil Olanlar */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">Dahil Olanlar</h3>
            <div className="mt-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newInclude}
                  onChange={(e) => setNewInclude(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Örn. Profesyonel rehberlik"
                />
                <button
                  type="button"
                  onClick={handleAddInclude}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Ekle
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md text-sm">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInclude(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dahil Olmayanlar */}
          <div>
            <h3 className="text-sm font-medium text-gray-700">Dahil Olmayanlar</h3>
            <div className="mt-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newExclude}
                  onChange={(e) => setNewExclude(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Örn. Kişisel harcamalar"
                />
                <button
                  type="button"
                  onClick={handleAddExclude}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Ekle
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {formData.excludes.map((item, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md text-sm">
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExclude(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Program (Itinerary) */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Tur Programı</h2>
          <button
            type="button"
            onClick={handleAddItineraryDay}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Gün Ekle
          </button>
        </div>
        
        <div className="space-y-6">
          {formData.itinerary.map((day, index) => (
            <div key={index} className="border border-gray-100 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-full sm:w-1/3 mr-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Başlık
                  </label>
                  <input
                    type="text"
                    value={day.title}
                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItineraryDay(index)}
                  className="text-gray-400 hover:text-gray-500"
                  disabled={formData.itinerary.length === 1}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <textarea
                  rows={3}
                  value={day.description}
                  onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Bu günün programını detaylı anlatın..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Gönderme */}
      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
} 