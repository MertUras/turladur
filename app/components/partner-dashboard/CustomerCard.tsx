import { CalendarIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export interface CustomerCardProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalBookings: number;
  totalSpent: string;
  lastBookingDate: string;
  profileImage?: string;
}

export default function CustomerCard({
  id,
  name,
  email,
  phone,
  location,
  totalBookings,
  totalSpent,
  lastBookingDate,
  profileImage
}: CustomerCardProps) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md p-6">
      <div className="flex items-start">
        {/* Profil Resmi veya İnitial */}
        <div className="flex-shrink-0">
          {profileImage ? (
            <div className="h-14 w-14 rounded-full overflow-hidden relative">
              <Image
                src={profileImage}
                alt={name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          ) : (
            <div className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-medium">
              {initials}
            </div>
          )}
        </div>

        {/* Müşteri Bilgileri */}
        <div className="ml-5 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                <span>{email}</span>
              </div>
            </div>
            <Link
              href={`/partner-dashboard/customers/${id}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Detaylar
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <PhoneIcon className="h-4 w-4 text-gray-400 mr-1.5" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPinIcon className="h-4 w-4 text-gray-400 mr-1.5" />
              <span>{location}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Toplam Rezervasyon</p>
              <p className="text-lg font-semibold text-gray-900">{totalBookings}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Harcama</p>
              <p className="text-lg font-semibold text-indigo-600">{totalSpent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Son Rezervasyon</p>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                <p className="text-sm font-medium text-gray-800">{lastBookingDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 