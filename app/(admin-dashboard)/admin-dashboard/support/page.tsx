'use client';

import { useState } from 'react';
import {
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface SupportTicket {
  id: string;
  type: 'complaint' | 'reservation' | 'report' | 'general';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    type: 'customer' | 'agency' | 'guide';
  };
  assignedTo?: string;
  messages: {
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    isInternal: boolean;
  }[];
}

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Örnek veri
  const tickets: SupportTicket[] = [
    {
      id: '1',
      type: 'complaint',
      subject: 'Rezervasyon iptal edildi ama ödeme iadesi yapılmadı',
      description: 'Kapadokya turu rezervasyonumuz iptal edildi ancak ödeme iadesi hala yapılmadı.',
      status: 'open',
      priority: 'high',
      createdAt: '2024-03-18T10:30:00',
      updatedAt: '2024-03-18T10:30:00',
      user: {
        id: '1',
        name: 'Mehmet Demir',
        email: 'mehmet@example.com',
        type: 'customer',
      },
      messages: [
        {
          id: '1',
          sender: 'Mehmet Demir',
          content: 'Rezervasyon iptal edildi ama ödeme iadesi yapılmadı.',
          timestamp: '2024-03-18T10:30:00',
          isInternal: false,
        },
      ],
    },
    {
      id: '2',
      type: 'reservation',
      subject: 'Rezervasyon tarihi değişikliği talebi',
      description: 'İstanbul turu rezervasyonumuzun tarihini değiştirmek istiyoruz.',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2024-03-17T15:45:00',
      updatedAt: '2024-03-18T09:20:00',
      user: {
        id: '2',
        name: 'Ayşe Yılmaz',
        email: 'ayse@example.com',
        type: 'customer',
      },
      assignedTo: 'Destek Ekibi',
      messages: [
        {
          id: '1',
          sender: 'Ayşe Yılmaz',
          content: 'İstanbul turu rezervasyonumuzun tarihini değiştirmek istiyoruz.',
          timestamp: '2024-03-17T15:45:00',
          isInternal: false,
        },
        {
          id: '2',
          sender: 'Destek Ekibi',
          content: 'Rezervasyon değişikliği için gerekli bilgileri aldım, en kısa sürede dönüş yapacağım.',
          timestamp: '2024-03-18T09:20:00',
          isInternal: true,
        },
      ],
    },
    {
      id: '3',
      type: 'report',
      subject: 'Rehber hakkında şikayet',
      description: 'Antalya turunda rehberimiz yeterince bilgilendirme yapmadı.',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-03-16T14:20:00',
      updatedAt: '2024-03-17T11:15:00',
      user: {
        id: '3',
        name: 'Anadolu Turizm A.Ş.',
        email: 'info@anadoluturizm.com',
        type: 'agency',
      },
      assignedTo: 'Kalite Ekibi',
      messages: [
        {
          id: '1',
          sender: 'Anadolu Turizm A.Ş.',
          content: 'Antalya turunda rehberimiz yeterince bilgilendirme yapmadı.',
          timestamp: '2024-03-16T14:20:00',
          isInternal: false,
        },
        {
          id: '2',
          sender: 'Kalite Ekibi',
          content: 'Şikayetiniz incelendi ve gerekli önlemler alındı.',
          timestamp: '2024-03-17T11:15:00',
          isInternal: true,
        },
      ],
    },
  ];

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || ticket.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'reservation':
        return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
      case 'report':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'general':
        return <EnvelopeIcon className="h-5 w-5" />;
      default:
        return <EnvelopeIcon className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'customer':
        return <UserIcon className="h-5 w-5" />;
      case 'agency':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'guide':
        return <UserGroupIcon className="h-5 w-5" />;
      default:
        return <UserIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Üst Bölüm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Şikayet & Destek Talepleri</h1>
            <p className="text-gray-500 mt-1">Kullanıcı şikayetleri ve destek taleplerinin yönetimi</p>
          </div>
        </div>

        {/* Filtreler */}
        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Talep ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tüm Tipler</option>
              <option value="complaint">Şikayet</option>
              <option value="reservation">Rezervasyon</option>
              <option value="report">Rapor</option>
              <option value="general">Genel</option>
            </select>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="open">Açık</option>
              <option value="in_progress">İşlemde</option>
              <option value="resolved">Çözüldü</option>
              <option value="closed">Kapalı</option>
            </select>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Tüm Öncelikler</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
          </div>
        </div>

        {/* Talepler Listesi */}
        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Konu
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öncelik
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Son Güncelleme
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          {getTypeIcon(ticket.type)}
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.type === 'complaint' ? 'Şikayet' :
                             ticket.type === 'reservation' ? 'Rezervasyon' :
                             ticket.type === 'report' ? 'Rapor' : 'Genel'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{ticket.subject}</div>
                      <div className="text-sm text-gray-500">{ticket.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          {getUserTypeIcon(ticket.user.type)}
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{ticket.user.name}</div>
                          <div className="text-sm text-gray-500">{ticket.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status === 'open' ? 'Açık' :
                         ticket.status === 'in_progress' ? 'İşlemde' :
                         ticket.status === 'resolved' ? 'Çözüldü' : 'Kapalı'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority === 'high' ? 'Yüksek' :
                         ticket.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.updatedAt).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Talep Detay Modalı */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Talep Detayları</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedTicket(null)}
                >
                  <span className="sr-only">Kapat</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Konu</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedTicket.subject}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Açıklama</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedTicket.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Kullanıcı</h4>
                  <div className="mt-1 flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      {getUserTypeIcon(selectedTicket.user.type)}
                    </div>
                    <div className="ml-2">
                      <div className="text-sm font-medium text-gray-900">{selectedTicket.user.name}</div>
                      <div className="text-sm text-gray-500">{selectedTicket.user.email}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Durum</h4>
                  <p className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status === 'open' ? 'Açık' :
                       selectedTicket.status === 'in_progress' ? 'İşlemde' :
                       selectedTicket.status === 'resolved' ? 'Çözüldü' : 'Kapalı'}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Öncelik</h4>
                  <p className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority === 'high' ? 'Yüksek' :
                       selectedTicket.priority === 'medium' ? 'Orta' : 'Düşük'}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Oluşturulma Tarihi</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedTicket.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Son Güncelleme</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedTicket.updatedAt).toLocaleDateString('tr-TR')}</p>
                </div>
                {selectedTicket.assignedTo && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Atanan Kişi</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedTicket.assignedTo}</p>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Mesajlar</h4>
                  <div className="mt-2 space-y-4">
                    {selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                          message.isInternal ? 'bg-gray-50' : 'bg-indigo-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{message.sender}</span>
                            {message.isInternal && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-800 rounded-full">
                                İç Not
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(message.timestamp).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-900">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Yeni Mesaj</h4>
                  <div className="mt-1">
                    <textarea
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Mesajınızı yazın..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setSelectedTicket(null)}
                >
                  Kapat
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Mesaj Gönder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 