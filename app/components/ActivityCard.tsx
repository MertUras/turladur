import Image from 'next/image';
import Link from 'next/link';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const images = JSON.parse(activity.images as string);
  const inclusions = JSON.parse(activity.inclusions as string);
  const exclusions = JSON.parse(activity.exclusions as string);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={images[0]}
          alt={activity.name}
          fill
          className="object-cover"
        />
        {activity.featured && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            Öne Çıkan
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">{activity.category}</span>
          <span className="text-sm font-medium text-gray-600">{activity.duration} saat</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{activity.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">{activity.location}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-600">{activity.maxParticipants} kişi</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">₺{activity.price}</span>
          <Link
            href={`/activities/${activity.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Detaylar
          </Link>
        </div>
      </div>
    </div>
  );
} 