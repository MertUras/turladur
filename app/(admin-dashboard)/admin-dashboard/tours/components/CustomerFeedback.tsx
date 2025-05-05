'use client';

import { useState } from 'react';
import {
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface Review {
  id: string;
  customerName: string;
  tourName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface CustomerFeedbackProps {
  reviews?: Review[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Ahmet Yılmaz',
    tourName: 'Kapadokya Balon Turu',
    rating: 5,
    comment: 'Harika bir deneyimdi! Kesinlikle tekrar geleceğim.',
    date: '2024-03-15',
    status: 'pending'
  },
  {
    id: '2',
    customerName: 'Ayşe Demir',
    tourName: 'Ege Turu',
    rating: 4,
    comment: 'Güzel bir tur oldu, rehberimiz çok bilgiliydi.',
    date: '2024-03-14',
    status: 'approved'
  },
  {
    id: '3',
    customerName: 'Mehmet Kaya',
    tourName: 'Doğu Anadolu Turu',
    rating: 3,
    comment: 'Tur güzel ama konaklama biraz kötüydü.',
    date: '2024-03-13',
    status: 'rejected'
  }
];

export default function CustomerFeedback({
  reviews = mockReviews,
  onApprove = (id) => console.log('Onaylandı:', id),
  onReject = (id) => console.log('Reddedildi:', id),
  onDelete = (id) => console.log('Silindi:', id)
}: CustomerFeedbackProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'all') return true;
    return review.status === filter;
  });

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: Review['status']) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'approved':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Müşteri Geri Bildirimleri</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Bekleyenler
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Onaylananlar
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Reddedilenler
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredReviews.map((review) => (
          <div key={review.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {review.customerName}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(review.status)}`}>
                      {getStatusText(review.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{review.tourName}</p>
                  <div className="mt-1 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {review.status === 'pending' && (
                  <>
                    <button
                      onClick={() => onApprove(review.id)}
                      className="p-1 text-green-600 hover:text-green-700"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onReject(review.id)}
                      className="p-1 text-red-600 hover:text-red-700"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => onDelete(review.id)}
                  className="p-1 text-gray-400 hover:text-gray-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 