import { useState } from 'react';
import Image from 'next/image';
import { CalendarIcon, FlagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export interface ReviewCardProps {
  id: string;
  customerName: string;
  customerImage?: string;
  tourName: string;
  tourId: string;
  rating: number;
  reviewDate: string;
  reviewText: string;
  isResponded: boolean;
  responseText?: string;
}

export default function ReviewCard({
  id,
  customerName,
  customerImage,
  tourName,
  tourId,
  rating,
  reviewDate,
  reviewText,
  isResponded,
  responseText
}: ReviewCardProps) {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [response, setResponse] = useState(responseText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localIsResponded, setLocalIsResponded] = useState(isResponded);

  const initials = customerName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Demo amaçlı simüle edilmiş yanıt gönderme
    setTimeout(() => {
      setIsSubmitting(false);
      setLocalIsResponded(true);
      setShowResponseForm(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {customerImage ? (
                <div className="h-10 w-10 rounded-full overflow-hidden relative">
                  <Image
                    src={customerImage}
                    alt={customerName}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                  {initials}
                </div>
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-base font-semibold text-gray-900">{customerName}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                <span>{reviewDate}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-3">
          <a 
            href={`/partner-dashboard/tours/${tourId}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {tourName}
          </a>
          <p className="mt-2 text-sm text-gray-700">{reviewText}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          {localIsResponded ? (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1.5" />
                <span className="text-sm font-medium text-gray-900">Yanıtınız:</span>
              </div>
              <p className="text-sm text-gray-700">{response}</p>
            </div>
          ) : showResponseForm ? (
            <form onSubmit={handleSubmitResponse}>
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                rows={3}
                placeholder="Değerlendirmeye yanıt verin..."
                required
              />
              <div className="mt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setShowResponseForm(false)}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Yanıtla'}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between">
              <button
                onClick={() => setShowResponseForm(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Yanıtla
              </button>
              <button
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <FlagIcon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 