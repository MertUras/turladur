'use client';

import { useState, Fragment } from 'react';
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
  ArrowDownTrayIcon,
  UserIcon,
  BuildingOfficeIcon,
  CreditCardIcon,
  ClockIcon as ClockIconSolid
} from '@heroicons/react/24/outline';
import { Transition, Menu, Popover } from '@headlessui/react';

// Rezervasyon tipi tanımı
interface Reservation {
  id: number;
  referenceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tourName: string;
  agencyName: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'partial' | 'unpaid' | 'refunded';
  cancellationHistory?: {
    date: string;
    reason: string;
    refundAmount?: number;
  }[];
  notes?: string;
}

export default function AdminReservationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  
  // Örnek rezervasyon verileri
  const reservations: Reservation[] = [
    {
      id: 1,
      referenceNumber: 'RES-2023-1001',
      customerName: 'Ahmet Yılmaz',
      customerEmail: 'ahmet.yilmaz@example.com',
      customerPhone: '+90 555 123 4567',
      tourName: 'Kapadokya Kültür Turu',
      agencyName: 'Anadolu Turizm',
      date: '2023-11-20',
      participants: 2,
      totalPrice: 3500,
      status: 'confirmed',
      paymentStatus: 'paid',
      notes: 'Vejetaryen menü talep edildi.'
    },
    {
      id: 2,
      referenceNumber: 'RES-2023-1002',
      customerName: 'Ayşe Kaya',
      customerEmail: 'ayse.kaya@example.com',
      customerPhone: '+90 555 234 5678',
      tourName: 'İstanbul Boğaz Turu',
      agencyName: 'Ege Seyahat',
      date: '2023-11-18',
      participants: 4,
      totalPrice: 5200,
      status: 'completed',
      paymentStatus: 'paid',
      notes: 'Gruba 1 çocuk dahil.'
    },
    {
      id: 3,
      referenceNumber: 'RES-2023-1003',
      customerName: 'Mehmet Demir',
      customerEmail: 'mehmet.demir@example.com',
      customerPhone: '+90 555 345 6789',
      tourName: 'Efes Antik Kenti Turu',
      agencyName: 'Akdeniz Tours',
      date: '2023-11-25',
      participants: 3,
      totalPrice: 4200,
      status: 'pending',
      paymentStatus: 'partial',
      cancellationHistory: [
        {
          date: '2023-11-15',
          reason: 'Müşteri talebi',
          refundAmount: 2100
        }
      ]
    }
  ];

  // Filtreleme fonksiyonları
  const filterReservations = () => {
    return reservations.filter(reservation => {
      const matchesSearch = 
        reservation.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.agencyName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || reservation.paymentStatus === paymentFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const today = new Date();
        const reservationDate = new Date(reservation.date);
        const diffTime = Math.abs(today.getTime() - reservationDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateFilter === 'last7days') {
          matchesDate = diffDays <= 7;
        } else if (dateFilter === 'thisMonth') {
          matchesDate = 
            reservationDate.getMonth() === today.getMonth() &&
            reservationDate.getFullYear() === today.getFullYear();
        }
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  };

  const filteredReservations = filterReservations();

  // Durum ve ödeme durumu için stil sınıfları
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Durum ve ödeme durumu çevirileri
  const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
      confirmed: 'Onaylandı',
      pending: 'Beklemede',
      cancelled: 'İptal Edildi',
      completed: 'Tamamlandı'
    };
    return translations[status] || status;
  };

  const translatePaymentStatus = (status: string) => {
    const translations: { [key: string]: string } = {
      paid: 'Ödendi',
      partial: 'Kısmi Ödeme',
      unpaid: 'Ödenmedi',
      refunded: 'İade Edildi'
    };
    return translations[status] || status;
  };

  // Tarih formatı
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Üst Bölüm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Yönetimi</h1>
            <p className="text-gray-500 mt-1">Tüm rezervasyonları görüntüle ve yönet</p>
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
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } block px-4 py-2 text-sm`}
                        >
                          Excel olarak dışa aktar
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
                          PDF olarak dışa aktar
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Filtreler */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Arama */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Durum Filtresi */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="confirmed">Onaylandı</option>
              <option value="pending">Beklemede</option>
              <option value="cancelled">İptal Edildi</option>
              <option value="completed">Tamamlandı</option>
            </select>
          </div>

          {/* Ödeme Durumu Filtresi */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">Tüm Ödemeler</option>
              <option value="paid">Ödendi</option>
              <option value="partial">Kısmi Ödeme</option>
              <option value="unpaid">Ödenmedi</option>
              <option value="refunded">İade Edildi</option>
            </select>
          </div>

          {/* Tarih Filtresi */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">Tüm Tarihler</option>
              <option value="last7days">Son 7 Gün</option>
              <option value="thisMonth">Bu Ay</option>
            </select>
          </div>
        </div>

        {/* Rezervasyon Listesi */}
        <div className="mt-6">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
                          Tur & Acente
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
                      {filteredReservations.map((reservation) => (
                        <tr 
                          key={reservation.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                            {reservation.referenceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <UserIcon className="h-6 w-6 text-indigo-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {reservation.customerName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {reservation.customerEmail}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{reservation.tourName}</div>
                            <div className="text-sm text-gray-500">{reservation.agencyName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(reservation.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(reservation.totalPrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(reservation.status)}`}>
                              {translateStatus(reservation.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusClass(reservation.paymentStatus)}`}>
                              {translatePaymentStatus(reservation.paymentStatus)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900">
                              Detaylar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rezervasyon Detay Modalı */}
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
                {/* Üst Bilgiler */}
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

                {/* Müşteri Bilgileri */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Müşteri Bilgileri</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedReservation.customerName}</span>
                    </div>
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedReservation.customerEmail}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedReservation.customerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Tur ve Acente Bilgileri */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Tur ve Acente Bilgileri</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedReservation.agencyName}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIconSolid className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{selectedReservation.tourName}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{formatDate(selectedReservation.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Ödeme Bilgileri */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Ödeme Bilgileri</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Toplam Tutar</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedReservation.totalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Katılımcı Sayısı</span>
                      <span className="text-sm font-medium text-gray-900">{selectedReservation.participants} kişi</span>
                    </div>
                  </div>
                </div>

                {/* İptal/İade Geçmişi */}
                {selectedReservation.cancellationHistory && selectedReservation.cancellationHistory.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">İptal/İade Geçmişi</h4>
                    <div className="space-y-3">
                      {selectedReservation.cancellationHistory.map((history, index) => (
                        <div key={index} className="border-l-2 border-red-500 pl-3">
                          <div className="text-sm text-gray-600">{formatDate(history.date)}</div>
                          <div className="text-sm text-gray-900">{history.reason}</div>
                          {history.refundAmount && (
                            <div className="text-sm text-red-600">
                              İade Tutarı: {formatCurrency(history.refundAmount)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notlar */}
                {selectedReservation.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Notlar</h4>
                    <p className="text-sm text-gray-600">{selectedReservation.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 