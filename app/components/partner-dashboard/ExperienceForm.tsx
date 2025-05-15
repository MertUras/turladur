import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export interface ExperienceFormData {
  name: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  images: string[];
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
};

export default function ExperienceForm({ initialData, onSubmit, isSubmitting = false }: ExperienceFormProps) {
  const [formData, setFormData] = useState<ExperienceFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [imageInput, setImageInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'duration' || name === 'price' ? Number(value) : value }));
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block mb-1 font-medium text-gray-700">Aktivite Adı *</label>
        <input name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-900 placeholder-gray-400" placeholder="Örn. Kapadokya Balon Turu" />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Açıklama *</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-900 placeholder-gray-400" placeholder="Kısa bir açıklama yazın..." />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Kategori</label>
        <input name="category" value={formData.category} onChange={handleChange} className="w-full border rounded px-3 py-2 text-gray-900 placeholder-gray-400" placeholder="Örn. Doğa, Kültür, Macera" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Süre (saat) *</label>
          <input name="duration" type="number" min="1" value={formData.duration} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-900 placeholder-gray-400" placeholder="3" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Fiyat (₺) *</label>
          <input name="price" type="number" min="0" value={formData.price} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-900 placeholder-gray-400" placeholder="Örn. 1500" />
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-700">Görseller</label>
        <div className="flex gap-2 mb-2">
          <input type="text" placeholder="Görsel URL" value={imageInput} onChange={e => setImageInput(e.target.value)} className="flex-1 border rounded px-3 py-2 text-gray-900 placeholder-gray-400" />
          <button type="button" onClick={handleAddImage} className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"><PlusIcon className="h-5 w-5" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.images.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20">
              <Image src={img && img.trim() !== '' ? img : '/images/placeholder.jpg'} alt="Görsel" fill className="object-cover rounded" />
              <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"><XMarkIcon className="h-4 w-4 text-red-500" /></button>
            </div>
          ))}
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
        {isSubmitting ? "Ekleniyor..." : "Aktiviteyi Ekle"}
      </button>
    </form>
  );
} 