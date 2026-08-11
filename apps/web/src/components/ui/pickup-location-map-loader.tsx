'use client';

import dynamic from 'next/dynamic';

import type { PickupLocationMapProps } from './pickup-location-map';

export const PickupLocationMap = dynamic(
  () =>
    import('./pickup-location-map').then((module) => module.PickupLocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-48 w-full items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-xs text-neutral-500">
        Harita yükleniyor…
      </div>
    ),
  },
);

export type { PickupLocationMapProps };
