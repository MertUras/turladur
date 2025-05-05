'use client';

import { useState } from 'react';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface Payment {
  id: string;
  type: 'agency' | 'guide' | 'commission' | 'refund';
  recipient: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  invoiceNumber: string;
  description: string;
  refundReason?: string;
  originalPaymentId?: string;
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Örnek veri
  const payments: Payment[] = [
    {
      id: '1',
      type: 'agency',
      recipient: 'Anadolu Turizm A.Ş.',
      amount: 15000,
      status: 'completed',
      date: '2024-03-18',
      invoiceNumber: 'INV-2024-001',
      description: 'Kapadokya turu ödemesi',
    },
    {
      id: '2',
      type: 'guide',
      recipient: 'Mehmet Yılmaz',
      amount: 2500,
      status: 'pending',
      date: '2024-03-18',
      invoiceNumber: 'INV-2024-002',
      description: 'İstanbul turu rehberlik ücreti',
    },
    {
      id: '3',
      type: 'commission',
      recipient: 'TourTech Platform',
      amount: 1500,
      status: 'completed',
      date: '2024-03-18',
      invoiceNumber: 'INV-2024-003',
      description: 'Platform komisyonu',
    },
    {
      id: '4',
      type: 'refund',
      recipient: 'Ahmet Demir',
      amount: 1200,
      status: 'completed',
      date: '2024-03-17',
      invoiceNumber: 'INV-2024-004',
      description: 'Kapadokya turu iptal geri ödemesi',
      refundReason: 'Müşteri talebi',
      originalPaymentId: 'PAY-2024-001',
    },
    {
      id: '5',
      type: 'refund',
      recipient: 'Ayşe Yılmaz',
      amount: 800,
      status: 'pending',
      date: '2024-03-17',
      invoiceNumber: 'INV-2024-005',
      description: 'İstanbul turu kısmi geri ödeme',
      refundReason: 'Hizmet kalitesi',
      originalPaymentId: 'PAY-2024-002',
    },
  ];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'agency':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'guide':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'commission':
        return <CurrencyDollarIcon className="h-5 w-5" />;
      case 'refund':
        return <ArrowUturnLeftIcon className="h-5 w-5" />;
      default:
        return <CurrencyDollarIcon className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Üst Bölüm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ödemeler & Komisyonlar</h1>
            <p className="text-gray-500 mt-1">Acente ödemeleri, rehber ödemeleri ve platform komisyonlarının yönetimi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Fatura Oluştur
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Toplu Ödeme
            </button>
          </div>
        </div>

        {/* Özet Kartları */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Toplam Acente Ödemesi</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatCurrency(15000)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Toplam Rehber Ödemesi</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatCurrency(2500)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Platform Komisyonu</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatCurrency(1500)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowUturnLeftIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Bekleyen İadeler</dt>
                    <dd className="text-lg font-medium text-gray-900">{formatCurrency(800)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtreler */}
        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md bg-white text-gray-900"
              placeholder="Alıcı veya açıklama ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-gray-900"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tüm Tipler</option>
              <option value="agency">Acente</option>
              <option value="guide">Rehber</option>
              <option value="commission">Komisyon</option>
              <option value="refund">Geri Ödeme</option>
            </select>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-gray-900"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Beklemede</option>
              <option value="completed">Tamamlandı</option>
              <option value="failed">Başarısız</option>
            </select>
          </div>
        </div>

        {/* Ödemeler Tablosu */}
        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alıcı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fatura No
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedPayment(payment)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          {getTypeIcon(payment.type)}
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.type === 'agency' ? 'Acente' :
                             payment.type === 'guide' ? 'Rehber' :
                             payment.type === 'commission' ? 'Komisyon' : 'Geri Ödeme'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{payment.recipient}</div>
                      <div className="text-sm text-gray-500">{payment.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status === 'completed' ? 'Tamamlandı' :
                           payment.status === 'pending' ? 'Beklemede' : 'Başarısız'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Fatura indirme işlemi
                        }}
                      >
                        <DocumentTextIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ödeme Detay Modalı */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Ödeme Detayları</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedPayment(null)}
                >
                  <span className="sr-only">Kapat</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tip</h4>
                  <div className="mt-1 flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      {getTypeIcon(selectedPayment.type)}
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">
                        {selectedPayment.type === 'agency' ? 'Acente' :
                         selectedPayment.type === 'guide' ? 'Rehber' :
                         selectedPayment.type === 'commission' ? 'Komisyon' : 'Geri Ödeme'}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Alıcı</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPayment.recipient}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tutar</h4>
                  <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Durum</h4>
                  <div className="mt-1 flex items-center">
                    {getStatusIcon(selectedPayment.status)}
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}>
                      {selectedPayment.status === 'completed' ? 'Tamamlandı' :
                       selectedPayment.status === 'pending' ? 'Beklemede' : 'Başarısız'}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tarih</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedPayment.date).toLocaleDateString('tr-TR')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Fatura No</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPayment.invoiceNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Açıklama</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedPayment.description}</p>
                </div>
                {selectedPayment.type === 'refund' && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">İade Nedeni</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedPayment.refundReason}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Orijinal Ödeme ID</h4>
                      <p className="mt-1 text-sm text-gray-900">{selectedPayment.originalPaymentId}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setSelectedPayment(null)}
                >
                  Kapat
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Faturayı İndir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 