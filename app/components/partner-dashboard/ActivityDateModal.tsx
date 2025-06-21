import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DatePicker } from '../../components/booking/DatePicker';

interface ActivityDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    startDate: string;
    endDate: string;
    availableSeats: number;
    price: number;
  }) => void;
  initialData?: {
    startDate?: string;
    endDate?: string;
    availableSeats?: number;
    price?: number;
  };
  title: string;
}

export default function ActivityDateModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title
}: ActivityDateModalProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    availableSeats: 1,
    price: 0
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        availableSeats: initialData.availableSeats || 1,
        price: initialData.price || 0
      });
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({ startDate: '', endDate: '', availableSeats: 1, price: 0 });
    }
  }, [isOpen, initialData]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full rounded-lg bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {title}
            </Dialog.Title>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <DatePicker
                label="Başlangıç Tarihi"
                value={formData.startDate}
                onChange={(date) => setFormData({ ...formData, startDate: date })}
                placeholder="gg.aa.yyyy"
              />
            </div>

            <div>
              <DatePicker
                label="Bitiş Tarihi"
                value={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date })}
                placeholder="gg.aa.yyyy"
                minDate={formData.startDate}
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fiyat
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value)
                  })
                }
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label
                htmlFor="availableSeats"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Kontenjan
              </label>
              <input
                type="number"
                id="availableSeats"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availableSeats: parseInt(e.target.value)
                  })
                }
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                min="1"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Kaydet
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 