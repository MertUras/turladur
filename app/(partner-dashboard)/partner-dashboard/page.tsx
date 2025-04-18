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
  MapPinIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  EllipsisHorizontalIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import Image from 'next/image';

// İstatistik kartı bileşeni - daha temiz ve modern tasarım
const StatCard = ({ title, value, icon: Icon, change, changeType, changeText, color = 'blue' }: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  change?: string; 
  changeType?: 'increase' | 'decrease';
  changeText?: string;
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'red';
}) => {
  const colorClasses = {
    blue: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      increaseBg: 'bg-blue-50',
      increaseText: 'text-blue-700',
      decreaseBg: 'bg-red-50',
      decreaseText: 'text-red-700',
    },
    green: {
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      increaseBg: 'bg-green-50',
      increaseText: 'text-green-700',
      decreaseBg: 'bg-red-50',
      decreaseText: 'text-red-700',
    },
    amber: {
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      increaseBg: 'bg-amber-50',
      increaseText: 'text-amber-700',
      decreaseBg: 'bg-red-50',
      decreaseText: 'text-red-700',
    },
    purple: {
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      increaseBg: 'bg-purple-50',
      increaseText: 'text-purple-700',
      decreaseBg: 'bg-red-50',
      decreaseText: 'text-red-700',
    },
    red: {
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      increaseBg: 'bg-green-50',
      increaseText: 'text-green-700',
      decreaseBg: 'bg-red-50',
      decreaseText: 'text-red-700',
    },
  };
  
  const colors = colorClasses[color];
  
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colors.iconBg}`}>
            <Icon className={`h-5 w-5 ${colors.iconColor}`} aria-hidden="true" />
          </div>
          {change && (
            <div className={`flex items-center px-2 py-1 text-xs font-medium rounded-full
              ${changeType === 'increase' ? colors.increaseBg : colors.decreaseBg}
              ${changeType === 'increase' ? colors.increaseText : colors.decreaseText}
            `}>
              {changeType === 'increase' ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {changeText && <p className="text-xs text-gray-500">{changeText}</p>}
        </div>
      </div>
    </div>
  );
};

// Rezervasyon durumu bileşeni - daha temiz, sade ve modern tasarım
const ReservationStatus = ({ reservations }: { reservations: { title: string; count: number; icon: React.ElementType; color: string; bgColor: string }[] }) => (
  <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
    <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-base font-semibold text-gray-900">Rezervasyon Durumu</h3>
      <Link 
        href="/partner-dashboard/reservations"
        className="text-blue-600 text-xs font-medium hover:text-blue-800 transition-colors flex items-center"
      >
        Detaylı Görünüm
        <ChevronRightIcon className="ml-1 h-3 w-3" />
      </Link>
    </div>
    <div className="px-5 py-4">
      <div className="grid grid-cols-3 gap-3">
        {reservations.map((status) => (
          <div key={status.title} className="flex flex-col items-center p-3 rounded-lg transition-all hover:bg-gray-50">
            <div className={`rounded-full p-2.5 ${status.bgColor}`}>
              <status.icon className={`h-5 w-5 ${status.color}`} />
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{status.count}</div>
            <div className="text-xs text-gray-500">{status.title}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Son rezervasyonlar tablosu - daha temiz ve modern tasarım
const RecentReservations = ({ reservations }: { reservations: any[] }) => (
  <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
    <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-base font-semibold text-gray-900">Son Rezervasyonlar</h3>
      <Link 
        href="/partner-dashboard/reservations"
        className="text-blue-600 text-xs font-medium hover:text-blue-800 transition-colors flex items-center"
      >
        Tümünü Gör
        <ChevronRightIcon className="ml-1 h-3 w-3" />
      </Link>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Müşteri
            </th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aktivite
            </th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tarih
            </th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tutar
            </th>
            <th scope="col" className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Durum
            </th>
            <th scope="col" className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              İşlem
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full text-white bg-blue-600 flex items-center justify-center text-xs font-medium">
                    {reservation.customerInitials}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{reservation.customerName}</div>
                    <div className="text-xs text-gray-500">{reservation.customerEmail}</div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{reservation.activity}</div>
                <div className="text-xs text-gray-500">{reservation.activityType}</div>
              </td>
              <td className="px-5 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-900">{reservation.date}</div>
                <div className="text-xs text-gray-500">{reservation.time}</div>
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {reservation.amount}
              </td>
              <td className="px-5 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                  reservation.status === 'Onaylandı'
                    ? 'bg-green-50 text-green-700'
                    : reservation.status === 'Beklemede'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {reservation.status}
                </span>
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-right">
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </button>
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
  <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
    <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-base font-semibold text-gray-900">Gelir Özeti</h3>
      <div className="flex">
        <button className="text-xs text-gray-700 bg-gray-100 py-1 px-2 rounded-md">Haftalık</button>
        <button className="text-xs text-white bg-blue-600 ml-2 py-1 px-2 rounded-md">Aylık</button>
        <button className="text-xs text-gray-700 bg-gray-100 ml-2 py-1 px-2 rounded-md">Yıllık</button>
      </div>
    </div>
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Toplam Gelir</p>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">32.500₺</span>
            <span className="ml-2 flex items-center text-xs font-medium text-green-700">
              <ArrowUpIcon className="h-3 w-3 mr-0.5" />
              %8
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-xs text-gray-600">Bu Ay</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-blue-200 mr-1"></div>
            <span className="text-xs text-gray-600">Geçen Ay</span>
          </div>
        </div>
      </div>
      <div className="w-full h-60 bg-gradient-to-b from-blue-50 to-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <ArrowTrendingUpIcon className="mx-auto h-10 w-10 text-blue-400" />
          <p className="mt-2 text-sm text-gray-600">Gelir grafiği burada görüntülenecek</p>
        </div>
      </div>
    </div>
  </div>
);

// Popüler Turlar bileşeni
const PopularTours = ({ tours }: { tours: any[] }) => (
  <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
    <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="text-base font-semibold text-gray-900">Popüler Turlarınız</h3>
      <Link 
        href="/partner-dashboard/tours"
        className="text-blue-600 text-xs font-medium hover:text-blue-800 transition-colors flex items-center"
      >
        Tüm Turları Gör
        <ChevronRightIcon className="ml-1 h-3 w-3" />
      </Link>
    </div>
    <div className="divide-y divide-gray-200">
      {tours.map((tour) => (
        <div key={tour.id} className="p-5 hover:bg-gray-50 transition-colors">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/4 mb-4 sm:mb-0 sm:mr-5">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden border border-gray-200">
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
              <div className="flex justify-between">
                <h4 className="text-base font-semibold text-gray-900 mb-1">{tour.title}</h4>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </button>
              </div>
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
                <div className="flex items-center">
                  <div className="flex items-center text-sm text-gray-600 mr-4">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                    <span>{tour.reservationCount} Rezervasyon</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UsersIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                    <span>{tour.guestCount} Misafir</span>
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600">{tour.price}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Hızlı erişim kartları bileşeni
const QuickAccessCard = ({ title, description, icon: Icon, href, color = 'blue' }: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color?: 'blue' | 'green' | 'amber' | 'purple';
}) => {
  const colorClasses = {
    blue: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      hoverBorder: 'hover:border-blue-300',
    },
    green: {
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      hoverBorder: 'hover:border-green-300',
    },
    amber: {
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      hoverBorder: 'hover:border-amber-300',
    },
    purple: {
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      hoverBorder: 'hover:border-purple-300',
    },
  };
  
  const colors = colorClasses[color];
  
  return (
    <Link href={href} className={`block bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200 ${colors.hoverBorder} transition-all hover:shadow-md group`}>
      <div className="p-5">
        <div className={`p-3 rounded-lg ${colors.iconBg} inline-block mb-3`}>
          <Icon className={`h-5 w-5 ${colors.iconColor}`} />
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
        <div className="mt-3 flex items-center text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
          Görüntüle
          <ChevronRightIcon className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};

export default function PartnerDashboardPage() {
  // Örnek veri
  const stats = [
    { title: 'Toplam Rezervasyon', value: '1.429', icon: CalendarIcon, change: '%12', changeType: 'increase' as const, changeText: 'geçen aya göre', color: 'blue' as const },
    { title: 'Gelir', value: '32.500₺', icon: CurrencyDollarIcon, change: '%8', changeType: 'increase' as const, changeText: 'geçen aya göre', color: 'green' as const },
    { title: 'Müşteri Sayısı', value: '854', icon: UsersIcon, change: '%5', changeType: 'increase' as const, changeText: 'geçen aya göre', color: 'purple' as const },
    { title: 'Ortalama Puanlama', value: '4.7/5', icon: BuildingStorefrontIcon, change: '%2', changeType: 'increase' as const, changeText: 'geçen aya göre', color: 'amber' as const },
  ];

  const reservationStatus = [
    { title: 'Onaylanan', count: 48, icon: CheckBadgeIcon, color: 'text-green-700', bgColor: 'bg-green-50' },
    { title: 'Bekleyen', count: 12, icon: ClockIcon, color: 'text-amber-700', bgColor: 'bg-amber-50' },
    { title: 'İptal Edilen', count: 4, icon: ExclamationCircleIcon, color: 'text-red-700', bgColor: 'bg-red-50' },
  ];

  const reservations = [
    { id: 1, customerName: 'Ahmet Yılmaz', customerEmail: 'ahmet@gmail.com', customerInitials: 'AY', activity: 'İstanbul Şehir Turu', activityType: 'Günlük Tur', date: '12 Tem 2023', time: '09:30 - 16:30', amount: '780₺', status: 'Onaylandı' },
    { id: 2, customerName: 'Mehmet Demir', customerEmail: 'mehmet@gmail.com', customerInitials: 'MD', activity: 'Kapadokya Turu', activityType: '2 Gün 1 Gece', date: '15 Tem 2023', time: '07:00 - 19:00', amount: '2.250₺', status: 'Beklemede' },
    { id: 3, customerName: 'Ayşe Kaya', customerEmail: 'ayse@gmail.com', customerInitials: 'AK', activity: 'Efes Antik Kenti', activityType: 'Günlük Tur', date: '18 Tem 2023', time: '08:30 - 15:30', amount: '950₺', status: 'Onaylandı' },
    { id: 4, customerName: 'Fatma Şahin', customerEmail: 'fatma@gmail.com', customerInitials: 'FŞ', activity: 'Pamukkale Turu', activityType: 'Günlük Tur', date: '22 Tem 2023', time: '07:30 - 18:00', amount: '1.150₺', status: 'İptal Edildi' },
  ];
  
  const tours = [
    { id: 1, title: 'İstanbul Şehir Turu', location: 'İstanbul, Türkiye', rating: 5, reviewCount: 127, reservationCount: 358, guestCount: 892, price: '780₺', image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Kapadokya Turu', location: 'Nevşehir, Türkiye', rating: 4, reviewCount: 98, reservationCount: 276, guestCount: 560, price: '2.250₺', image: 'https://images.unsplash.com/photo-1570844065536-f5135048a6e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80' },
  ];

  const quickAccessItems = [
    { title: 'Yeni Tur Ekle', description: 'Yeni bir tur ekleyerek portföyünüzü genişletin', icon: BuildingStorefrontIcon, href: '/partner-dashboard/tours/create', color: 'blue' as const },
    { title: 'Raporları İncele', description: 'İşletmenizin performansını detaylı raporlarla analiz edin', icon: ChartBarIcon, href: '/partner-dashboard/reports', color: 'green' as const },
    { title: 'Rezervasyonları Yönet', description: 'Tüm rezervasyonlarınızı görüntüleyin ve yönetin', icon: CalendarIcon, href: '/partner-dashboard/reservations', color: 'amber' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Başlık ve Karşılama */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, Partner Test</h1>
        <p className="text-gray-600 mt-1">İşletmenizle ilgili güncel bilgileri ve istatistikleri buradan takip edebilirsiniz</p>
      </div>

      {/* Hızlı Erişim Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {quickAccessItems.map(item => (
          <QuickAccessCard
            key={item.title}
            title={item.title}
            description={item.description}
            icon={item.icon}
            href={item.href}
            color={item.color}
          />
        ))}
      </div>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            changeText={stat.changeText}
            color={stat.color}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Rezervasyon Durumu */}
        <ReservationStatus reservations={reservationStatus} />
        
        {/* Gelir Grafiği */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
      </div>
      
      {/* Yaklaşan Rezervasyonlar */}
      <RecentReservations reservations={reservations} />
      
      {/* Popüler Turlar */}
      <PopularTours tours={tours} />
    </div>
  );
} 