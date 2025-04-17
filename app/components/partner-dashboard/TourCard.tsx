import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, UsersIcon, ClockIcon, MapPinIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export interface TourCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  duration: string;
  maxParticipants: number;
  imageUrl: string;
  status: 'active' | 'draft' | 'archived';
  rating?: number;
  reservationCount?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TourCard({
  id,
  title,
  price,
  location,
  duration,
  maxParticipants,
  imageUrl,
  status,
  rating,
  reservationCount,
  onEdit,
  onDelete
}: TourCardProps) {
  const statusColors = {
    active: 'bg-green-50 text-green-700',
    draft: 'bg-amber-50 text-amber-700',
    archived: 'bg-gray-100 text-gray-700'
  };
  
  const statusText = {
    active: 'Aktif',
    draft: 'Taslak',
    archived: 'Arşivlenmiş'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <div className="aspect-[16/9] relative overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={title}
            fill
            className="object-cover transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
            {statusText[status]}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        
        <div className="mb-3 flex items-baseline">
          <span className="text-2xl font-bold text-indigo-600">{price}</span>
          <span className="text-sm text-gray-500 ml-1">/kişi</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 text-gray-400 mr-1.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 text-gray-400 mr-1.5" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <UsersIcon className="h-4 w-4 text-gray-400 mr-1.5" />
            <span>Maks. {maxParticipants} kişi</span>
          </div>
        </div>
        
        {(rating || reservationCount) && (
          <div className="flex justify-between items-center py-3 border-t border-gray-100">
            {rating && (
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
              </div>
            )}
            
            {reservationCount && (
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                <span>{reservationCount} rezervasyon</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <Link 
            href={`/partner-dashboard/tours/${id}`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Detaylar
          </Link>
          
          <div className="flex space-x-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(id)}
                className="inline-flex items-center p-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
            
            {onDelete && (
              <button 
                onClick={() => onDelete(id)}
                className="inline-flex items-center p-2 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 