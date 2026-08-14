'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';

import {
  createPartnerSubUser,
  deletePartnerSubUser,
  getPartnerProfile,
  listPartnerSubUsers,
  updatePartnerSubUser,
} from '@/services/partner-admin';
import { useAuth } from '@/providers/auth-provider';

interface SubUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: {
    tours: boolean;
    reservations: boolean;
    customers: boolean;
    reports: boolean;
  };
}

type PermissionFlags = SubUser['permissions'];

function permissionsFromNest(permissions: unknown): PermissionFlags {
  const record = permissions as Record<string, string[] | undefined> | null;
  const enabled = (key: string) =>
    Array.isArray(record?.[key]) && record[key]!.length > 0;
  return {
    tours: enabled('tours'),
    reservations: enabled('reservations'),
    customers: enabled('customers'),
    reports: enabled('reports'),
  };
}

function permissionsToNest(flags: PermissionFlags): Record<string, string[]> {
  const entry = (on: boolean) => (on ? ['read', 'write'] : []);
  return {
    tours: entry(flags.tours),
    reservations: entry(flags.reservations),
    customers: entry(flags.customers),
    reports: entry(flags.reports),
  };
}

const emptyPermissions: PermissionFlags = {
  tours: false,
  reservations: false,
  customers: false,
  reports: false,
};

export default function UsersPage() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<SubUser[]>([]);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SubUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
    permissions: { ...emptyPermissions },
  });

  const fetchUsers = async () => {
    if (!accessToken) return;
    const [profile, list] = await Promise.all([
      getPartnerProfile(accessToken),
      listPartnerSubUsers(accessToken),
    ]);
    setPartnerId(profile.id);
    setUsers(
      list.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        permissions: permissionsFromNest(user.permissions),
      })),
    );
  };

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    void fetchUsers()
      .catch((err: Error) => console.error('Error fetching users:', err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'USER',
      permissions: { ...emptyPermissions },
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!accessToken || !partnerId) return;
    try {
      await createPartnerSubUser(
        partnerId,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          permissions: permissionsToNest(formData.permissions),
        },
        accessToken,
      );
      setShowAddModal(false);
      resetForm();
      await fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !accessToken || !partnerId) return;

    try {
      await updatePartnerSubUser(
        partnerId,
        selectedUser.id,
        {
          name: formData.name,
          role: formData.role,
          permissions: permissionsToNest(formData.permissions),
        },
        accessToken,
      );
      setShowEditModal(false);
      resetForm();
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;
    if (!accessToken || !partnerId) return;

    try {
      await deletePartnerSubUser(partnerId, userId, accessToken);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Kullanıcı Yönetimi
        </h1>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Yeni Kullanıcı
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {users.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            Henüz alt kullanıcı eklenmemiş
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                      </span>
                      <span className="text-sm text-gray-500">{user.role}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData({
                            name: user.name,
                            email: user.email,
                            password: '',
                            role: user.role,
                            permissions: user.permissions,
                          });
                          setShowEditModal(true);
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(user.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showAddModal ? (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-medium mb-4">Yeni Kullanıcı Ekle</h2>
            <form onSubmit={handleSubmit}>
              <PermissionFormFields
                formData={formData}
                setFormData={setFormData}
              />
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showEditModal && selectedUser ? (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-medium mb-4">Kullanıcı Düzenle</h2>
            <form onSubmit={handleEdit}>
              <PermissionFormFields
                formData={formData}
                setFormData={setFormData}
                isEdit
              />
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PermissionFormFields({
  formData,
  setFormData,
  isEdit = false,
}: {
  formData: {
    name: string;
    email: string;
    password: string;
    role: string;
    permissions: PermissionFlags;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      password: string;
      role: string;
      permissions: PermissionFlags;
    }>
  >;
  isEdit?: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ad Soyad
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          required
          readOnly={isEdit}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {isEdit ? 'Şifre (Boş bırakılırsa değişmez)' : 'Şifre'}
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          required={!isEdit}
          minLength={isEdit ? undefined : 8}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Rol</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
        >
          <option value="USER">Kullanıcı</option>
          <option value="MANAGER">Yönetici</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İzinler
        </label>
        <div className="space-y-2">
          {(
            [
              ['tours', 'Turlar'],
              ['reservations', 'Rezervasyonlar'],
              ['customers', 'Müşteriler'],
              ['reports', 'Raporlar'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.permissions[key]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    permissions: {
                      ...formData.permissions,
                      [key]: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
