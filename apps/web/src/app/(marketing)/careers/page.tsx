import type { Metadata } from 'next';

import { CareersPageContent } from '@/components/features/careers/careers-page';

export const metadata: Metadata = {
  title: 'Kariyer | turta - Turizm Teknolojilerinde Lider Ekibe Katılın',
  description:
    'turta ile kariyerinize yön verin. Turizm teknolojileri alanında yenilikçi projeler geliştiren ekibimizde açık pozisyonları, avantajları ve başvuru sürecini keşfedin.',
};

export default function CareersPage() {
  return <CareersPageContent />;
}
