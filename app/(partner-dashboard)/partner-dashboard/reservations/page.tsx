'use client';

import { useState, useEffect, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  ChatBubbleLeftIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  ChevronDownIcon, 
  CalendarIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { Transition, Menu, Popover } from '@headlessui/react';
import { formatDate, formatCurrency, getStatusClass, translateStatus } from '@/lib/utils';

interface ContactInfo {
  email: string;
  phone: string;
}

interface Reservation {
  id: string;
  referenceNumber: string;
  customerName: string;
  tourName: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  contactInfo: ContactInfo;
  notes?: string;
}

export default function ReservationsPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateSort, setDateSort] = useState('desc');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
          search: searchTerm,
          status: statusFilter,
          payment: paymentFilter,
          sort: dateSort
        });

        const response = await fetch(`/api/partner/reservations?${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Rezervasyonlar getirilemedi');
        }

        const data = await response.json();
        setReservations(data);
        setError(null);
      } catch (err) {
        setError('Rezervasyonlar yüklenirken bir hata oluştu');
        console.error('Rezervasyon yükleme hatası:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchReservations();
    }
  }, [session, searchTerm, statusFilter, paymentFilter, dateSort]);

  const showReservationDetail = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  if (!session?.user) {
    return <div className="p-4">Lütfen giriş yapın</div>;
  }

  if (isLoading) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  // Filtreleme ve sıralama
  const filteredReservations = reservations
    .filter(reservation => {
      const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          reservation.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          reservation.tourName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || reservation.paymentStatus === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      return dateSort === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Durum renk sınıfları
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Ödeme durumu renk sınıfları
  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Durum çevirisi
  const translateStatus = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Onaylandı';
      case 'pending':
        return 'Beklemede';
      case 'cancelled':
        return 'İptal Edildi';
      case 'completed':
        return 'Tamamlandı';
      default:
        return status;
    }
  };

  // Ödeme durumu çevirisi
  const translatePaymentStatus = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Ödendi';
      case 'partial':
        return 'Kısmi Ödeme';
      case 'unpaid':
        return 'Ödenmedi';
      case 'refunded':
        return 'İade Edildi';
      default:
        return status;
    }
  };

  // Para formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Durum filtreleme seçenekleri
  const statusOptions = [
    { id: 'all', name: 'Tüm Durumlar' },
    { id: 'confirmed', name: 'Onaylandı' },
    { id: 'pending', name: 'Beklemede' },
    { id: 'completed', name: 'Tamamlandı' },
    { id: 'cancelled', name: 'İptal Edildi' },
  ];

  // Ödeme durumu filtreleme seçenekleri
  const paymentOptions = [
    { id: 'all', name: 'Tüm Ödemeler' },
    { id: 'paid', name: 'Ödendi' },
    { id: 'partial', name: 'Kısmi Ödeme' },
    { id: 'unpaid', name: 'Ödenmedi' },
    { id: 'refunded', name: 'İade Edildi' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Üst Bölüm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlar</h1>
            <p className="text-gray-500 mt-1">Tur rezervasyonlarını görüntüle ve yönet</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Dışa Aktar
                  <ChevronDownIcon className="h-4 w-4 ml-2" aria-hidden="true" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        >
                          Excel (.xlsx)
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        >
                          PDF
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        >
                          CSV
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Arama ve Filtreler */}
        <div className="mt-8 mb-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="flex-1 min-w-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Müşteri, referans no veya tur adı ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={`inline-flex items-center px-4 py-3 border ${
                        open ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-700'
                      } text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                    >
                      <FunnelIcon className="h-5 w-5 mr-2" />
                      {statusOptions.find(option => option.id === statusFilter)?.name || 'Durum'}
                      <ChevronDownIcon
                        className={`ml-2 h-4 w-4 ${open ? 'transform rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {statusOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setStatusFilter(option.id)}
                              className={`${
                                statusFilter === option.id
                                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                                  : 'text-gray-700'
                              } flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50`}
                            >
                              {option.name}
                            </button>
                          ))}
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>

              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={`inline-flex items-center px-4 py-3 border ${
                        open ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-700'
                      } text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                    >
                      <FunnelIcon className="h-5 w-5 mr-2" />
                      {paymentOptions.find(option => option.id === paymentFilter)?.name || 'Ödeme'}
                      <ChevronDownIcon
                        className={`ml-2 h-4 w-4 ${open ? 'transform rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {paymentOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setPaymentFilter(option.id)}
                              className={`${
                                paymentFilter === option.id
                                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                                  : 'text-gray-700'
                              } flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50`}
                            >
                              {option.name}
                            </button>
                          ))}
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>

              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={`inline-flex items-center px-4 py-3 border ${
                        open ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-700'
                      } text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
                    >
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      {dateSort === 'desc' ? 'En Yeni' : 'En Eski'}
                      <ChevronDownIcon
                        className={`ml-2 h-4 w-4 ${open ? 'transform rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <button
                            onClick={() => setDateSort('desc')}
                            className={`${
                              dateSort === 'desc'
                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                : 'text-gray-700'
                            } flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50`}
                          >
                            En Yeni
                          </button>
                          <button
                            onClick={() => setDateSort('asc')}
                            className={`${
                              dateSort === 'asc'
                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                : 'text-gray-700'
                            } flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50`}
                          >
                            En Eski
                          </button>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </div>
          </div>
        </div>

        {/* Rezervasyon Sonuçları */}
        <div className="mt-2">
          <p className="text-sm text-gray-500 mb-4">
            {filteredReservations.length} rezervasyon gösteriliyor
          </p>

          {/* Tablo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referans
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Müşteri
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tur
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ödeme
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">İşlemler</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => (
                      <tr 
                        key={reservation.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => showReservationDetail(reservation)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                          {reservation.referenceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {reservation.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {reservation.tourName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(reservation.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(reservation.totalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs font-medium capitalize rounded-full ${getStatusClass(reservation.status)}`}>
                            {translateStatus(reservation.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 text-xs font-medium capitalize rounded-full ${getPaymentStatusClass(reservation.paymentStatus)}`}>
                            {translatePaymentStatus(reservation.paymentStatus)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 ml-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              showReservationDetail(reservation);
                            }}
                          >
                            Detaylar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Rezervasyon bulunamadı</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Farklı bir arama veya filtre seçeneği deneyin
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <span>{filteredReservations.length} kayıt gösteriliyor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    Önceki
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    Sonraki
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rezervasyon Detayı */}
        {selectedReservation && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">
                  Rezervasyon Detayı
                </h3>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedReservation(null)}
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Referans Numarası</p>
                    <p className="text-lg font-semibold text-indigo-600">{selectedReservation.referenceNumber}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClass(selectedReservation.status)}`}>
                      {translateStatus(selectedReservation.status)}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPaymentStatusClass(selectedReservation.paymentStatus)}`}>
                      {translatePaymentStatus(selectedReservation.paymentStatus)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Müşteri Bilgileri */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-gray-800 mb-3">Müşteri Bilgileri</h4>
                    <p className="text-sm font-medium text-gray-900 mb-2">{selectedReservation.customerName}</p>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedReservation.contactInfo.email}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedReservation.contactInfo.phone}</span>
                    </div>
                  </div>
                  
                  {/* Tur Bilgileri */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-gray-800 mb-3">Tur Bilgileri</h4>
                    <p className="text-sm font-medium text-gray-900 mb-2">{selectedReservation.tourName}</p>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{formatDate(selectedReservation.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-4">Katılımcı: {selectedReservation.participants} kişi</span>
                      <span>Toplam: {formatCurrency(selectedReservation.totalPrice)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Notlar */}
                {selectedReservation.notes && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                    <h4 className="text-sm font-bold text-yellow-800 mb-2 flex items-center">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                      Notlar
                    </h4>
                    <p className="text-sm text-yellow-700">{selectedReservation.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedReservation(null)}
                >
                  Kapat
                </button>
                <button
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Rezervasyonu Düzenle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 