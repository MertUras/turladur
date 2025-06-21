'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  StarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChartBarIcon,
  CalendarIcon,
  UserIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Dialog, Tab } from '@headlessui/react';

interface ActivityOperator {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  totalActivities?: number;
  totalReservations?: number;
  averageRating?: number;
  logo?: string;
  description?: string;
}

export default function ActivityOperatorsPage() {
  const [operators, setOperators] = useState<ActivityOperator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOperator, setSelectedOperator] = useState<ActivityOperator | null>(null);
  const [selectedTab, setSelectedTab] = useState<'details' | 'activities' | 'financial' | 'feedback'>('details');

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      const response = await fetch('/api/admin/activity-operators');
      if (!response.ok) {
        throw new Error('Operatörler yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setOperators(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/activity-operators', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Durum güncellenirken bir hata oluştu');
      }

      // Başarılı güncelleme sonrası listeyi yenile
      fetchOperators();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const filteredOperators = operators.filter(operator => {
    const matchesSearch = 
      (operator.name && operator.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (operator.email && operator.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || operator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Onaylı';
      case 'pending':
        return 'Beklemede';
      case 'rejected':
        return 'Reddedildi';
      case 'suspended':
        return 'Askıya Alındı';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Özet Kutuları */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Acente</p>
              <p className="text-2xl font-semibold text-gray-900">{operators.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Onaylı Acente</p>
              <p className="text-2xl font-semibold text-gray-900">{operators.filter(o => o.status === 'approved').length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-2xl font-semibold text-gray-900">{operators.filter(o => o.status === 'pending').length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <StarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ortalama Değerlendirme</p>
              <p className="text-2xl font-semibold text-gray-900">{(() => {
                const approved = operators.filter(o => o.status === 'approved' && typeof o.averageRating === 'number');
                if (!approved.length) return '-';
                const avg = approved.reduce((acc, o) => acc + (o.averageRating || 0), 0) / approved.length;
                return avg.toFixed(1);
              })()}</p>
            </div>
          </div>
        </div>

        {/* Başlık ve İşlemler */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Aktivite Acentaları</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <ArrowDownTrayIcon className="h-5 w-5" />
              Rapor İndir
            </button>
          </div>
        </div>

        {/* Arama ve Filtre Kutusu */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Operatör adı, e-posta veya telefon ile ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Beklemede</option>
                <option value="approved">Onaylı</option>
                <option value="rejected">Reddedildi</option>
                <option value="suspended">Askıya Alındı</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tablo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Operatör</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Durum</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Telefon</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Kayıt Tarihi</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Toplam Aktivite</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Toplam Rezervasyon</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Ortalama Puan</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOperators.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">Kayıtlı aktivite acentası bulunamadı.</td>
                </tr>
              ) : (
                filteredOperators.map((operator) => (
                  <tr key={operator.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                          {operator.logo ? (
                            <img src={operator.logo} alt={operator.name} className="h-10 w-10 object-cover" />
                          ) : (
                            <UserIcon className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{operator.name}</div>
                          <div className="text-sm text-gray-700">{operator.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(operator.status)}`}>{getStatusText(operator.status)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{operator.phone || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{format(new Date(operator.createdAt), 'dd MMMM yyyy', { locale: tr })}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-900">{operator.totalActivities ?? '-'}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-900">{operator.totalReservations ?? '-'}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap text-gray-900">{operator.averageRating !== undefined ? operator.averageRating.toFixed(1) : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="Detayları Gör" onClick={() => setSelectedOperator(operator)}><EyeIcon className="h-5 w-5" /></button>
                        <button className="text-gray-600 hover:text-gray-900" title="Düzenle"><PencilSquareIcon className="h-5 w-5" /></button>
                        {operator.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatusChange(operator.id, 'approved')} className="text-green-600 hover:text-green-900" title="Onayla"><CheckCircleIcon className="h-5 w-5" /></button>
                            <button onClick={() => handleStatusChange(operator.id, 'rejected')} className="text-red-600 hover:text-red-900" title="Reddet"><XCircleIcon className="h-5 w-5" /></button>
                          </>
                        )}
                        {operator.status === 'approved' && (
                          <button onClick={() => handleStatusChange(operator.id, 'suspended')} className="text-yellow-600 hover:text-yellow-900" title="Askıya Al"><ExclamationCircleIcon className="h-5 w-5" /></button>
                        )}
                        {operator.status === 'suspended' && (
                          <button onClick={() => handleStatusChange(operator.id, 'approved')} className="text-green-600 hover:text-green-900" title="Tekrar Onayla"><CheckCircleIcon className="h-5 w-5" /></button>
                        )}
                        <button className="text-red-600 hover:text-red-900" title="Sil"><TrashIcon className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Detay Modalı */}
        <Dialog open={!!selectedOperator} onClose={() => setSelectedOperator(null)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-30" />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6 z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                    {selectedOperator?.logo ? (
                      <img src={selectedOperator.logo} alt={selectedOperator.name} className="h-14 w-14 object-cover rounded-full" />
                    ) : (
                      <UserIcon className="h-8 w-8 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {selectedOperator?.name}
                      {selectedOperator && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOperator.status)}`}>{getStatusText(selectedOperator.status)}</span>
                      )}
                    </Dialog.Title>
                    <div className="flex items-center gap-2 mt-1">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{selectedOperator?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{selectedOperator ? format(new Date(selectedOperator.createdAt), 'dd MMMM yyyy', { locale: tr }) : '-'}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedOperator(null)} className="text-gray-400 hover:text-gray-600"><XCircleIcon className="h-6 w-6" /></button>
              </div>
              <Tab.Group selectedIndex={['details','activities','financial','feedback'].indexOf(selectedTab)} onChange={i => setSelectedTab(['details','activities','financial','feedback'][i] as any)}>
                <Tab.List className="flex space-x-4 border-b mb-4">
                  <Tab className={({ selected }) => selected ? 'px-4 py-2 border-b-2 border-blue-600 text-blue-700 font-semibold' : 'px-4 py-2 text-gray-500'}>Detaylar</Tab>
                  <Tab className={({ selected }) => selected ? 'px-4 py-2 border-b-2 border-blue-600 text-blue-700 font-semibold' : 'px-4 py-2 text-gray-500'}>Aktiviteler</Tab>
                  <Tab className={({ selected }) => selected ? 'px-4 py-2 border-b-2 border-blue-600 text-blue-700 font-semibold' : 'px-4 py-2 text-gray-500'}>Finansal</Tab>
                  <Tab className={({ selected }) => selected ? 'px-4 py-2 border-b-2 border-blue-600 text-blue-700 font-semibold' : 'px-4 py-2 text-gray-500'}>Geri Bildirimler</Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    {/* Detaylar Sekmesi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">İletişim Bilgileri</h3>
                        <div className="space-y-4">
                          <div className="flex items-center text-gray-700"><EnvelopeIcon className="h-5 w-5 mr-2" />{selectedOperator?.email}</div>
                          <div className="flex items-center text-gray-700"><PhoneIcon className="h-5 w-5 mr-2" />{selectedOperator?.phone || '-'}</div>
                          {/* Adres alanı kaldırıldı */}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">İstatistikler</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Toplam Aktivite</p>
                            <p className="text-2xl font-semibold text-gray-900">{selectedOperator?.totalActivities ?? 0}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Toplam Rezervasyon</p>
                            <p className="text-2xl font-semibold text-gray-900">{selectedOperator?.totalReservations ?? 0}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Değerlendirme</p>
                            <p className="text-2xl font-semibold text-gray-900">{selectedOperator?.averageRating !== undefined ? selectedOperator.averageRating.toFixed(1) : '-'}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Durum</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedOperator ? getStatusColor(selectedOperator.status) : ''}`}>{selectedOperator ? getStatusText(selectedOperator.status) : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedOperator?.description && (
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Açıklama</h3>
                        <p className="text-sm text-gray-600">{selectedOperator.description}</p>
                      </div>
                    )}
                    <div className="flex justify-end gap-2 mt-6">
                      {selectedOperator?.status === 'approved' && (
                        <button onClick={() => handleStatusChange(selectedOperator.id, 'suspended')} className="px-4 py-2 rounded bg-yellow-100 text-yellow-800 font-semibold hover:bg-yellow-200">Askıya Al</button>
                      )}
                      <button className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700">Sil</button>
                      <button onClick={() => setSelectedOperator(null)} className="px-4 py-2 rounded border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">Kapat</button>
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    {/* Aktiviteler Sekmesi */}
                    <div className="text-gray-500 text-center py-8">Aktivite listesi burada gösterilecek.</div>
                  </Tab.Panel>
                  <Tab.Panel>
                    {/* Finansal Sekmesi */}
                    <div className="text-gray-500 text-center py-8">Finansal bilgiler burada gösterilecek.</div>
                  </Tab.Panel>
                  <Tab.Panel>
                    {/* Geri Bildirimler Sekmesi */}
                    <div className="text-gray-500 text-center py-8">Geri bildirimler burada gösterilecek.</div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
} 