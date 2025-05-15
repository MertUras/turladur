"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface Activity {
  id: string;
  name: string;
  description?: string;
  category?: string;
  duration: number;
  price: number;
  discount?: number;
  location?: string;
  city?: string;
  country?: string;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ExperiencesPage() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    fetchActivities();
  }, []);

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Aktivitelerim</h1>
        <Link href="/partner-dashboard/experiences/create" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700">Yeni Aktivite Ekle</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            <div className="relative h-40 w-full mb-4">
              <Image src={activity.images?.[0] || "/images/placeholder.jpg"} alt={activity.name} fill className="object-cover rounded-md" />
            </div>
            <h2 className="text-lg font-semibold mb-1">{activity.name}</h2>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{activity.description}</p>
            <div className="flex-1" />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sky-700 font-bold">{activity.price} ₺</span>
              <Link href={`/partner-dashboard/experiences/${activity.id}`} className="text-sky-600 hover:underline text-sm">Detay</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 