'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  MapPinIcon,
  FlagIcon,
  BuildingOfficeIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyEuroIcon
} from '@heroicons/react/24/outline';

// Leaflet ikonlarını düzelt
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
  description: string;
  type: 'start' | 'end' | 'stop';
  images?: string[];
  address?: string;
  contact?: string;
  duration?: string;
  activities?: string[];
  arrivalTime?: string;
  departureTime?: string;
}

interface TourInfo {
  name: string;
  description: string;
  price: number;
  duration: string;
  capacity: number;
  currentBookings: number;
  startDate: string;
  endDate: string;
}

interface TourMapProps {
  locations: Location[];
  route?: [number, number][];
  center?: [number, number];
  zoom?: number;
  height?: number;
  tourInfo?: TourInfo;
  onLocationClick?: (location: Location) => void;
}

function MapController({ center, zoom, locations }: { 
  center: [number, number]; 
  zoom: number;
  locations: Location[];
}) {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => loc.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, zoom);
    }
  }, [locations, center, zoom, map]);

  return null;
}

export default function TourMap({
  locations,
  route,
  center = [39.9334, 32.8597],
  zoom = 6,
  height = 600,
  tourInfo,
  onLocationClick
}: TourMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const getMarkerIcon = (type: Location['type']) => {
    const iconSize: [number, number] = [32, 32];
    const iconAnchor: [number, number] = [16, 32];
    const popupAnchor: [number, number] = [0, -32];

    switch (type) {
      case 'start':
        return L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="bg-green-500 rounded-full p-2 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>`,
          iconSize,
          iconAnchor,
          popupAnchor
        });
      case 'end':
        return L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="bg-red-500 rounded-full p-2 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>`,
          iconSize,
          iconAnchor,
          popupAnchor
        });
      default:
        return L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="bg-blue-500 rounded-full p-2 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>`,
          iconSize,
          iconAnchor,
          popupAnchor
        });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {tourInfo && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{tourInfo.name}</h2>
              <p className="mt-1 text-sm text-gray-600">{tourInfo.description}</p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <CurrencyEuroIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tourInfo.price.toLocaleString('tr-TR')} ₺</p>
                    <p className="text-xs text-gray-500">Fiyat</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tourInfo.duration}</p>
                    <p className="text-xs text-gray-500">Süre</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tourInfo.currentBookings}/{tourInfo.capacity}</p>
                    <p className="text-xs text-gray-500">Kapasite</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FlagIcon className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(tourInfo.startDate).toLocaleDateString('tr-TR')}
                    </p>
                    <p className="text-xs text-gray-500">Başlangıç</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Tur Rota Haritası</h2>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              Başlangıç
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Durak
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              Bitiş
            </span>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapController center={center} zoom={zoom} locations={locations} />

          {locations.map((location) => (
            <Marker
              key={location.id}
              position={location.coordinates}
              icon={getMarkerIcon(location.type)}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(location);
                  onLocationClick?.(location);
                }
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-medium text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                  {location.address && (
                    <p className="text-sm text-gray-500 mt-1">
                      <BuildingOfficeIcon className="inline-block w-4 h-4 mr-1" />
                      {location.address}
                    </p>
                  )}
                  {location.contact && (
                    <p className="text-sm text-gray-500 mt-1">
                      <MapPinIcon className="inline-block w-4 h-4 mr-1" />
                      {location.contact}
                    </p>
                  )}
                  {location.duration && (
                    <p className="text-sm text-gray-500 mt-1">
                      <ClockIcon className="inline-block w-4 h-4 mr-1" />
                      {location.duration}
                    </p>
                  )}
                  {location.arrivalTime && (
                    <p className="text-sm text-gray-500 mt-1">
                      <ClockIcon className="inline-block w-4 h-4 mr-1" />
                      Varış: {location.arrivalTime}
                    </p>
                  )}
                  {location.departureTime && (
                    <p className="text-sm text-gray-500 mt-1">
                      <ClockIcon className="inline-block w-4 h-4 mr-1" />
                      Kalkış: {location.departureTime}
                    </p>
                  )}
                  {location.activities && location.activities.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Aktiviteler:</p>
                      <ul className="mt-1 space-y-1">
                        {location.activities.map((activity, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {location.images && location.images.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Görseller:</p>
                      <div className="mt-1 grid grid-cols-2 gap-2">
                        {location.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`${location.name} - Görsel ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {route && (
            <Polyline
              positions={route}
              pathOptions={{
                color: '#3B82F6',
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 10'
              }}
            />
          )}
        </MapContainer>
      </div>

      {selectedLocation && (
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{selectedLocation.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{selectedLocation.description}</p>
              {selectedLocation.address && (
                <p className="mt-2 text-sm text-gray-500">
                  <BuildingOfficeIcon className="inline-block w-4 h-4 mr-1" />
                  {selectedLocation.address}
                </p>
              )}
              {selectedLocation.contact && (
                <p className="mt-1 text-sm text-gray-500">
                  <MapPinIcon className="inline-block w-4 h-4 mr-1" />
                  {selectedLocation.contact}
                </p>
              )}
              {selectedLocation.duration && (
                <p className="mt-1 text-sm text-gray-500">
                  <ClockIcon className="inline-block w-4 h-4 mr-1" />
                  {selectedLocation.duration}
                </p>
              )}
              {selectedLocation.arrivalTime && (
                <p className="mt-1 text-sm text-gray-500">
                  <ClockIcon className="inline-block w-4 h-4 mr-1" />
                  Varış: {selectedLocation.arrivalTime}
                </p>
              )}
              {selectedLocation.departureTime && (
                <p className="mt-1 text-sm text-gray-500">
                  <ClockIcon className="inline-block w-4 h-4 mr-1" />
                  Kalkış: {selectedLocation.departureTime}
                </p>
              )}
            </div>
            {selectedLocation.images && selectedLocation.images.length > 0 && (
              <div className="flex gap-2">
                {selectedLocation.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedLocation.name} - Görsel ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 