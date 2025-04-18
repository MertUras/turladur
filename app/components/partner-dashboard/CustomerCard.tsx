import { CalendarIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CurrencyDollarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md group">
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Sol taraf - Profil ve bilgiler */}
        <div className="flex items-start p-6 flex-1">
          {/* Profil Resmi veya İnitial */}
          <div className="flex-shrink-0">
            {profileImage ? (
              <div className="h-16 w-16 rounded-full overflow-hidden relative shadow-sm">
                <Image
                  src={profileImage}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium shadow-sm">
                {initials}
              </div>
            )}
          </div>

          {/* Müşteri Bilgileri */}
          <div className="ml-5 flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
                  <div className="flex items-center mr-4">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center text-sm text-gray-500">
                <PhoneIcon className="h-4 w-4 text-gray-400 mr-1.5 flex-shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4 text-gray-400 mr-1.5 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* İstatistikler ve Detay Bağlantısı */}
        <div className="flex border-t md:border-t-0 md:border-l border-gray-100">
          {/* İstatistikler */}
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="px-6 py-4 flex flex-col items-center justify-center">
              <div className="flex items-center mb-1 text-gray-500">
                <ShoppingBagIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                <span className="text-xs font-medium uppercase">Rezervasyon</span>
              </div>
              <p className="text-xl font-semibold text-gray-900">{totalBookings}</p>
            </div>
            
            <div className="px-6 py-4 flex flex-col items-center justify-center">
              <div className="flex items-center mb-1 text-gray-500">
                <CurrencyDollarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                <span className="text-xs font-medium uppercase">Harcama</span>
              </div>
              <p className="text-xl font-semibold text-indigo-600">{totalSpent}</p>
            </div>
            
            <div className="px-6 py-4 flex flex-col items-center justify-center">
              <div className="flex items-center mb-1 text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                <span className="text-xs font-medium uppercase">Son İşlem</span>
              </div>
              <p className="text-sm font-medium text-gray-800">{lastBookingDate}</p>
            </div>
          </div>
          
          {/* Detay Bağlantısı */}
          <div className="flex items-center border-l border-gray-100 pl-6 pr-6 transition-colors group-hover:bg-indigo-50">
            <Link
              href={`/partner-dashboard/customers/${id}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Detaylar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 