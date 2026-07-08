"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, UsersIcon, ClockIcon, PencilSquareIcon, TrashIcon, EyeIcon, PlusIcon, ArrowPathIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import ActivityDateModal from '@/app/components/partner-dashboard/ActivityDateModal';
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
    const res = await fetch(`/api/activity-dates?experienceId=${activityId}`);
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

  const handleDateSubmit = async (data: { startDate: string; endDate: string; availableSeats: number; price: number; }) => {
    if (!selectedActivity) return;

    const body = {
      ...data,
      experienceId: selectedActivity,
    };
    
    let url = '/api/activity-dates';
    let method = 'POST';

    if (selectedDate) {
      url = `${url}/${selectedDate.id}`;
      method = 'PUT';
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("Tarih kaydedilemedi");
        const errorData = await res.json();
        setError(errorData.error || 'Bir hata oluştu');
        return;
      }
      
      setError(null);
      setIsDateModalOpen(false);
      fetchActivityDates(selectedActivity);
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      setError('İstek gönderilirken bir hata oluştu.');
    }
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
                  {(() => {
                    let imgSrc = activity.gallery && Array.isArray(activity.gallery) ? activity.gallery[0] : activity.gallery;
                    if (Array.isArray(imgSrc)) imgSrc = imgSrc[0];
                    const safeSrc = imgSrc && typeof imgSrc === 'string' && imgSrc.trim() !== '' && (imgSrc.startsWith('/') || imgSrc.startsWith('http'))
                      ? imgSrc
                      : 'https://placehold.co/96x96/e5e7eb/6b7280?text=Yok';
                    return (
                      <Image
                        src={safeSrc}
                        alt={activity.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    );
                  })()}
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
                <button
                  onClick={() => router.push(`/partner-dashboard/experiences/${activity.id}/edit`)}
                  className="text-xs font-medium text-sky-600 hover:text-sky-800 bg-sky-100 px-3 py-1 rounded-md"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-100 px-3 py-1 rounded-md"
                >
                  Sil
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-700">AKTİVİTE TARİHLERİ</h3>
                <button onClick={() => handleToggleDates(activity.id)} className="p-2 text-gray-500 hover:text-gray-800">
                  {expandedActivity === activity.id ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                </button>
              </div>

              {expandedActivity === activity.id && (
                <div className="mt-4 border-t border-gray-200">
                  <div className="px-6 py-4 flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Aktivite Tarihleri</h4>
                    <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="px-6 pb-4 space-y-3">
                    {activityDates[activity.id]?.map((date, index) => (
                      <div
                        key={date.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          index === 0 // Örnek olarak ilk tarihi vurguluyoruz, bunu dinamik bir seçimle değiştirebilirsiniz
                            ? 'bg-sky-100 border-sky-500'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <CalendarIcon className={`h-5 w-5 mr-3 ${ index === 0 ? 'text-sky-700' : 'text-gray-400' }`} />
                          <div>
                            <p className={`text-sm font-medium ${ index === 0 ? 'text-sky-900' : 'text-gray-800' }`}>
                              {new Date(date.startDate).toLocaleDateString('tr-TR')} - {new Date(date.endDate).toLocaleDateString('tr-TR')}
                            </p>
                            <p className={`text-xs ${ index === 0 ? 'text-sky-700' : 'text-gray-500' }`}>
                              {date.availableSeats} kişilik kontenjan
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleEditDate(activity.id, date)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                            <PencilSquareIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteDate(activity.id, date.id)} className="p-1.5 rounded-md hover:bg-red-100 text-gray-400 hover:text-red-600">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddDate(activity.id)}
                      className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-sky-500 hover:text-sky-600"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Yeni Tarih Ekle
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {isDateModalOpen && selectedActivity && (
        <ActivityDateModal
          isOpen={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
          onSubmit={handleDateSubmit}
          initialData={selectedDate}
          title={selectedDate ? "Tarihi Düzenle" : "Yeni Tarih Ekle"}
        />
      )}
    </div>
  );
} 