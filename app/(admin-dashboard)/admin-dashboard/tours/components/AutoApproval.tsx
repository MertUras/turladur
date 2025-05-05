'use client';

import { useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface AutoApprovalRule {
  id: string;
  name: string;
  condition: string;
  action: 'approve' | 'reject' | 'flag';
  priority: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AutoApprovalProps {
  rules: AutoApprovalRule[];
  onAddRule: (rule: Omit<AutoApprovalRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateRule: (id: string, rule: Partial<AutoApprovalRule>) => void;
  onDeleteRule: (id: string) => void;
  onToggleRule: (id: string) => void;
}

const AutoApproval = ({
  rules,
  onAddRule,
  onUpdateRule,
  onDeleteRule,
  onToggleRule
}: AutoApprovalProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    condition: '',
    action: 'approve' as const,
    priority: 1,
    enabled: true
  });

  const handleAddRule = () => {
    onAddRule(newRule);
    setShowAddModal(false);
    setNewRule({
      name: '',
      condition: '',
      action: 'approve',
      priority: 1,
      enabled: true
    });
  };

  const getActionIcon = (action: AutoApprovalRule['action']) => {
    switch (action) {
      case 'approve':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'reject':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'flag':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Otomatik Onay Sistemi</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Yeni Kural Ekle
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {rules.map(rule => (
            <div
              key={rule.id}
              className="bg-gray-50 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {rule.name}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      Öncelik: {rule.priority}
                    </span>
                    {getActionIcon(rule.action)}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    {rule.condition}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Oluşturulma: {new Date(rule.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span>
                      Güncelleme: {new Date(rule.updatedAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`p-1 ${
                      rule.enabled
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <ShieldCheckIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1 text-gray-400 hover:text-gray-500"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Yeni Otomatik Onay Kuralı
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kural Adı
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Koşul
                </label>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Aksiyon
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value as AutoApprovalRule['action'] })}
                >
                  <option value="approve">Onayla</option>
                  <option value="reject">Reddet</option>
                  <option value="flag">İşaretle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Öncelik
                </label>
                <input
                  type="number"
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newRule.priority}
                  onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={newRule.enabled}
                  onChange={(e) => setNewRule({ ...newRule, enabled: e.target.checked })}
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Aktif
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                İptal
              </button>
              <button
                onClick={handleAddRule}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoApproval; 