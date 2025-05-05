'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  BellIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'turist' | 'acente' | 'rehber';
  status: 'active' | 'inactive' | 'blocked';
  registrationDate: string;
  lastLogin: string;
  favoriteTours: number;
  reviews: number;
  avatar?: string;
}

interface Review {
  id: number;
  tourName: string;
  rating: number;
  comment: string;
  date: string;
}

interface FavoriteTour {
  id: number;
  name: string;
  location: string;
  image: string;
  addedDate: string;
}

interface UserActivity {
  id: number;
  type: 'login' | 'reservation' | 'review' | 'favorite';
  description: string;
  date: string;
  details?: string;
}

interface UserNotification {
  id: number;
  type: 'email' | 'sms' | 'push';
  title: string;
  enabled: boolean;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'details' | 'activity' | 'notifications' | 'permissions'>('details');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Örnek kullanıcı verileri
  const users: User[] = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      role: 'turist',
      status: 'active',
      registrationDate: '2024-01-15',
      lastLogin: '2024-03-20',
      favoriteTours: 5,
      reviews: 8,
      avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yılmaz'
    },
    {
      id: 2,
      name: 'Mehmet Demir',
      email: 'mehmet@example.com',
      role: 'acente',
      status: 'active',
      registrationDate: '2024-02-01',
      lastLogin: '2024-03-19',
      favoriteTours: 12,
      reviews: 15,
      avatar: 'https://ui-avatars.com/api/?name=Mehmet+Demir'
    },
    // Daha fazla örnek kullanıcı eklenebilir
  ];

  // Örnek yorum verileri
  const reviews: Review[] = [
    {
      id: 1,
      tourName: 'İstanbul Şehir Turu',
      rating: 5,
      comment: 'Harika bir deneyimdi, kesinlikle tavsiye ederim.',
      date: '2024-03-15'
    },
    // Daha fazla örnek yorum eklenebilir
  ];

  // Örnek favori tur verileri
  const favoriteTours: FavoriteTour[] = [
    {
      id: 1,
      name: 'Kapadokya Turu',
      location: 'Nevşehir',
      image: 'https://images.unsplash.com/photo-1570844065536-f5135048a6e3',
      addedDate: '2024-03-10'
    },
    // Daha fazla örnek favori tur eklenebilir
  ];

  // Örnek aktivite verileri
  const userActivities: UserActivity[] = [
    {
      id: 1,
      type: 'login',
      description: 'Sisteme giriş yapıldı',
      date: '2024-03-20 14:30',
      details: 'IP: 192.168.1.1'
    },
    {
      id: 2,
      type: 'reservation',
      description: 'Yeni rezervasyon yapıldı',
      date: '2024-03-19 10:15',
      details: 'İstanbul Şehir Turu'
    },
    // Daha fazla aktivite eklenebilir
  ];

  // Örnek bildirim tercihleri
  const notificationPreferences: UserNotification[] = [
    {
      id: 1,
      type: 'email',
      title: 'E-posta Bildirimleri',
      enabled: true
    },
    {
      id: 2,
      type: 'sms',
      title: 'SMS Bildirimleri',
      enabled: false
    },
    {
      id: 3,
      type: 'push',
      title: 'Push Bildirimleri',
      enabled: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Pasif';
      case 'blocked':
        return 'Bloklu';
      default:
        return status;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'turist':
        return 'Turist';
      case 'acente':
        return 'Acente';
      case 'rehber':
        return 'Rehber';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <UserCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
              <p className="text-2xl font-semibold text-gray-900">12,429</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif Kullanıcılar</p>
              <p className="text-2xl font-semibold text-gray-900">10,245</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bu Ay Katılan</p>
              <p className="text-2xl font-semibold text-gray-900">1,234</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ortalama Aktivite</p>
              <p className="text-2xl font-semibold text-gray-900">8.5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Başlık ve Toplu İşlemler */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            onClick={() => setShowBulkActions(!showBulkActions)}
          >
            <ArrowPathIcon className="h-5 w-5" />
            Toplu İşlemler
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <UserCircleIcon className="h-5 w-5" />
            Yeni Kullanıcı Ekle
          </button>
        </div>
      </div>

      {/* Toplu İşlem Menüsü */}
      {showBulkActions && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-1">
              <CheckCircleIcon className="h-4 w-4" />
              Aktifleştir
            </button>
            <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-1">
              <XCircleIcon className="h-4 w-4" />
              Askıya Al
            </button>
            <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-1">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Dışa Aktar
            </button>
          </div>
        </div>
      )}

      {/* Filtreler ve Arama */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="İsim, e-posta veya kayıt tarihi ile ara..."
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Durumu</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="blocked">Bloklu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Tipi</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tümü</option>
                <option value="turist">Turist</option>
                <option value="acente">Acente</option>
                <option value="rehber">Rehber</option>
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
          </div>
        )}
      </div>

      {/* Kullanıcı Listesi */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Son Giriş
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Favoriler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yorumlar
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.registrationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.favoriteTours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.reviews}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => setSelectedUser(user)}
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
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

      {/* Kullanıcı Detay Modalı */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="h-16 w-16 rounded-full"
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                    <p className="text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedUser(null)}
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Sekmeler */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
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
                      selectedTab === 'activity'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTab('activity')}
                  >
                    Aktivite Geçmişi
                  </button>
                  <button
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'notifications'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTab('notifications')}
                  >
                    Bildirim Tercihleri
                  </button>
                  <button
                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === 'permissions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTab('permissions')}
                  >
                    İzinler
                  </button>
                </nav>
              </div>

              {/* Sekme İçerikleri */}
              {selectedTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Favori Turlar */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Favori Turlar</h3>
                    <div className="space-y-4">
                      {favoriteTours.map((tour) => (
                        <div key={tour.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <img
                            src={tour.image}
                            alt={tour.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{tour.name}</p>
                            <p className="text-xs text-gray-500">{tour.location}</p>
                          </div>
                          <div className="ml-auto text-xs text-gray-500">
                            {tour.addedDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Yorumlar */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Yorumlar</h3>
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900">{review.tourName}</p>
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 text-yellow-400" />
                              <span className="ml-1 text-sm text-gray-600">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                          <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'activity' && (
                <div className="space-y-4">
                  {userActivities.map((activity) => (
                    <div key={activity.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          {activity.details && (
                            <p className="text-sm text-gray-500 mt-1">{activity.details}</p>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{activity.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'notifications' && (
                <div className="space-y-4">
                  {notificationPreferences.map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <BellIcon className="h-5 w-5 text-gray-400" />
                        <span className="ml-3 text-sm font-medium text-gray-900">{notification.title}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notification.enabled}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'permissions' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Sistem İzinleri</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">Rezervasyon yapabilir</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">Yorum yapabilir</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <span className="ml-2 text-sm text-gray-700">Favori ekleyebilir</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* İşlem Butonları */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setSelectedUser(null)}
                >
                  Kapat
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Hesabı Askıya Al
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 