'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  isGoogleMapsShortUrl,
  parseGoogleMapsUrl,
} from '@turta/shared-constants';

import { PickupLocationMap } from '@/components/ui/pickup-location-map-loader';

const requiredMark = (
  <span className="ml-0.5 text-red-500" aria-hidden="true">
    *
  </span>
);

interface PickupPoint {
  id?: string;
  city: string;
  location: string;
  time: string;
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
  order: number;
  isActive: boolean;
}

interface PickupPointFormProps {
  pickupPoints: PickupPoint[];
  onChange: (points: PickupPoint[]) => void;
}

export function PickupPointForm({
  pickupPoints,
  onChange,
}: PickupPointFormProps) {
  const [mapsLinks, setMapsLinks] = useState<string[]>([]);
  const [mapsLinkErrors, setMapsLinkErrors] = useState<Array<string | null>>(
    [],
  );

  const handleAddPoint = () => {
    const newPoint: PickupPoint = {
      city: '',
      location: '',
      time: '',
      description: '',
      latitude: null,
      longitude: null,
      order: pickupPoints.length,
      isActive: true,
    };
    onChange([...pickupPoints, newPoint]);
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = pickupPoints.filter((_, i) => i !== index);
    // Sıralamayı güncelle
    const updatedPoints = newPoints.map((point, i) => ({
      ...point,
      order: i,
    }));
    onChange(updatedPoints);
    setMapsLinks((prev) => prev.filter((_, i) => i !== index));
    setMapsLinkErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMapsLinkChange = (index: number, value: string) => {
    setMapsLinks((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    const trimmed = value.trim();
    if (!trimmed) {
      setMapsLinkErrors((prev) => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
      return;
    }

    if (isGoogleMapsShortUrl(trimmed)) {
      setMapsLinkErrors((prev) => {
        const next = [...prev];
        next[index] =
          'Kısa link desteklenmiyor. Google Maps’te Paylaş → bağlantıyı kopyala (google.com/maps/...)';
        return next;
      });
      return;
    }

    const parsed = parseGoogleMapsUrl(trimmed);
    if (!parsed) {
      setMapsLinkErrors((prev) => {
        const next = [...prev];
        next[index] = 'Geçerli bir Google Maps konum linki yapıştırın.';
        return next;
      });
      return;
    }

    setMapsLinkErrors((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    handleCoordinatesChange(index, parsed.latitude, parsed.longitude);
  };

  const handleCoordinatesChange = (
    index: number,
    latitude: number,
    longitude: number,
  ) => {
    const newPoints = [...pickupPoints];
    newPoints[index] = {
      ...newPoints[index],
      latitude,
      longitude,
    };
    onChange(newPoints);
  };

  const handlePointChange = (
    index: number,
    field: keyof PickupPoint,
    value: string | boolean,
  ) => {
    const newPoints = [...pickupPoints];
    newPoints[index] = {
      ...newPoints[index],
      [field]: value,
    };
    onChange(newPoints);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Yolcu Alma Noktaları
        </h3>
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
          <div
            key={index}
            className="space-y-4 p-4 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Şehir{requiredMark}
                  </label>
                  <input
                    type="text"
                    required
                    value={point.city}
                    onChange={(e) =>
                      handlePointChange(index, 'city', e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                    placeholder="İstanbul"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Konum{requiredMark}
                  </label>
                  <input
                    type="text"
                    required
                    value={point.location}
                    onChange={(e) =>
                      handlePointChange(index, 'location', e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                    placeholder="AŞTİ Terminali"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Saat{requiredMark}
                  </label>
                  <input
                    type="time"
                    required
                    value={point.time}
                    onChange={(e) =>
                      handlePointChange(index, 'time', e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Açıklama{requiredMark}
                  </label>
                  <input
                    type="text"
                    required
                    value={point.description || ''}
                    onChange={(e) =>
                      handlePointChange(index, 'description', e.target.value)
                    }
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
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">
                Google Maps konum linki
              </label>
              <input
                type="url"
                value={mapsLinks[index] ?? ''}
                onChange={(e) => handleMapsLinkChange(index, e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                placeholder="https://www.google.com/maps/place/..."
              />
              {mapsLinkErrors[index] ? (
                <p className="mt-1 text-xs text-red-600">
                  {mapsLinkErrors[index]}
                </p>
              ) : null}
              <p className="mt-3 mb-1.5 text-sm font-medium text-gray-900">
                Harita konumu
              </p>
              <PickupLocationMap
                latitude={point.latitude}
                longitude={point.longitude}
                interactive
                onChange={(latitude, longitude) =>
                  handleCoordinatesChange(index, latitude, longitude)
                }
              />
              <p className="mt-1 text-xs text-gray-500">
                Haritaya tıklayın veya pini sürükleyin.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PickupPointForm;
