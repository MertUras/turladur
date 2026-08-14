'use client';

import { useEffect, useMemo } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { isValidGeoCoordinate } from '@turta/shared-constants';

import 'leaflet/dist/leaflet.css';

const TURKEY_CENTER: [number, number] = [39.0, 35.2];

export type PickupLocationMapProps = {
  latitude?: number | null;
  longitude?: number | null;
  interactive: boolean;
  onChange?: (latitude: number, longitude: number) => void;
  className?: string;
};

function createPinIcon() {
  return L.divIcon({
    className: 'pickup-location-pin',
    html: '<span style="display:block;width:18px;height:18px;border-radius:9999px;background:#0a0a0a;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35);"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function Recenter({
  latitude,
  longitude,
  zoom,
}: {
  latitude: number;
  longitude: number;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], zoom);
  }, [map, latitude, longitude, zoom]);
  return null;
}

function MapClickCapture({
  onPick,
}: {
  onPick: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export function PickupLocationMap({
  latitude,
  longitude,
  interactive,
  onChange,
  className,
}: PickupLocationMapProps) {
  const hasPin = isValidGeoCoordinate(latitude, longitude);
  const pinLatitude = hasPin ? latitude : null;
  const pinLongitude =
    hasPin && typeof longitude === 'number' ? longitude : null;
  const centerLat = pinLatitude ?? TURKEY_CENTER[0];
  const centerLng = pinLongitude ?? TURKEY_CENTER[1];
  const zoom = pinLatitude != null && pinLongitude != null ? 15 : 6;
  const icon = useMemo(() => createPinIcon(), []);

  return (
    <div
      className={
        className ??
        'relative z-0 h-48 w-full overflow-hidden rounded-lg border border-neutral-200'
      }
    >
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        scrollWheelZoom={interactive}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter latitude={centerLat} longitude={centerLng} zoom={zoom} />
        {interactive ? (
          <MapClickCapture onPick={(lat, lng) => onChange?.(lat, lng)} />
        ) : null}
        {pinLatitude != null && pinLongitude != null ? (
          <Marker
            position={[pinLatitude, pinLongitude]}
            icon={icon}
            draggable={interactive}
            eventHandlers={
              interactive && onChange
                ? {
                    dragend: (event) => {
                      const next = event.target.getLatLng();
                      onChange(next.lat, next.lng);
                    },
                  }
                : undefined
            }
          />
        ) : null}
      </MapContainer>
    </div>
  );
}
