import React, { useState, useEffect } from 'react';
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useDropzone, FileWithPath } from 'react-dropzone';

interface ImageFile {
  file: File | FileWithPath;
  preview: string;
}

export interface TourFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  duration: string;
  maxParticipants: number;
  images: ImageFile[];
  includes: string[];
  excludes: string[];
  itinerary: { title: string; description: string }[];
  status: 'active' | 'draft' | 'archived';
  departureCity: string;
  region: string;
  transportation: string;
  period: string;
  tourType: string;
  accommodationType: string;
  difficultyLevel: string;
  ageRestriction: number;
  languages: string[];
  tags: string[];
  startDate: string;
  endDate: string;
  discount: number;
  destinations: string[];
}

interface TourFormProps {
  initialData?: Partial<TourFormData>;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
  currentStep?: 'basic' | 'details';
  partnerId?: string;
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
  status: 'draft',
  departureCity: '',
  region: '',
  transportation: '',
  period: '',
  tourType: '',
  accommodationType: '',
  difficultyLevel: '',
  ageRestriction: 0,
  languages: ['Türkçe'],
  tags: [],
  startDate: '',
  endDate: '',
  discount: 0,
  destinations: []
};

export default function TourForm({ initialData, onSubmit, isSubmitting = false, currentStep = 'basic', partnerId }: TourFormProps) {
  const [formData, setFormData] = useState<TourFormData>({ ...defaultFormData, ...initialData });
  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof TourFormData, string>>>({});

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  });

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
    const placeholderUrl = `https://source.unsplash.com/random/800x600/?travel&sig=${randomId}`;
    
    // Sadece demo amaçlı olarak bir Blob oluşturup dosya gibi davranıyoruz
    fetch(placeholderUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], `demo-image-${randomId}.jpg`, { type: 'image/jpeg' });
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { file, preview: placeholderUrl }]
        }));
      });
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
    if (!formData.departureCity) newErrors.departureCity = 'Kalkış şehri gerekli';
    if (!formData.region) newErrors.region = 'Bölge gerekli';
    if (!formData.duration) newErrors.duration = 'Süre gerekli';
    if (!formData.maxParticipants) newErrors.maxParticipants = 'Maksimum katılımcı sayısı gerekli';
    if (!formData.startDate) newErrors.startDate = 'Başlangıç tarihi gerekli';
    if (!formData.endDate) newErrors.endDate = 'Bitiş tarihi gerekli';
    if (!formData.transportation) newErrors.transportation = 'Ulaşım tipi gerekli';
    if (!formData.tourType) newErrors.tourType = 'Tur tipi gerekli';
    if (formData.images.length === 0) newErrors.images = 'En az bir resim gerekli';
    
    // Tarih kontrolü
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form gönderimi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = partnerId ? { ...formData, tourOperatorId: partnerId } : formData;
      onSubmit(submitData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Temel Bilgiler */}
      {currentStep === 'basic' && (
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-900">
              Tur Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`block w-full rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
              placeholder="Muhteşem Kapadokya Turu"
            />
            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-900">
              Açıklama <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`block w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
              placeholder="Turunuzu detaylı bir şekilde açıklayın..."
            />
            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-900">
                Fiyat (₺) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500">₺</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  className={`block w-full rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-300'} pl-8 pr-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                  placeholder="1500"
                  min="0"
                />
              </div>
              {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="discount" className="mb-2 block text-sm font-medium text-gray-900">
                İndirim Oranı (%)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500">%</span>
                </div>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  value={formData.discount || ''}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 pr-8 pl-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="departureCity" className="mb-2 block text-sm font-medium text-gray-900">
                Kalkış Şehri <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="departureCity"
                name="departureCity"
                value={formData.departureCity}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.departureCity ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                placeholder="İstanbul"
              />
              {errors.departureCity && <p className="mt-2 text-sm text-red-600">{errors.departureCity}</p>}
            </div>

            <div>
              <label htmlFor="region" className="mb-2 block text-sm font-medium text-gray-900">
                Bölge <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.region ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                placeholder="Marmara"
              />
              {errors.region && <p className="mt-2 text-sm text-red-600">{errors.region}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="duration" className="mb-2 block text-sm font-medium text-gray-900">
                Süre (Gün) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration || ''}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.duration ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                placeholder="3"
                min="1"
              />
              {errors.duration && <p className="mt-2 text-sm text-red-600">{errors.duration}</p>}
            </div>

            <div>
              <label htmlFor="maxParticipants" className="mb-2 block text-sm font-medium text-gray-900">
                Maksimum Katılımcı <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants || ''}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.maxParticipants ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
                placeholder="20"
                min="1"
              />
              {errors.maxParticipants && <p className="mt-2 text-sm text-red-600">{errors.maxParticipants}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-gray-900">
                Başlangıç Tarihi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
              />
              {errors.startDate && <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="mb-2 block text-sm font-medium text-gray-900">
                Bitiş Tarihi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
              />
              {errors.endDate && <p className="mt-2 text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="transportation" className="mb-2 block text-sm font-medium text-gray-900">
                Ulaşım Tipi <span className="text-red-500">*</span>
              </label>
              <select
                id="transportation"
                name="transportation"
                value={formData.transportation}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.transportation ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
              >
                <option value="">Seçiniz</option>
                <option value="Otobüs">Otobüs</option>
                <option value="Uçak">Uçak</option>
                <option value="Tren">Tren</option>
                <option value="Minibüs">Minibüs</option>
                <option value="Özel Araç">Özel Araç</option>
              </select>
              {errors.transportation && <p className="mt-2 text-sm text-red-600">{errors.transportation}</p>}
            </div>

            <div>
              <label htmlFor="tourType" className="mb-2 block text-sm font-medium text-gray-900">
                Tur Tipi <span className="text-red-500">*</span>
              </label>
              <select
                id="tourType"
                name="tourType"
                value={formData.tourType}
                onChange={handleChange}
                className={`block w-full rounded-lg border ${errors.tourType ? 'border-red-500' : 'border-gray-300'} px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900`}
              >
                <option value="">Seçiniz</option>
                <option value="Kültür Turu">Kültür Turu</option>
                <option value="Doğa Turu">Doğa Turu</option>
                <option value="Balayı Turu">Balayı Turu</option>
                <option value="Yemek Turu">Yemek Turu</option>
                <option value="Macera Turu">Macera Turu</option>
                <option value="Günübirlik Tur">Günübirlik Tur</option>
              </select>
              {errors.tourType && <p className="mt-2 text-sm text-red-600">{errors.tourType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="accommodationType" className="mb-2 block text-sm font-medium text-gray-900">
                Konaklama Tipi
              </label>
              <select
                id="accommodationType"
                name="accommodationType"
                value={formData.accommodationType}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Seçiniz</option>
                <option value="Otel">Otel</option>
                <option value="Pansiyon">Pansiyon</option>
                <option value="Apart">Apart</option>
                <option value="Butik Otel">Butik Otel</option>
                <option value="Kamp">Kamp</option>
              </select>
            </div>

            <div>
              <label htmlFor="difficultyLevel" className="mb-2 block text-sm font-medium text-gray-900">
                Zorluk Seviyesi
              </label>
              <select
                id="difficultyLevel"
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              >
                <option value="">Seçiniz</option>
                <option value="Kolay">Kolay</option>
                <option value="Orta">Orta</option>
                <option value="Zor">Zor</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="ageRestriction" className="mb-2 block text-sm font-medium text-gray-900">
              Yaş Sınırı
            </label>
            <input
              type="number"
              id="ageRestriction"
              name="ageRestriction"
              value={formData.ageRestriction || ''}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              Tur Resimleri <span className="text-red-500">*</span>
            </label>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed ${errors.images ? 'border-red-500' : 'border-gray-300'} px-6 py-8 text-center hover:bg-gray-50`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <PhotoIcon className="h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">Resim yüklemek için tıklayın veya sürükleyin</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF dosyaları, 10MB'a kadar</p>
              </div>
            </div>
            {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
            
            {formData.images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 relative">
                      <Image
                        src={image.preview}
                        alt={`Tour image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detaylar Bölümü */}
      {currentStep === 'details' && (
        <>
          {/* Dahil Olanlar & Olmayanlar */}
          <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-5">Dahil Olanlar & Olmayanlar</h2>
            
            <div className="grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2">
              {/* Dahil Olanlar */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Dahil Olanlar</h3>
                <div className="mt-2">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newInclude}
                      onChange={(e) => setNewInclude(e.target.value)}
                      className="shadow-sm px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg text-gray-900"
                      placeholder="Örn. Profesyonel rehberlik"
                    />
                    <button
                      type="button"
                      onClick={handleAddInclude}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ekle
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {formData.includes.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg text-sm">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInclude(index)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dahil Olmayanlar */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Dahil Olmayanlar</h3>
                <div className="mt-2">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newExclude}
                      onChange={(e) => setNewExclude(e.target.value)}
                      className="shadow-sm px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg text-gray-900"
                      placeholder="Örn. Kişisel harcamalar"
                    />
                    <button
                      type="button"
                      onClick={handleAddExclude}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Ekle
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {formData.excludes.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg text-sm">
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExclude(index)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Program (Itinerary) */}
          <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-100 mt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-medium text-gray-900">Tur Programı</h2>
              <button
                type="button"
                onClick={handleAddItineraryDay}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Gün Ekle
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.itinerary.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-full sm:w-1/3 mr-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Başlık
                      </label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                        className="mt-1 shadow-sm px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg text-gray-900"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Açıklama
                    </label>
                    <textarea
                      rows={4}
                      value={day.description}
                      onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                      className="mt-1 shadow-sm px-4 py-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-lg text-gray-900"
                      placeholder="Bu günün programını detaylı anlatın..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Form Gönderme */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          className="px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
} 