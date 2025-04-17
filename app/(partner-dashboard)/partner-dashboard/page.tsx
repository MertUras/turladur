'use client';

import Link from 'next/link';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";
import Image from 'next/image';

// İstatistik kartı bileşeni - daha temiz ve modern tasarım
const StatCard = ({ title, value, icon: Icon, change, changeType, changeText }: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  change?: string; 
  changeType?: 'increase' | 'decrease';
  changeText?: string;
}) => (
  <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 bg-indigo-50 rounded-full p-3">
          <Icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
      </div>
      <div className="flex items-baseline">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <span className={`ml-2 flex items-center text-sm font-medium ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'increase' ? (
              <ArrowUpIcon className="h-4 w-4 mr-0.5 flex-shrink-0" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-0.5 flex-shrink-0" />
            )}
            {change}
          </span>
        )}
      </div>
      {changeText && <p className="mt-1 text-sm text-gray-500">{changeText}</p>}
    </div>
  </div>
);

// Rezervasyon durumu bileşeni - daha temiz, sade ve modern tasarım
const ReservationStatus = ({ reservations }: { reservations: { title: string; count: number; icon: React.ElementType; color: string; bgColor: string }[] }) => (
  <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
    <div className="px-6 py-5 border-b border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900">Rezervasyon Durumu</h3>
    </div>
    <div className="px-6 py-6">
      <div className="grid grid-cols-3 gap-4">
        {reservations.map((status) => (
          <div key={status.title} className="flex flex-col items-center p-4 rounded-lg transition-all hover:bg-gray-50">
            <div className={`rounded-full p-3 ${status.bgColor}`}>
              <status.icon className={`h-6 w-6 ${status.color}`} />
            </div>
            <div className="mt-3 text-2xl font-bold text-gray-900">{status.count}</div>
            <div className="text-sm text-gray-500">{status.title}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Son rezervasyonlar tablosu - daha temiz ve modern tasarım
const RecentReservations = ({ reservations }: { reservations: any[] }) => (
  <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Son Rezervasyonlar</h3>
      <Link 
        href="/partner-dashboard/reservations"
        className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors flex items-center"
      >
        Tümünü Gör
        <ChevronRightIcon className="ml-1 h-4 w-4" />
      </Link>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Müşteri
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktivite
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tarih
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tutar
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durum
            </th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr key={reservation.id} className={`hover:bg-gray-50 transition-colors`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`h-9 w-9 rounded-full text-white bg-indigo-600 flex items-center justify-center text-sm font-medium`}>
                    {reservation.customerInitials}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                    <div className="text-xs text-gray-500">{reservation.customerEmail}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{reservation.activity}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{reservation.date}</div>
                <div className="text-xs text-gray-500">{reservation.time}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {reservation.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                  reservation.status === 'Onaylandı'
                    ? 'bg-green-50 text-green-700'
                    : reservation.status === 'Beklemede'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {reservation.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Gelir grafiği bileşeni - modern tasarım
const RevenueChart = () => (
  <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
    <div className="px-6 py-5 border-b border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900">Gelir Özeti</h3>
    </div>
    <div className="p-6">
      <div className="w-full h-64 bg-indigo-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <CurrencyDollarIcon className="mx-auto h-10 w-10 text-indigo-400" />
          <p className="mt-2 text-sm text-gray-600">Gelir grafiği burada görüntülenecek</p>
        </div>
      </div>
    </div>
  </div>
);

// Popüler Turlar bileşeni
const PopularTours = ({ tours }: { tours: any[] }) => (
  <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-100">
    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-900">Popüler Turlarınız</h3>
      <Link 
        href="/partner-dashboard/tours"
        className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors flex items-center"
      >
        Tüm Turları Gör
        <ChevronRightIcon className="ml-1 h-4 w-4" />
      </Link>
    </div>
    <div className="divide-y divide-gray-100">
      {tours.map((tour) => (
        <div key={tour.id} className="p-6 hover:bg-gray-50 transition-colors">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/4 mb-4 sm:mb-0 sm:mr-6">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                <Image 
                  src={tour.image} 
                  alt={tour.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 mb-1">{tour.title}</h4>
              <div className="flex items-center mb-2">
                <MapPinIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                <span className="text-sm text-gray-600">{tour.location}</span>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex mr-3">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < tour.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">{tour.reviewCount} Değerlendirme</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                  <span>{tour.reservationCount} Rezervasyon</span>
                </div>
                <div className="text-lg font-bold text-indigo-600">{tour.price}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function PartnerDashboardPage() {
  // Örnek veri
  const stats = [
    { title: 'Toplam Rezervasyon', value: '1.429', icon: CalendarIcon, change: '%12', changeType: 'increase' as const, changeText: 'geçen aya göre' },
    { title: 'Gelir', value: '32.500₺', icon: CurrencyDollarIcon, change: '%8', changeType: 'increase' as const, changeText: 'geçen aya göre' },
    { title: 'Müşteri Sayısı', value: '854', icon: UsersIcon, change: '%5', changeType: 'increase' as const, changeText: 'geçen aya göre' },
  ];

  const reservationStatus = [
    { title: 'Onaylanan', count: 48, icon: CheckBadgeIcon, color: 'text-green-700', bgColor: 'bg-green-50' },
    { title: 'Bekleyen', count: 12, icon: ClockIcon, color: 'text-amber-700', bgColor: 'bg-amber-50' },
    { title: 'İptal Edilen', count: 4, icon: ExclamationCircleIcon, color: 'text-red-700', bgColor: 'bg-red-50' },
  ];

  const recentReservations = [
    {
      id: 1,
      customerName: 'Ahmet Yılmaz',
      customerEmail: 'ahmet@ornek.com',
      customerInitials: 'AY',
      activity: 'Kapadokya Balon Turu',
      date: '12 Haziran 2023',
      time: '06:00',
      amount: '1.200₺',
      status: 'Onaylandı',
    },
    {
      id: 2,
      customerName: 'Ayşe Demir',
      customerEmail: 'ayse@ornek.com',
      customerInitials: 'AD',
      activity: 'Boğaz Turu',
      date: '15 Haziran 2023',
      time: '14:30',
      amount: '650₺',
      status: 'Beklemede',
    },
    {
      id: 3,
      customerName: 'Mehmet Kaya',
      customerEmail: 'mehmet@ornek.com',
      customerInitials: 'MK',
      activity: 'Efes Antik Kent Turu',
      date: '18 Haziran 2023',
      time: '09:00',
      amount: '850₺',
      status: 'Onaylandı',
    },
    {
      id: 4,
      customerName: 'Zeynep Şahin',
      customerEmail: 'zeynep@ornek.com',
      customerInitials: 'ZŞ',
      activity: 'Pamukkale Günübirlik Tur',
      date: '20 Haziran 2023',
      time: '08:30',
      amount: '750₺',
      status: 'İptal Edildi',
    },
    {
      id: 5,
      customerName: 'Can Öztürk',
      customerEmail: 'can@ornek.com',
      customerInitials: 'CÖ',
      activity: 'Kapadokya ATV Turu',
      date: '22 Haziran 2023',
      time: '15:00',
      amount: '400₺',
      status: 'Onaylandı',
    },
  ];

  const popularTours = [
    {
      id: 1,
      title: 'Kapadokya Balon Turu',
      location: 'Kapadokya, Nevşehir',
      image: 'https://source.unsplash.com/random/800x600/?cappadocia,balloon',
      rating: 4.8,
      reviewCount: 156,
      reservationCount: 42,
      price: '1.200₺'
    },
    {
      id: 2,
      title: 'Efes Antik Kenti Turu',
      location: 'Selçuk, İzmir',
      image: 'https://source.unsplash.com/random/800x600/?ephesus,ruins',
      rating: 4.7,
      reviewCount: 98,
      reservationCount: 28,
      price: '750₺'
    },
    {
      id: 3,
      title: 'Kapadokya ATV Safari Turu',
      location: 'Kapadokya, Nevşehir',
      image: 'https://source.unsplash.com/random/800x600/?cappadocia,atv',
      rating: 4.9,
      reviewCount: 87,
      reservationCount: 32,
      price: '600₺'
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz</h1>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            changeText={stat.changeText}
          />
        ))}
      </div>

      {/* Grafikler ve Durum Bilgileri */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReservationStatus reservations={reservationStatus} />
        <RevenueChart />
      </div>

      {/* Popüler Turlar */}
      <PopularTours tours={popularTours} />

      {/* Son Rezervasyonlar */}
      <RecentReservations reservations={recentReservations} />
    </div>
  );
} 