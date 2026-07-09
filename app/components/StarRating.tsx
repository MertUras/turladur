import { StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  className?: string;
}

export default function StarRating({ rating, size = 'md', className = '' }: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div className={`flex items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((star) =>
        star <= Math.floor(rating) ? (
          <StarIconSolid key={star} className={`${sizeClass} text-yellow-400`} />
        ) : star <= rating ? (
          <div key={star} className="relative">
            <StarIcon className={`${sizeClass} text-gray-300`} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
              <StarIconSolid className={`${sizeClass} text-yellow-400`} />
            </div>
          </div>
        ) : (
          <StarIcon key={star} className={`${sizeClass} text-gray-300`} />
        )
      )}
    </div>
  );
}
