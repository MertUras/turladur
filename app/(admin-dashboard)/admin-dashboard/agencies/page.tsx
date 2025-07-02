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

interface Agency {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  registrationDate: string;
  totalTours: number;
  totalReservations: number;
  averageRating: number;
  totalGuides: number;
  logo?: string;
  description?: string;
  documents?: {
    id: number;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
  }[];
  performance?: {
    monthlyRevenue: number[];
    monthlyBookings: number[];
    monthlyRatings: number[];
  };
  financialReports?: {
    id: number;
    period: string;
    revenue: number;
    commission: number;
    netIncome: number;
    status: 'pending' | 'paid' | 'overdue';
  }[];
  feedback?: {
    id: number;
    customerName: string;
    rating: number;
    comment: string;
    date: string;
    tourName: string;
  }[];
  ratingHistory?: {
    date: string;
    rating: number;
    reason?: string;
  }[];
  contracts?: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'expired' | 'pending';
    type: 'standard' | 'premium' | 'exclusive';
    commission: number;
    documents: {
      id: number;
      name: string;
      url: string;
      uploadDate: string;
    }[];
  }[];
  history: {
    id: number;
    action: 'approve' | 'reject' | 'suspend' | 'activate' | 'create' | 'update' | 'delete';
    adminName: string;
    adminEmail: string;
    timestamp: string;
    details?: string;
    previousStatus?: Agency['status'];
    newStatus?: Agency['status'];
  }[];
}

interface Tour {
  id: number;
  name: string;
  location: string;
  price: number;
  duration: string;
  status: 'active' | 'inactive' | 'draft';
  totalReservations: number;
  averageRating: number;
  image: string;
  startDate: string;
  endDate: string;
}

interface Guide {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  totalTours: number;
  averageRating: number;
  avatar?: string;
}

const AgencyManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'details' | 'tours' | 'guides' | 'documents' | 'performance' | 'financial' | 'feedback' | 'contracts' | 'history'>('details');
  const [showAutoApprove, setShowAutoApprove] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [pendingAgencies, setPendingAgencies] = useState<number>(0);

  // Acenteleri yükle
  useEffect(() => {
    const loadAgencies = async () => {
      try {
        const response = await fetch('/api/admin/agencies');
        if (!response.ok) {
          throw new Error('Acenteler yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        
        // API'den gelen verileri Agency tipine dönüştür
        const formattedAgencies: Agency[] = data.map((agency: any) => ({
          id: agency.id,
          name: agency.name,
          email: agency.user.email,
          phone: agency.phone,
          address: agency.address,
          status: agency.status.toLowerCase(),
          registrationDate: new Date(agency.createdAt).toISOString(),
          totalTours: agency.totalTours || 0,
          totalReservations: agency.totalReservations || 0,
          averageRating: agency.averageRating || 0,
          totalGuides: agency.totalGuides || 0,
          logo: agency.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(agency.name)}&background=0D8ABC&color=fff`,
          description: agency.description,
          history: agency.history || []
        }));

        setAgencies(formattedAgencies);
      } catch (error) {
        console.error('Acenteler yüklenirken hata:', error);
        alert('Acenteler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      }
    };

    loadAgencies();
  }, []);

  // Bekleyen acenteleri kontrol et
  useEffect(() => {
    const checkPendingAgencies = async () => {
      try {
        const response = await fetch('/api/admin/pending-agencies');
        const data = await response.json();
        setPendingAgencies(data.count);
      } catch (error) {
        console.error('Bekleyen acenteler kontrol edilirken hata:', error);
      }
    };

    checkPendingAgencies();
    // Her 5 dakikada bir kontrol et
    const interval = setInterval(checkPendingAgencies, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Örnek tur verileri
  const tours: Tour[] = [
    {
      id: 1,
      name: 'Kapadokya Turu',
      location: 'Nevşehir',
      price: 2500,
      duration: '3 Gün',
      status: 'active',
      totalReservations: 45,
      averageRating: 4.8,
      image: 'https://images.unsplash.com/photo-1570844065536-f5135048a6e3',
      startDate: '2024-04-01',
      endDate: '2024-04-03'
    },
    // Daha fazla örnek tur eklenebilir
  ];

  // Örnek rehber verileri
  const guides: Guide[] = [
    {
      id: 1,
      name: 'Mehmet Yılmaz',
      email: 'mehmet@example.com',
      phone: '+90 555 987 6543',
      status: 'active',
      totalTours: 15,
      averageRating: 4.7,
      avatar: 'https://ui-avatars.com/api/?name=Mehmet+Yılmaz'
    },
    // Daha fazla örnek rehber eklenebilir
  ];

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

  const handleStatusChange = async (agencyId: number, newStatus: Agency['status']) => {
    try {
      const response = await fetch('/api/admin/agencies', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: agencyId,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Durum güncellenirken bir hata oluştu');
      }

      const updatedAgency = await response.json();

    const now = new Date();
      const historyEntry: Agency['history'][0] = {
      id: Date.now(),
      action: newStatus === 'approved' ? 'approve' : 
              newStatus === 'rejected' ? 'reject' : 
              newStatus === 'suspended' ? 'suspend' : 'activate',
        adminName: 'Admin Kullanıcı',
        adminEmail: 'admin@example.com',
      timestamp: now.toISOString(),
        previousStatus: agencies.find(a => a.id === agencyId)?.status,
      newStatus: newStatus,
        details: `${agencies.find(a => a.id === agencyId)?.name} acentesinin durumu ${getStatusText(agencies.find(a => a.id === agencyId)?.status || '')}'den ${getStatusText(newStatus)}'e değiştirildi.`
    };

    setAgencies(agencies.map(agency => 
      agency.id === agencyId 
        ? { 
            ...agency, 
            status: newStatus,
            history: [...(agency.history || []), historyEntry]
          }
        : agency
    ));

      // Bekleyen acente sayısını güncelle
      if (newStatus === 'approved' || newStatus === 'rejected') {
        const pendingResponse = await fetch('/api/admin/pending-agencies');
        const pendingData = await pendingResponse.json();
        setPendingAgencies(pendingData.count);
      }
    } catch (error) {
      console.error('Durum güncellenirken hata:', error);
      alert('Durum güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleDeleteAgency = (agencyId: number) => {
    const agency = agencies.find(a => a.id === agencyId);
    if (!agency) return;

    if (window.confirm('Bu acenteyi silmek istediğinizden emin misiniz?')) {
      const now = new Date();
      const historyEntry: Agency['history'][0] = {
        id: Date.now(),
        action: 'delete',
        adminName: 'Admin Kullanıcı',
        adminEmail: 'admin@example.com',
        timestamp: now.toISOString(),
        details: `${agency.name} acentesi silindi.`
      };

      setAgencies(agencies.map(a => 
        a.id === agencyId 
          ? { ...a, history: [...(a.history || []), historyEntry] }
          : a
      ).filter(a => a.id !== agencyId));
    }
  };

  const handleModalStatusChange = (agencyId: number, newStatus: Agency['status']) => {
    handleStatusChange(agencyId, newStatus);
    setSelectedAgency(null); // Modalı kapat
  };

  const getActionColor = (action: Agency['history'][0]['action']) => {
    switch (action) {
      case 'approve':
      case 'activate':
        return 'text-green-600';
      case 'reject':
      case 'delete':
        return 'text-red-600';
      case 'suspend':
        return 'text-yellow-600';
      case 'update':
        return 'text-blue-600';
      case 'create':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getActionText = (action: Agency['history'][0]['action']) => {
    switch (action) {
      case 'approve':
        return 'Onaylama';
      case 'reject':
        return 'Reddetme';
      case 'suspend':
        return 'Askıya Alma';
      case 'activate':
        return 'Aktifleştirme';
      case 'update':
        return 'Güncelleme';
      case 'create':
        return 'Oluşturma';
      case 'delete':
        return 'Silme';
      default:
        return action;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bildirim Badge */}
      {pendingAgencies > 0 && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <span className="mr-2">{pendingAgencies}</span>
            <span>Onay Bekleyen Acente</span>
          </div>
        </div>
      )}

      {/* Bekleyen Acenteler Bildirimi */}
      {pendingAgencies > 0 && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {pendingAgencies} adet acente onay bekliyor. Lütfen kontrol edin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Başlık ve İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Acente</p>
              <p className="text-2xl font-semibold text-gray-900">156</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Onaylı Acente</p>
              <p className="text-2xl font-semibold text-gray-900">142</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ortalama Değerlendirme</p>
              <p className="text-2xl font-semibold text-gray-900">4.2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Arama, Filtre ve Butonlar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Acente adı, e-posta veya telefon ile ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-700">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            Filtreler
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <ArrowDownTrayIcon className="h-5 w-5" />
            Dışa Aktar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <BuildingOfficeIcon className="h-5 w-5" />
            Yeni Acente Ekle
          </button>
        </div>
      </div>

      {/* Filtreler ve Arama */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Acente adı, e-posta veya telefon ile ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-gray-700"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              Filtreler
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Gelişmiş Filtreler */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Onay Durumu</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tümü</option>
                <option value="approved">Onaylı</option>
                <option value="pending">Bekleyen</option>
                <option value="rejected">Reddedilmiş</option>
                <option value="suspended">Askıya Alınmış</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kayıt Tarihi</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Değerlendirme</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="all">Tümü</option>
                <option value="4+">4 ve üzeri</option>
                <option value="3+">3 ve üzeri</option>
                <option value="2+">2 ve üzeri</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Acente Listesi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rezervasyonlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Değerlendirme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rehberler
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={agency.logo}
                          alt={agency.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{agency.name}</div>
                        <div className="text-sm text-gray-500">{agency.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agency.status)}`}>
                      {getStatusText(agency.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agency.totalTours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agency.totalReservations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-500">{agency.averageRating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agency.totalGuides}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => setSelectedAgency(agency)}
                        title="Detayları Görüntüle"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => {
                          setEditingAgency(agency);
                          setShowEditModal(true);
                        }}
                        title="Düzenle"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      {agency.status === 'pending' && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleStatusChange(agency.id, 'approved')}
                            title="Onayla"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleStatusChange(agency.id, 'rejected')}
                            title="Reddet"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {agency.status === 'approved' && (
                        <button
                          className="text-yellow-600 hover:text-yellow-900"
                          onClick={() => handleStatusChange(agency.id, 'suspended')}
                          title="Askıya Al"
                        >
                          <ExclamationCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      {agency.status === 'suspended' && (
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleStatusChange(agency.id, 'approved')}
                          title="Aktifleştir"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                        </button>
                      )}
                        {agency.status === 'rejected' && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleStatusChange(agency.id, 'approved')}
                            title="Yeniden Onayla"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteAgency(agency.id)}
                        title="Sil"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Düzenleme Modalı */}
      {showEditModal && editingAgency && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Acente Düzenle</h2>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAgency(null);
                  }}
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Acente Adı
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingAgency.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingAgency.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingAgency.phone}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adres
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingAgency.address}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durum
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingAgency.status}
                    >
                      <option value="approved">Onaylı</option>
                      <option value="pending">Beklemede</option>
                      <option value="rejected">Reddedilmiş</option>
                      <option value="suspended">Askıya Alınmış</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kayıt Tarihi
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingAgency.registrationDate}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    defaultValue={editingAgency.description}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingAgency(null);
                    }}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Acente Detay Modalı */}
      {selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <img
                  src={selectedAgency.logo}
                  alt={selectedAgency.name}
                  className="h-16 w-16 rounded-full"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">{selectedAgency.name}</h2>
                  <p className="text-gray-500">{selectedAgency.email}</p>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setSelectedAgency(null)}
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Sekmeler */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'details'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTab('details')}
                >
                  Detaylar
                </button>
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'tours'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTab('tours')}
                >
                  Turlar
                </button>
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'guides'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTab('guides')}
                >
                  Rehberler
                </button>
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'documents'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTab('documents')}
                >
                  Belgeler
                </button>
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'performance'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTab('performance')}
                >
                  Performans
                </button>
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'financial'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTab('financial')}
                >
                  Finansal
                </button>
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'feedback'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTab('feedback')}
                >
                  Geri Bildirimler
                </button>
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'contracts'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTab('contracts')}
                >
                  Sözleşmeler
                </button>
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'history'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTab('history')}
                >
                  İşlem Geçmişi
                </button>
              </nav>
            </div>

            {/* Sekme İçerikleri */}
            {selectedTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">İletişim Bilgileri</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <span className="ml-3 text-sm text-gray-900">{selectedAgency.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <span className="ml-3 text-sm text-gray-900">{selectedAgency.email}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        <span className="ml-3 text-sm text-gray-900">{selectedAgency.address}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">İstatistikler</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Toplam Tur</p>
                        <p className="text-2xl font-semibold text-gray-900">{selectedAgency.totalTours}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Toplam Rezervasyon</p>
                        <p className="text-2xl font-semibold text-gray-900">{selectedAgency.totalReservations}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Değerlendirme</p>
                        <p className="text-2xl font-semibold text-gray-900">{selectedAgency.averageRating}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Toplam Rehber</p>
                        <p className="text-2xl font-semibold text-gray-900">{selectedAgency.totalGuides}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {selectedAgency.description && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Açıklama</h3>
                    <p className="text-sm text-gray-600">{selectedAgency.description}</p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === 'tours' && (
              <div className="space-y-4">
                {tours.map((tour) => (
                  <div key={tour.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{tour.name}</p>
                          <p className="text-xs text-gray-500">{tour.location}</p>
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">{tour.averageRating}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500">{tour.duration}</span>
                          <span className="text-gray-500">{tour.price} TL</span>
                        </div>
                        <span className="text-gray-500">{tour.totalReservations} rezervasyon</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'guides' && (
              <div className="space-y-4">
                {guides.map((guide) => (
                  <div key={guide.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <img
                      src={guide.avatar}
                      alt={guide.name}
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{guide.name}</p>
                          <p className="text-xs text-gray-500">{guide.email}</p>
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">{guide.averageRating}</span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500">{guide.phone}</span>
                          <span className="text-gray-500">{guide.totalTours} tur</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          guide.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {guide.status === 'active' ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'documents' && (
              <div className="space-y-4">
                {selectedAgency.documents?.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">Yüklenme: {doc.uploadDate}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-900">
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Aylık Gelir</h4>
                    <div className="h-32">
                      <div className="flex items-end h-full space-x-2">
                        {selectedAgency.performance?.monthlyRevenue.map((value, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-blue-500 rounded-t"
                            style={{ height: `${(value / Math.max(...selectedAgency.performance!.monthlyRevenue)) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Aylık Rezervasyonlar</h4>
                    <div className="h-32">
                      <div className="flex items-end h-full space-x-2">
                        {selectedAgency.performance?.monthlyBookings.map((value, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-green-500 rounded-t"
                            style={{ height: `${(value / Math.max(...selectedAgency.performance!.monthlyBookings)) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Aylık Değerlendirmeler</h4>
                    <div className="h-32">
                      <div className="flex items-end h-full space-x-2">
                        {selectedAgency.performance?.monthlyRatings.map((value, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-yellow-500 rounded-t"
                            style={{ height: `${(value / 5) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'financial' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Finansal Raporlar</h3>
                  <button className="text-blue-600 hover:text-blue-900">
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dönem</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gelir</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Komisyon</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Kazanç</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedAgency.financialReports?.map((report) => (
                        <tr key={report.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.period}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.revenue} TL</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.commission} TL</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.netIncome} TL</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              report.status === 'paid' ? 'bg-green-100 text-green-800' :
                              report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {report.status === 'paid' ? 'Ödendi' :
                               report.status === 'pending' ? 'Beklemede' : 'Gecikmiş'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedTab === 'feedback' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Müşteri Geri Bildirimleri</h3>
                      <div className="space-y-4">
                        {selectedAgency.feedback?.map((feedback) => (
                          <div key={feedback.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{feedback.customerName}</p>
                                <p className="text-xs text-gray-500">{feedback.tourName}</p>
                              </div>
                              <div className="flex items-center">
                                <StarIcon className="h-4 w-4 text-yellow-400" />
                                <span className="ml-1 text-sm text-gray-600">{feedback.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{feedback.comment}</p>
                            <p className="text-xs text-gray-500 mt-2">{feedback.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Değerlendirme Geçmişi</h3>
                      <div className="space-y-4">
                        {selectedAgency.ratingHistory?.map((rating, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{rating.date}</p>
                                {rating.reason && (
                                  <p className="text-sm text-gray-600">{rating.reason}</p>
                                )}
                              </div>
                              <div className="flex items-center">
                                <StarIcon className="h-4 w-4 text-yellow-400" />
                                <span className="ml-1 text-sm text-gray-600">{rating.rating}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              
            )}

            {selectedTab === 'contracts' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Sözleşmeler</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Yeni Sözleşme
                  </button>
                </div>
                <div className="space-y-4">
                  {selectedAgency.contracts?.map((contract) => (
                    <div key={contract.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{contract.name}</h4>
                          <p className="text-xs text-gray-500">
                            {contract.startDate} - {contract.endDate}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            contract.status === 'active' ? 'bg-green-100 text-green-800' :
                            contract.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {contract.status === 'active' ? 'Aktif' :
                             contract.status === 'expired' ? 'Süresi Doldu' : 'Beklemede'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            contract.type === 'premium' ? 'bg-purple-100 text-purple-800' :
                            contract.type === 'exclusive' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {contract.type === 'premium' ? 'Premium' :
                             contract.type === 'exclusive' ? 'Exclusive' : 'Standart'}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Komisyon Oranı</p>
                          <p className="text-sm font-medium text-gray-900">%{contract.commission}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Belgeler</p>
                          <div className="mt-1 space-y-1">
                            {contract.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{doc.name}</span>
                                <button className="text-blue-600 hover:text-blue-900">
                                  <ArrowDownTrayIcon className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'history' && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">İşlem Geçmişi</h3>
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {selectedAgency.history?.map((event, eventIdx) => (
                          <li key={event.id}>
                            <div className="relative pb-8">
                              {eventIdx !== selectedAgency.history!.length - 1 ? (
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                    event.action === 'approve' || event.action === 'activate'
                                      ? 'bg-green-500'
                                      : event.action === 'reject' || event.action === 'delete'
                                      ? 'bg-red-500'
                                      : event.action === 'suspend'
                                      ? 'bg-yellow-500'
                                      : event.action === 'update'
                                      ? 'bg-blue-500'
                                      : 'bg-purple-500'
                                  }`}>
                                    {event.action === 'approve' || event.action === 'activate' ? (
                                      <CheckCircleIcon className="h-5 w-5 text-white" />
                                    ) : event.action === 'reject' || event.action === 'delete' ? (
                                      <XCircleIcon className="h-5 w-5 text-white" />
                                    ) : event.action === 'suspend' ? (
                                      <ExclamationCircleIcon className="h-5 w-5 text-white" />
                                    ) : event.action === 'update' ? (
                                      <PencilSquareIcon className="h-5 w-5 text-white" />
                                    ) : (
                                      <PlusCircleIcon className="h-5 w-5 text-white" />
                                    )}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className={`text-sm font-medium ${getActionColor(event.action)}`}>
                                      {getActionText(event.action)}
                                    </p>
                                    <p className="mt-0.5 text-sm text-gray-500">
                                      {event.details}
                                    </p>
                                    {event.previousStatus && event.newStatus && (
                                      <p className="mt-0.5 text-sm text-gray-500">
                                        Durum: {getStatusText(event.previousStatus)} → {getStatusText(event.newStatus)}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    <div>
                                      <p>{format(new Date(event.timestamp), 'dd MMMM yyyy HH:mm', { locale: tr })}</p>
                                      <p className="mt-1">{event.adminName}</p>
                                      <p className="text-xs">{event.adminEmail}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Otomatik Onay Sistemi */}
            {selectedAgency.status === 'pending' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Otomatik Onay Sistemi</h3>
                    <p className="text-sm text-gray-500">
                      Bu acente için otomatik onay kriterlerini ayarlayın
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setShowAutoApprove(!showAutoApprove)}
                  >
                    {showAutoApprove ? 'Kapat' : 'Ayarla'}
                  </button>
                </div>
                {showAutoApprove && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Minimum Değerlendirme</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="4.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Minimum Tur Sayısı</label>
                      <input
                        type="number"
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Minimum Rezervasyon Sayısı</label>
                      <input
                        type="number"
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="20"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Belge kontrolünü otomatikleştir
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* İşlem Butonları */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setSelectedAgency(null)}
              >
                Kapat
              </button>
              {selectedAgency.status === 'pending' && (
                <>
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={() => handleModalStatusChange(selectedAgency.id, 'approved')}
                  >
                    Onayla
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={() => handleModalStatusChange(selectedAgency.id, 'rejected')}
                  >
                    Reddet
                  </button>
                </>
              )}
              {selectedAgency.status === 'approved' && (
                <button 
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  onClick={() => handleModalStatusChange(selectedAgency.id, 'suspended')}
                >
                  Askıya Al
                </button>
              )}
              {selectedAgency.status === 'suspended' && (
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() => handleModalStatusChange(selectedAgency.id, 'approved')}
                >
                  Aktifleştir
                </button>
              )}
              {selectedAgency.status === 'rejected' && (
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() => handleModalStatusChange(selectedAgency.id, 'approved')}
                >
                    Yeniden Onayla
                </button>
              )}
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => {
                  if (window.confirm('Bu acenteyi silmek istediğinizden emin misiniz')) {
                    handleDeleteAgency(selectedAgency.id);
                    setSelectedAgency(null);
                  }
                }}
              >
                Sil
              </button>
            </div>
          </div>
        )}
      </div>
   )}
    </div>
  );
};

export default AgencyManagement; 