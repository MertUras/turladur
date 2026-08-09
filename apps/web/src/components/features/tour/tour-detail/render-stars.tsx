'use client';

import { Star as StarIcon } from 'lucide-react';
import { Star as StarIconSolid } from 'lucide-react';

/** Split from tour-detail-client.tsx (Faz 7) — star rating UI. */
export function renderStars(rating: number, size: 'sm' | 'md' = 'md') {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        return star <= Math.floor(rating) ? (
          <StarIconSolid key={star} className={`${starSize} text-yellow-400`} />
        ) : star <= rating ? (
          <div key={star} className="relative">
            <StarIcon className={`${starSize} text-gray-300`} />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${(rating % 1) * 100}%` }}
            >
              <StarIconSolid className={`${starSize} text-yellow-400`} />
            </div>
          </div>
        ) : (
          <StarIcon key={star} className={`${starSize} text-gray-300`} />
        );
      })}
    </div>
  );
}
