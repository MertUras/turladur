"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, UsersIcon, ClockIcon, PencilSquareIcon, TrashIcon, EyeIcon, PlusIcon, ArrowPathIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import ActivityDateModal from '@/app/components/partner-dashboard/ActivityDateModal';

interface Activity {
  id: string;
  title: string;
  description?: string;
  category?: string;
  duration: string;
  price: number;
  discount?: number;
  location?: string;
  city?: string;
  country?: string;
  gallery: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviewCount?: number;
}

export default function ExperiencesPage() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [activityDates, setActivityDates] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/partner/experiences");
      if (!res.ok) throw new Error("Aktiviteler yüklenemedi");
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu aktiviteyi silmek istediğinizden emin misiniz?")) return;
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Aktivite silinemedi");
      setActivities(activities.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  const filteredActivities = activities.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    (a.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const fetchActivityDates = async (activityId: string) => {
    const res = await fetch(`/api/partner/experiences/${activityId}/dates`);
    if (res.ok) {
      const data = await res.json();
      setActivityDates(prev => ({ ...prev, [activityId]: data }));
    }
  };

  const handleToggleDates = (activityId: string) => {
    if (expandedActivity === activityId) {
      setExpandedActivity(null);
    } else {
      setExpandedActivity(activityId);
      fetchActivityDates(activityId);
    }
  };

  const handleAddDate = (activityId: string) => {
    setSelectedActivity(activityId);
    setSelectedDate(null);
    setIsDateModalOpen(true);
  };

  const handleEditDate = (activityId: string, date: any) => {
    setSelectedActivity(activityId);
    setSelectedDate(date);
    setIsDateModalOpen(true);
  };

  const handleDeleteDate = async (activityId: string, dateId: string) => {
    if (!confirm('Bu tarihi silmek istediğinizden emin misiniz?')) return;
    await fetch(`/api/partner/experiences/${activityId}/dates/${dateId}`, { method: 'DELETE' });
    fetchActivityDates(activityId);
  };

  const handleDateSubmit = async (data: { startDate: string; endDate: string; price: number; availableSeats: number; }) => {
    if (!selectedActivity) return;
    if (selectedDate) {
      // Edit
      await fetch(`/api/partner/experiences/${selectedActivity}/dates/${selectedDate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      // Add
      await fetch(`/api/partner/experiences/${selectedActivity}/dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    setIsDateModalOpen(false);
    fetchActivityDates(selectedActivity);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hata</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchActivities}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" /> Tekrar Dene
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aktivitelerim</h1>
          <p className="text-gray-600">Tüm aktivitelerinizi buradan yönetebilirsiniz</p>
        </div>
        <Link
          href="/partner-dashboard/experiences/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Yeni Aktivite Ekle
        </Link>
      </div>
      <div className="mb-6 flex items-center justify-between bg-white rounded-lg shadow p-4">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Aktivite ara..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={fetchActivities}
          className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {filteredActivities.length === 0 ? (
          <div className="text-center text-gray-500 py-12">Hiç aktivite bulunamadı.</div>
        ) : filteredActivities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 flex items-start justify-between">
              <div className="flex-1 flex items-center space-x-4">
                <div className="flex-shrink-0 h-12 w-12 relative">
                  {activity.gallery && activity.gallery.length > 0 && activity.gallery[0] ? (
                    <Image
                      src={activity.gallery[0]}
                      alt={activity.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-lg font-medium">
                        {activity.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{activity.title}</h2>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    {activity.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {activity.location}
                      </div>
                    )}
                    {activity.duration && (
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {activity.duration}
                      </div>
                    )}
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {/* Katılımcı sayısı yoksa örnek: 10 kişi */}
                      {activity.reviewCount ? `${activity.reviewCount} kişi` : 'Katılımcı'}
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-sky-700">{activity.price} ₺</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/partner-dashboard/experiences/${activity.id}`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  <EyeIcon className="h-4 w-4 mr-1.5" />
                  İncele
                </Link>
                <Link
                  href={`/partner-dashboard/experiences/${activity.id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  <PencilSquareIcon className="h-4 w-4 mr-1.5" />
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="h-4 w-4 mr-1.5" />
                  Sil
                </button>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => handleToggleDates(activity.id)}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                {expandedActivity === activity.id ? (
                  <ChevronUpIcon className="h-5 w-5 mr-1" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 mr-1" />
                )}
                Aktivite Tarihleri ({activityDates[activity.id]?.length || 0})
              </button>
            </div>
            {expandedActivity === activity.id && (
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Aktivite Tarihleri</h3>
                  <button
                    onClick={() => handleAddDate(activity.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1.5" />
                    Yeni Tarih
                  </button>
                </div>
                {activityDates[activity.id] && activityDates[activity.id].length > 0 ? (
                  <div className="space-y-4">
                    {activityDates[activity.id].map((date: any) => (
                      <div key={date.id} className="flex items-center justify-between bg-white p-4 rounded-md border border-gray-200">
                        <div className="flex items-center space-x-4">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(date.startDate).toLocaleDateString('tr-TR')} - {new Date(date.endDate).toLocaleDateString('tr-TR')}
                            </p>
                            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                              <span>{date.availableSeats} kişilik kontenjan</span>
                              <span>{date.price} ₺</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditDate(activity.id, date)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                          >
                            <PencilSquareIcon className="h-4 w-4 mr-1" />
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDeleteDate(activity.id, date.id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Sil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">Henüz tarih eklenmemiş.</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <ActivityDateModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onSubmit={handleDateSubmit}
        initialData={selectedDate}
        title={selectedDate ? 'Tarihi Düzenle' : 'Yeni Tarih Ekle'}
      />
    </div>
  );
} 