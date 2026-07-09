import React, { Suspense } from 'react';
import { Metadata } from 'next';
import RoutesPageClient from './RoutesPageClient';

export const metadata: Metadata = {
  title: "Popüler Rotalar | Turladur - Türkiye'nin Lider Turizm Teknolojileri Şirketi",
  description:
    "Turladur ile Türkiye'nin en popüler turizm rotalarını keşfedin. Kapadokya, Likya Yolu, Pamukkale ve daha fazlası için tur seçeneklerini inceleyin.",
};

export default function RoutesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <RoutesPageClient />
    </Suspense>
  );
}
