'use client';

import { useState } from 'react';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface BulkActionsProps {
  selectedTours: string[];
  onBulkPublish: () => void;
  onBulkDelete: () => void;
  onBulkExport: () => void;
  onBulkUpdate: () => void;
}

const BulkActions = ({
  selectedTours,
  onBulkPublish,
  onBulkDelete,
  onBulkExport,
  onBulkUpdate
}: BulkActionsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState<'publish' | 'delete' | 'export' | 'update' | null>(null);

  const handleAction = (type: 'publish' | 'delete' | 'export' | 'update') => {
    setActionType(type);
    setShowConfirm(true);
  };

  const confirmAction = () => {
    switch (actionType) {
      case 'publish':
        onBulkPublish();
        break;
      case 'delete':
        onBulkDelete();
        break;
      case 'export':
        onBulkExport();
        break;
      case 'update':
        onBulkUpdate();
        break;
    }
    setShowConfirm(false);
    setActionType(null);
  };

  if (selectedTours.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {selectedTours.length} tur seçildi
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction('publish')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Toplu Yayınla
          </button>
          <button
            onClick={() => handleAction('delete')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
          >
            <TrashIcon className="h-4 w-4" />
            Toplu Sil
          </button>
          <button
            onClick={() => handleAction('export')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Dışa Aktar
          </button>
          <button
            onClick={() => handleAction('update')}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Toplu Güncelle
          </button>
        </div>
      </div>

      {/* Onay Modalı */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {actionType === 'publish' && 'Turları Yayınla'}
              {actionType === 'delete' && 'Turları Sil'}
              {actionType === 'export' && 'Turları Dışa Aktar'}
              {actionType === 'update' && 'Turları Güncelle'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {actionType === 'publish' && 'Seçili turları yayınlamak istediğinizden emin misiniz?'}
              {actionType === 'delete' && 'Seçili turları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'}
              {actionType === 'export' && 'Seçili turları dışa aktarmak istediğinizden emin misiniz?'}
              {actionType === 'update' && 'Seçili turları güncellemek istediğinizden emin misiniz?'}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                  actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                  actionType === 'publish' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions; 