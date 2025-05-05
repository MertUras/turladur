'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  StarIcon,
  UserGroupIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CalendarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface Guide {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  registrationDate: string;
  profileImage?: string;
  bio?: string;
  expertise: {
    id: number;
    name: string;
    level: 'beginner' | 'intermediate' | 'expert';
  }[];
  languages: {
    id: number;
    name: string;
    level: 'basic' | 'intermediate' | 'fluent' | 'native';
  }[];
  tours: {
    id: number;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    rating?: number;
  }[];
  agencies: {
    id: number;
    name: string;
    status: 'active' | 'inactive';
    startDate: string;
    endDate?: string;
  }[];
  documents: {
    id: number;
    name: string;
    type: string;
    url: string;
    uploadDate: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
  certifications: {
    id: number;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    status: 'active' | 'expired';
  }[];
  availability: {
    id: number;
    startDate: string;
    endDate: string;
    status: 'available' | 'booked' | 'unavailable';
  }[];
  history?: {
    id: number;
    action: 'create' | 'update' | 'approve' | 'reject' | 'suspend' | 'activate' | 'delete';
    adminName: string;
    adminEmail: string;
    timestamp: string;
    details?: string;
    previousStatus?: Guide['status'];
    newStatus?: Guide['status'];
  }[];
}

const GuideManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'details' | 'tours' | 'agencies' | 'documents' | 'certifications' | 'availability' | 'history'>('details');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [guides, setGuides] = useState<Guide[]>([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      address: 'İstanbul, Türkiye',
      status: 'approved',
      registrationDate: '2024-01-15',
      profileImage: 'https://ui-avatars.com/api/?name=Ahmet+Yılmaz',
      bio: '10 yıllık deneyimli tur rehberi',
      expertise: [
        { id: 1, name: 'Kültür Turizmi', level: 'expert' },
        { id: 2, name: 'Doğa Turizmi', level: 'intermediate' }
      ],
      languages: [
        { id: 1, name: 'Türkçe', level: 'native' },
        { id: 2, name: 'İngilizce', level: 'fluent' },
        { id: 3, name: 'Almanca', level: 'intermediate' }
      ],
      tours: [
        {
          id: 1,
          name: 'Kapadokya Turu',
          location: 'Nevşehir',
          startDate: '2024-04-01',
          endDate: '2024-04-03',
          status: 'upcoming',
          rating: 4.8
        }
      ],
      agencies: [
        {
          id: 1,
          name: 'Anadolu Turizm',
          status: 'active',
          startDate: '2024-01-01'
        }
      ],
      documents: [
        {
          id: 1,
          name: 'Rehberlik Sertifikası',
          type: 'pdf',
          url: '#',
          uploadDate: '2024-01-15',
          status: 'approved'
        }
      ],
      certifications: [
        {
          id: 1,
          name: 'Profesyonel Tur Rehberliği',
          issuer: 'TÜRSAB',
          date: '2020-01-01',
          status: 'active'
        }
      ],
      availability: [
        {
          id: 1,
          startDate: '2024-04-01',
          endDate: '2024-04-30',
          status: 'available'
        }
      ]
    }
  ]);

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

  const handleStatusChange = (guideId: number, newStatus: Guide['status']) => {
    const guide = guides.find(g => g.id === guideId);
    if (!guide) return;

    const now = new Date();
    const historyEntry = {
      id: Date.now(),
      action: newStatus === 'approved' ? 'approve' : 
              newStatus === 'rejected' ? 'reject' : 
              newStatus === 'suspended' ? 'suspend' : 'activate',
      adminName: 'Admin Kullanıcı',
      adminEmail: 'admin@example.com',
      timestamp: now.toISOString(),
      previousStatus: guide.status,
      newStatus: newStatus,
      details: `${guide.name} rehberinin durumu ${getStatusText(guide.status)}'den ${getStatusText(newStatus)}'e değiştirildi.`
    };

    setGuides(guides.map(guide => 
      guide.id === guideId 
        ? { 
            ...guide, 
            status: newStatus,
            history: [...(guide.history || []), historyEntry]
          }
        : guide
    ));
  };

  const handleDeleteGuide = (guideId: number) => {
    const guide = guides.find(g => g.id === guideId);
    if (!guide) return;

    if (window.confirm('Bu rehberi silmek istediğinizden emin misiniz?')) {
      const now = new Date();
      const historyEntry = {
        id: Date.now(),
        action: 'delete',
        adminName: 'Admin Kullanıcı',
        adminEmail: 'admin@example.com',
        timestamp: now.toISOString(),
        details: `${guide.name} rehberi silindi.`
      };

      setGuides(guides.map(g => 
        g.id === guideId 
          ? { ...g, history: [...(g.history || []), historyEntry] }
          : g
      ).filter(g => g.id !== guideId));
    }
  };

  const getActionColor = (action: Guide['history'][0]['action']) => {
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

  const getActionText = (action: Guide['history'][0]['action']) => {
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
    <div className="space-y-6">
      {/* Başlık ve İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Rehber</p>
              <p className="text-2xl font-semibold text-gray-900">85</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Onaylı Rehber</p>
              <p className="text-2xl font-semibold text-gray-900">72</p>
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
              <StarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ortalama Değerlendirme</p>
              <p className="text-2xl font-semibold text-gray-900">4.5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Başlık ve İşlemler */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tur Rehberleri</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <ArrowDownTrayIcon className="h-5 w-5" />
            Dışa Aktar
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Yeni Rehber Ekle
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
                placeholder="Rehber adı, e-posta veya telefon ile ara..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Uzmanlık Alanı</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="all">Tümü</option>
                <option value="culture">Kültür Turizmi</option>
                <option value="nature">Doğa Turizmi</option>
                <option value="adventure">Macera Turizmi</option>
                <option value="religious">Dini Turizm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dil</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              >
                <option value="all">Tümü</option>
                <option value="english">İngilizce</option>
                <option value="german">Almanca</option>
                <option value="french">Fransızca</option>
                <option value="spanish">İspanyolca</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Rehber Listesi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rehber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uzmanlık
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acenteler
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={guide.profileImage}
                          alt={guide.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{guide.name}</div>
                        <div className="text-sm text-gray-500">{guide.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(guide.status)}`}>
                      {getStatusText(guide.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {guide.expertise.map((exp) => (
                        <span
                          key={exp.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {exp.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {guide.languages.map((lang) => (
                        <span
                          key={lang.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          {lang.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guide.tours.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guide.agencies.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => setSelectedGuide(guide)}
                        title="Detayları Görüntüle"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => {
                          setEditingGuide(guide);
                          setShowEditModal(true);
                        }}
                        title="Düzenle"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      {guide.status === 'pending' && (
                        <>
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleStatusChange(guide.id, 'approved')}
                            title="Onayla"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleStatusChange(guide.id, 'rejected')}
                            title="Reddet"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {guide.status === 'approved' && (
                        <button
                          className="text-yellow-600 hover:text-yellow-900"
                          onClick={() => handleStatusChange(guide.id, 'suspended')}
                          title="Askıya Al"
                        >
                          <ExclamationCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      {guide.status === 'suspended' && (
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleStatusChange(guide.id, 'approved')}
                          title="Aktifleştir"
                        >
                          <ArrowPathIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteGuide(guide.id)}
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

      {/* Rehber Detay Modalı */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <img
                    src={selectedGuide.profileImage}
                    alt={selectedGuide.name}
                    className="h-16 w-16 rounded-full"
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">{selectedGuide.name}</h2>
                    <p className="text-gray-500">{selectedGuide.email}</p>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedGuide(null)}
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
                      selectedTab === 'agencies'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTab('agencies')}
                  >
                    Acenteler
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
                      selectedTab === 'certifications'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTab('certifications')}
                  >
                    Sertifikalar
                  </button>
                  <button
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'availability'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTab('availability')}
                  >
                    Müsaitlik
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
                          <span className="ml-3 text-sm text-gray-900">{selectedGuide.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                          <span className="ml-3 text-sm text-gray-900">{selectedGuide.email}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="h-5 w-5 text-gray-400" />
                          <span className="ml-3 text-sm text-gray-900">{selectedGuide.address}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Uzmanlık Alanları</h3>
                      <div className="space-y-2">
                        {selectedGuide.expertise.map((exp) => (
                          <div key={exp.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm font-medium text-gray-900">{exp.name}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              exp.level === 'expert' ? 'bg-green-100 text-green-800' :
                              exp.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {exp.level === 'expert' ? 'Uzman' :
                               exp.level === 'intermediate' ? 'Orta' : 'Başlangıç'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Diller</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedGuide.languages.map((lang) => (
                        <div key={lang.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">{lang.name}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lang.level === 'native' ? 'bg-purple-100 text-purple-800' :
                            lang.level === 'fluent' ? 'bg-green-100 text-green-800' :
                            lang.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {lang.level === 'native' ? 'Anadil' :
                             lang.level === 'fluent' ? 'Akıcı' :
                             lang.level === 'intermediate' ? 'Orta' : 'Temel'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedGuide.bio && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Hakkında</h3>
                      <p className="text-sm text-gray-600">{selectedGuide.bio}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedTab === 'tours' && (
                <div className="space-y-4">
                  {selectedGuide.tours.map((tour) => (
                    <div key={tour.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{tour.name}</p>
                            <p className="text-xs text-gray-500">{tour.location}</p>
                          </div>
                          <div className="flex items-center">
                            {tour.rating && (
                              <>
                                <StarIcon className="h-4 w-4 text-yellow-400" />
                                <span className="ml-1 text-sm text-gray-600">{tour.rating}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-500">{tour.startDate}</span>
                            <span className="text-gray-500">-</span>
                            <span className="text-gray-500">{tour.endDate}</span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tour.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                            tour.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {tour.status === 'upcoming' ? 'Yaklaşan' :
                             tour.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'agencies' && (
                <div className="space-y-4">
                  {selectedGuide.agencies.map((agency) => (
                    <div key={agency.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{agency.name}</p>
                            <p className="text-xs text-gray-500">
                              Başlangıç: {agency.startDate}
                              {agency.endDate && ` - Bitiş: ${agency.endDate}`}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            agency.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {agency.status === 'active' ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'documents' && (
                <div className="space-y-4">
                  {selectedGuide.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">Yüklenme: {doc.uploadDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status === 'approved' ? 'Onaylı' :
                           doc.status === 'pending' ? 'Beklemede' : 'Reddedildi'}
                        </span>
                        <button className="text-blue-600 hover:text-blue-900">
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'certifications' && (
                <div className="space-y-4">
                  {selectedGuide.certifications.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                          <p className="text-xs text-gray-500">
                            {cert.issuer} - {cert.date}
                            {cert.expiryDate && ` (Geçerlilik: ${cert.expiryDate})`}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cert.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cert.status === 'active' ? 'Aktif' : 'Süresi Doldu'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'availability' && (
                <div className="space-y-4">
                  {selectedGuide.availability.map((avail) => (
                    <div key={avail.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {avail.startDate} - {avail.endDate}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        avail.status === 'available' ? 'bg-green-100 text-green-800' :
                        avail.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {avail.status === 'available' ? 'Müsait' :
                         avail.status === 'booked' ? 'Rezerve Edildi' : 'Müsait Değil'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'history' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">İşlem Geçmişi</h3>
                      <div className="flow-root">
                        <ul className="-mb-8">
                          {selectedGuide.history?.map((event, eventIdx) => (
                            <li key={event.id}>
                              <div className="relative pb-8">
                                {eventIdx !== selectedGuide.history!.length - 1 ? (
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
                                        <p>{new Date(event.timestamp).toLocaleString('tr-TR')}</p>
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

              {/* İşlem Butonları */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setSelectedGuide(null)}
                >
                  Kapat
                </button>
                {selectedGuide.status === 'pending' && (
                  <>
                    <button 
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      onClick={() => handleStatusChange(selectedGuide.id, 'approved')}
                    >
                      Onayla
                    </button>
                    <button 
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      onClick={() => handleStatusChange(selectedGuide.id, 'rejected')}
                    >
                      Reddet
                    </button>
                  </>
                )}
                {selectedGuide.status === 'approved' && (
                  <button 
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    onClick={() => handleStatusChange(selectedGuide.id, 'suspended')}
                  >
                    Askıya Al
                  </button>
                )}
                {selectedGuide.status === 'suspended' && (
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={() => handleStatusChange(selectedGuide.id, 'approved')}
                  >
                    Aktifleştir
                  </button>
                )}
                {selectedGuide.status === 'rejected' && (
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={() => handleStatusChange(selectedGuide.id, 'approved')}
                  >
                    Onayla
                  </button>
                )}
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => {
                    if (window.confirm('Bu rehberi silmek istediğinizden emin misiniz?')) {
                      handleDeleteGuide(selectedGuide.id);
                      setSelectedGuide(null);
                    }
                  }}
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideManagement; 