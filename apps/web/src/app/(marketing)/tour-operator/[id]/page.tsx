import type { Metadata } from 'next';

import { TourOperatorPublicClient } from '@/components/features/tour-operator/tour-operator-public-client';

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: 'Tur Operatörü | turta',
    description: `Tur operatörü ${id} — yayınlanmış turlar`,
  };
}

export default async function TourOperatorDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <TourOperatorPublicClient agencyId={id} />;
}
