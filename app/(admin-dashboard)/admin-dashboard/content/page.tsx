'use client';

import { useState } from 'react';
import {
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  NewspaperIcon,
  PhotoIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface Content {
  id: string;
  type: 'blog' | 'help' | 'faq' | 'slider';
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
  order?: number;
}

export default function ContentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // Örnek veri
  const contents: Content[] = [
    {
      id: '1',
      type: 'blog',
      title: 'Kapadokya\'da Balon Turu Rehberi',
      content: 'Kapadokya\'da balon turu yapmak isteyenler için detaylı rehber...',
      status: 'published',
      author: 'Ahmet Yılmaz',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
      imageUrl: '/images/blog/balloon-tour.jpg',
      category: 'Seyahat Rehberi',
      tags: ['Kapadokya', 'Balon Turu', 'Doğa'],
    },
    {
      id: '2',
      type: 'help',
      title: 'Rezervasyon İptal ve İade Politikası',
      content: 'Rezervasyon iptal ve iade koşulları hakkında detaylı bilgi...',
      status: 'published',
      author: 'Sistem Yöneticisi',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-12',
      category: 'Rezervasyon',
    },
    {
      id: '3',
      type: 'faq',
      title: 'Sıkça Sorulan Sorular',
      content: 'Platform kullanımı hakkında sıkça sorulan sorular ve cevapları...',
      status: 'published',
      author: 'Sistem Yöneticisi',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-05',
      category: 'Genel',
    },
    {
      id: '4',
      type: 'slider',
      title: 'Yaz Sezonu Özel Turlar',
      content: 'Yaz sezonuna özel hazırlanan turlarımızı keşfedin...',
      status: 'published',
      author: 'Marketing Team',
      createdAt: '2024-03-18',
      updatedAt: '2024-03-18',
      imageUrl: '/images/slider/summer-tours.jpg',
      order: 1,
    },
  ];

  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || content.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blog':
        return <NewspaperIcon className="h-5 w-5" />;
      case 'help':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'faq':
        return <QuestionMarkCircleIcon className="h-5 w-5" />;
      case 'slider':
        return <PhotoIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Başlık ve Üst Bölüm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">İçerik Yönetimi</h1>
            <p className="text-gray-500 mt-1">Blog, yardım, SSS ve slider içeriklerinin yönetimi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Yeni İçerik
            </button>
          </div>
        </div>

        {/* Filtreler */}
        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="İçerik ara..."
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
              <option value="blog">Blog</option>
              <option value="help">Yardım</option>
              <option value="faq">SSS</option>
              <option value="slider">Slider</option>
            </select>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
              <option value="archived">Arşivlenmiş</option>
            </select>
          </div>
        </div>

        {/* İçerik Listesi */}
        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yazar
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Son Güncelleme
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContents.map((content) => (
                  <tr
                    key={content.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedContent(content)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                          {getTypeIcon(content.type)}
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">
                            {content.type === 'blog' ? 'Blog' :
                             content.type === 'help' ? 'Yardım' :
                             content.type === 'faq' ? 'SSS' : 'Slider'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{content.title}</div>
                      {content.category && (
                        <div className="text-sm text-gray-500">{content.category}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {content.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(content.status)}`}>
                        {content.status === 'published' ? 'Yayında' :
                         content.status === 'draft' ? 'Taslak' : 'Arşivlenmiş'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(content.updatedAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Önizleme işlemi
                          }}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-yellow-600 hover:text-yellow-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Düzenleme işlemi
                          }}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Silme işlemi
                          }}
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

        {/* İçerik Detay Modalı */}
        {selectedContent && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">İçerik Detayları</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedContent(null)}
                >
                  <span className="sr-only">Kapat</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Başlık</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedContent.title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">İçerik</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedContent.content}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Yazar</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedContent.author}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Durum</h4>
                  <p className="mt-1">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedContent.status)}`}>
                      {selectedContent.status === 'published' ? 'Yayında' :
                       selectedContent.status === 'draft' ? 'Taslak' : 'Arşivlenmiş'}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Oluşturulma Tarihi</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedContent.createdAt).toLocaleDateString('tr-TR')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Son Güncelleme</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedContent.updatedAt).toLocaleDateString('tr-TR')}</p>
                </div>
                {selectedContent.category && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Kategori</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedContent.category}</p>
                  </div>
                )}
                {selectedContent.tags && selectedContent.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Etiketler</h4>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedContent.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedContent.imageUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Görsel</h4>
                    <img
                      src={selectedContent.imageUrl}
                      alt={selectedContent.title}
                      className="mt-1 h-32 w-auto object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setSelectedContent(null)}
                >
                  Kapat
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Düzenle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 