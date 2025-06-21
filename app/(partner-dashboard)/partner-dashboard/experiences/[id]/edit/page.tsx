"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ExperienceForm, { ExperienceFormData } from '@/app/components/partner-dashboard/ExperienceForm';
import Link from 'next/link';

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [initialData, setInitialData] = useState<Partial<ExperienceFormData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchExperience = async () => {
        try {
          const res = await fetch(`/api/experiences/${id}`);
          if (!res.ok) throw new Error("Aktivite verileri yüklenemedi");
          const data = await res.json();
          setInitialData({
            ...data,
            name: data.title, // API'den 'title' olarak gelir, forma 'name' olarak verilir
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Bir hata oluştu");
        }
      };
      fetchExperience();
    }
  }, [id]);

  const handleSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Aktivite güncellenemedi");
      }
      
      router.push("/partner-dashboard/experiences");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialData && !error) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Aktiviteyi Düzenle</h1>
          <p className="text-gray-600">Aktivite bilgilerinizi güncelleyin</p>
        </div>
        <Link href="/partner-dashboard/experiences" className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          İptal
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-8">
              {initialData && <ExperienceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={initialData} />}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="overflow-hidden rounded-lg bg-blue-50 shadow">
              <div className="p-6">
                <h2 className="text-lg font-medium text-blue-900">Bilgilendirme</h2>
                <div className="mt-2 text-sm text-blue-700">
                  Aktivite bilgilerinizi eksiksiz ve dikkatli doldurun. Müşterilerinizin ilgisini çekecek açıklamalar ve görseller ekleyin.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 