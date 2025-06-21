import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TourDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    startDate: string;
    endDate: string;
    price: number;
    availableSeats: number;
    earlyBirdDiscount?: number;
    lastMinuteDiscount?: number;
    earlyBirdDeadlineStart?: string;
    earlyBirdDeadlineEnd?: string;
    lastMinuteStartStart?: string;
    lastMinuteStartEnd?: string;
    minParticipants?: number;
    maxParticipants?: number;
    notes?: string;
  }) => void;
  initialData?: {
    startDate?: string;
    endDate?: string;
    price?: number;
    availableSeats?: number;
    earlyBirdDiscount?: number;
    lastMinuteDiscount?: number;
    earlyBirdDeadlineStart?: string;
    earlyBirdDeadlineEnd?: string;
    lastMinuteStartStart?: string;
    lastMinuteStartEnd?: string;
    minParticipants?: number;
    maxParticipants?: number;
    notes?: string;
  };
  title: string;
  isEditMode?: boolean;
}

export default function TourDateModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  isEditMode = false
}: TourDateModalProps) {
  const [formData, setFormData] = useState({
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    price: initialData?.price || 0,
    availableSeats: initialData?.availableSeats || 0,
    earlyBirdDiscount: initialData?.earlyBirdDiscount || 0,
    lastMinuteDiscount: initialData?.lastMinuteDiscount || 0,
    earlyBirdDeadlineStart: initialData?.earlyBirdDeadlineStart || '',
    earlyBirdDeadlineEnd: initialData?.earlyBirdDeadlineEnd || '',
    lastMinuteStartStart: initialData?.lastMinuteStartStart || '',
    lastMinuteStartEnd: initialData?.lastMinuteStartEnd || '',
    minParticipants: initialData?.minParticipants || 0,
    maxParticipants: initialData?.maxParticipants || 0,
    notes: initialData?.notes || ''
  });

  useEffect(() => {
    console.log('=== MODAL DEBUG ===');
    console.log('initialData received:', initialData);
    console.log('isEditMode:', isEditMode);
    
    if (initialData) {
      const newFormData = {
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        price: initialData.price || 0,
        availableSeats: initialData.availableSeats || 0,
        earlyBirdDiscount: initialData.earlyBirdDiscount || 0,
        lastMinuteDiscount: initialData.lastMinuteDiscount || 0,
        earlyBirdDeadlineStart: initialData.earlyBirdDeadlineStart || '',
        earlyBirdDeadlineEnd: initialData.earlyBirdDeadlineEnd || '',
        lastMinuteStartStart: initialData.lastMinuteStartStart || '',
        lastMinuteStartEnd: initialData.lastMinuteStartEnd || '',
        minParticipants: initialData.minParticipants || 0,
        maxParticipants: initialData.maxParticipants || 0,
        notes: initialData.notes || ''
      };
      
      console.log('Setting form data to:', newFormData);
      setFormData(newFormData);
    } else {
      console.log('No initialData provided, keeping current form data');
    }
    console.log('===================');
  }, [initialData, isEditMode]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        startDate: '',
        endDate: '',
        price: 0,
        availableSeats: 0,
        earlyBirdDiscount: 0,
        lastMinuteDiscount: 0,
        earlyBirdDeadlineStart: '',
        earlyBirdDeadlineEnd: '',
        lastMinuteStartStart: '',
        lastMinuteStartEnd: '',
        minParticipants: 0,
        maxParticipants: 0,
        notes: ''
      });
    }
  }, [isOpen]);

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
        <Dialog.Panel className="mx-auto max-w-2xl w-full rounded-lg bg-white p-6 max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bitiş Tarihi
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Fiyat (₺)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500">₺</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white pl-8 pr-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
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

              <div>
                <label
                  htmlFor="minParticipants"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Minimum Katılımcı
                </label>
                <input
                  type="number"
                  id="minParticipants"
                  name="minParticipants"
                  value={formData.minParticipants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minParticipants: parseInt(e.target.value)
                    })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  min="0"
                />
              </div>

              <div>
                <label
                  htmlFor="maxParticipants"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Maksimum Katılımcı
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxParticipants: parseInt(e.target.value)
                    })
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  min="0"
                />
              </div>
            </div>

            {/* Erken Rezervasyon Bölümü */}
            <div className="border-t pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Erken Rezervasyon İndirimi</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="earlyBirdDiscount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    İndirim Oranı (%)
                  </label>
                  <input
                    type="number"
                    id="earlyBirdDiscount"
                    name="earlyBirdDiscount"
                    value={formData.earlyBirdDiscount}
                    onChange={(e) =>
                      setFormData({ ...formData, earlyBirdDiscount: parseFloat(e.target.value) })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="earlyBirdDeadlineStart"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    id="earlyBirdDeadlineStart"
                    name="earlyBirdDeadlineStart"
                    value={formData.earlyBirdDeadlineStart}
                    onChange={(e) =>
                      setFormData({ ...formData, earlyBirdDeadlineStart: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="earlyBirdDeadlineEnd"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    id="earlyBirdDeadlineEnd"
                    name="earlyBirdDeadlineEnd"
                    value={formData.earlyBirdDeadlineEnd}
                    onChange={(e) =>
                      setFormData({ ...formData, earlyBirdDeadlineEnd: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Son Dakika Bölümü */}
            <div className="border-t pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Son Dakika İndirimi</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="lastMinuteDiscount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    İndirim Oranı (%)
                  </label>
                  <input
                    type="number"
                    id="lastMinuteDiscount"
                    name="lastMinuteDiscount"
                    value={formData.lastMinuteDiscount}
                    onChange={(e) =>
                      setFormData({ ...formData, lastMinuteDiscount: parseFloat(e.target.value) })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastMinuteStartStart"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Başlangıç Tarihi
                  </label>
                  <input
                    type="date"
                    id="lastMinuteStartStart"
                    name="lastMinuteStartStart"
                    value={formData.lastMinuteStartStart}
                    onChange={(e) =>
                      setFormData({ ...formData, lastMinuteStartStart: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastMinuteStartEnd"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Bitiş Tarihi
                  </label>
                  <input
                    type="date"
                    id="lastMinuteStartEnd"
                    name="lastMinuteStartEnd"
                    value={formData.lastMinuteStartEnd}
                    onChange={(e) =>
                      setFormData({ ...formData, lastMinuteStartEnd: e.target.value })
                    }
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Notlar
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                placeholder="Tur tarihi hakkında notlar..."
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                İptal
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                {isEditMode ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 