import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PickupPoint {
  id?: string;
  city: string;
  location: string;
  time: string;
  description?: string;
  order: number;
  isActive: boolean;
}

interface PickupPointFormProps {
  pickupPoints: PickupPoint[];
  onChange: (points: PickupPoint[]) => void;
}

export default function PickupPointForm({ pickupPoints, onChange }: PickupPointFormProps) {
  const handleAddPoint = () => {
    const newPoint: PickupPoint = {
      city: '',
      location: '',
      time: '',
      description: '',
      order: pickupPoints.length,
      isActive: true
    };
    onChange([...pickupPoints, newPoint]);
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = pickupPoints.filter((_, i) => i !== index);
    // Sıralamayı güncelle
    const updatedPoints = newPoints.map((point, i) => ({
      ...point,
      order: i
    }));
    onChange(updatedPoints);
  };

  const handlePointChange = (index: number, field: keyof PickupPoint, value: string | boolean) => {
    const newPoints = [...pickupPoints];
    newPoints[index] = {
      ...newPoints[index],
      [field]: value
    };
    onChange(newPoints);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Yolcu Alma Noktaları</h3>
        <button
          type="button"
          onClick={handleAddPoint}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Nokta Ekle
        </button>
      </div>

      <div className="space-y-4">
        {pickupPoints.map((point, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-900">Şehir</label>
                <input
                  type="text"
                  value={point.city}
                  onChange={(e) => handlePointChange(index, 'city', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                  placeholder="İstanbul"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">Konum</label>
                <input
                  type="text"
                  value={point.location}
                  onChange={(e) => handlePointChange(index, 'location', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                  placeholder="AŞTİ Terminali"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">Saat</label>
                <input
                  type="time"
                  value={point.time}
                  onChange={(e) => handlePointChange(index, 'time', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">Açıklama</label>
                <input
                  type="text"
                  value={point.description || ''}
                  onChange={(e) => handlePointChange(index, 'description', e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                  placeholder="Terminal 2 önü"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemovePoint(index)}
              className="p-2 text-gray-500 hover:text-red-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 