'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, CheckCircleIcon, XCircleIcon, ClockIcon, ChatBubbleLeftIcon, PhoneIcon, EnvelopeIcon, ChevronDownIcon, CalendarIcon } from '@heroicons/react/24/outline';

// Rezervasyon tipi tanımı
interface Reservation {
  id: number;
  referenceNumber: string;
  customerName: string;
  tourName: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'partial' | 'unpaid' | 'refunded';
  contactInfo: {
    email: string;
    phone: string;
  };
  notes?: string;
}

export default function ReservationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateSort, setDateSort] = useState('desc');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  
  // Örnek rezervasyon verileri
  const reservations: Reservation[] = [
    {
      id: 1,
      referenceNumber: 'RES-2023-1001',
      customerName: 'Ahmet Yılmaz',
      tourName: 'Kapadokya Kültür Turu',
      date: '2023-11-20',
      participants: 2,
      totalPrice: 3500,
      status: 'confirmed',
      paymentStatus: 'paid',
      contactInfo: {
        email: 'ahmet.yilmaz@example.com',
        phone: '+90 555 123 4567'
      }
    },
    {
      id: 2,
      referenceNumber: 'RES-2023-1002',
      customerName: 'Ayşe Kaya',
      tourName: 'İstanbul Boğaz Turu',
      date: '2023-11-18',
      participants: 4,
      totalPrice: 5200,
      status: 'completed',
      paymentStatus: 'paid',
      contactInfo: {
        email: 'ayse.kaya@example.com',
        phone: '+90 555 234 5678'
      },
      notes: 'Gruba 1 çocuk dahil. Vejetaryen menü talep edildi.'
    },
    {
      id: 3,
      referenceNumber: 'RES-2023-1003',
      customerName: 'Mehmet Demir',
      tourName: 'Efes Antik Kenti Turu',
      date: '2023-11-25',
      participants: 3,
      totalPrice: 4200,
      status: 'pending',
      paymentStatus: 'partial',
      contactInfo: {
        email: 'mehmet.demir@example.com',
        phone: '+90 555 345 6789'
      }
    },
    {
      id: 4,
      referenceNumber: 'RES-2023-1004',
      customerName: 'Zeynep Şahin',
      tourName: 'Pamukkale Günübirlik Turu',
      date: '2023-11-10',
      participants: 2,
      totalPrice: 2800,
      status: 'cancelled',
      paymentStatus: 'refunded',
      contactInfo: {
        email: 'zeynep.sahin@example.com',
        phone: '+90 555 456 7890'
      },
      notes: 'Sağlık sorunları nedeniyle iptal edildi.'
    },
    {
      id: 5,
      referenceNumber: 'RES-2023-1005',
      customerName: 'Emre Yıldız',
      tourName: 'Karadeniz Yaylalar Turu',
      date: '2023-12-05',
      participants: 5,
      totalPrice: 8750,
      status: 'confirmed',
      paymentStatus: 'unpaid',
      contactInfo: {
        email: 'emre.yildiz@example.com',
        phone: '+90 555 567 8901'
      }
    },
    {
      id: 6,
      referenceNumber: 'RES-2023-1006',
      customerName: 'Selin Aydın',
      tourName: 'Fethiye Tekne Turu',
      date: '2023-12-10',
      participants: 2,
      totalPrice: 3200,
      status: 'confirmed',
      paymentStatus: 'paid',
      contactInfo: {
        email: 'selin.aydin@example.com',
        phone: '+90 555 678 9012'
      }
    },
    {
      id: 7,
      referenceNumber: 'RES-2023-1007',
      customerName: 'Burak Özkan',
      tourName: 'Uludağ Kayak Turu',
      date: '2023-12-18',
      participants: 3,
      totalPrice: 5400,
      status: 'pending',
      paymentStatus: 'partial',
      contactInfo: {
        email: 'burak.ozkan@example.com',
        phone: '+90 555 789 0123'
      },
      notes: 'Kayak ekipmanları kiralama talebi var.'
    }
  ];

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

  // Rezervasyon detayını gösterme
  const showReservationDetail = (reservation: Reservation) => {
    setSelectedReservation(reservation);
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Rezervasyonlar</h1>
        <p className="text-gray-500">Tur rezervasyonlarını görüntüle ve yönet</p>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Müşteri adı, referans no veya tur adı ile ara..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Filtreler:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="confirmed">Onaylandı</option>
                <option value="pending">Beklemede</option>
                <option value="cancelled">İptal Edildi</option>
                <option value="completed">Tamamlandı</option>
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="block w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Tüm Ödemeler</option>
                <option value="paid">Ödendi</option>
                <option value="partial">Kısmi Ödeme</option>
                <option value="unpaid">Ödenmedi</option>
                <option value="refunded">İade Edildi</option>
              </select>
              <button
                onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                Tarih: {dateSort === 'asc' ? 'Eskiden Yeniye' : 'Yeniden Eskiye'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rezervasyon Listesi ve Detay */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Rezervasyon Listesi */}
        <div className="lg:flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">Rezervasyon Listesi</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referans No
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
                      Durum
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ödeme
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr 
                      key={reservation.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedReservation?.id === reservation.id ? 'bg-indigo-50' : ''}`}
                      onClick={() => showReservationDetail(reservation)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium capitalize rounded-full ${getStatusClass(reservation.status)}`}>
                          {translateStatus(reservation.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium capitalize rounded-full ${getPaymentStatusClass(reservation.paymentStatus)}`}>
                          {translatePaymentStatus(reservation.paymentStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredReservations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Belirtilen kriterlere uygun rezervasyon bulunamadı.
                </div>
              )}
            </div>
            {filteredReservations.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  Toplam {filteredReservations.length} rezervasyon listeleniyor
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Önceki
                  </button>
                  <button className="px-3 py-1 bg-indigo-600 border border-indigo-600 rounded-md text-sm text-white hover:bg-indigo-700">
                    Sonraki
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rezervasyon Detayı */}
        {selectedReservation && (
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-800">Rezervasyon Detayı</h2>
                <button 
                  onClick={() => setSelectedReservation(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Referans Numarası</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.referenceNumber}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                  <div className="mt-1 flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusClass(selectedReservation.status)}`}>
                      {translateStatus(selectedReservation.status)}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ödeme Durumu</h3>
                  <div className="mt-1 flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getPaymentStatusClass(selectedReservation.paymentStatus)}`}>
                      {translatePaymentStatus(selectedReservation.paymentStatus)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-500">Müşteri Bilgileri</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.customerName}</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={`mailto:${selectedReservation.contactInfo.email}`} className="text-sm text-indigo-600 hover:text-indigo-800">
                        {selectedReservation.contactInfo.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={`tel:${selectedReservation.contactInfo.phone}`} className="text-sm text-indigo-600 hover:text-indigo-800">
                        {selectedReservation.contactInfo.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-500">Tur Bilgileri</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{selectedReservation.tourName}</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-700">{formatDate(selectedReservation.date)}</p>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-700">
                        {selectedReservation.participants} Kişi - {formatCurrency(selectedReservation.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedReservation.notes && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-500">Notlar</h3>
                    <p className="mt-1 text-sm text-gray-700">{selectedReservation.notes}</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex flex-col space-y-3">
                  <button className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <ChatBubbleLeftIcon className="mr-2 h-5 w-5" />
                    Müşteriyle İletişime Geç
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <CheckCircleIcon className="mr-2 h-5 w-5 text-green-500" />
                      Onayla
                    </button>
                    <button className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <XCircleIcon className="mr-2 h-5 w-5 text-red-500" />
                      İptal Et
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 