"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ExperienceForm, { ExperienceFormData } from '@/app/components/partner-dashboard/ExperienceForm';
import Link from 'next/link';

export default function CreateExperiencePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/partner/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Aktivite eklenemedi");
      router.push("/partner-dashboard/experiences");
    } catch (err) {
      // Hata gösterimi ExperienceForm içinde
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yeni Aktivite Ekle</h1>
          <p className="text-gray-600">Portföyünüze yeni bir aktivite ekleyin</p>
        </div>
        <Link href="/partner-dashboard/experiences" className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          İptal
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-8">
              <ExperienceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
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