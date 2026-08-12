import type { Metadata } from 'next';
import { Suspense } from 'react';

import RouteDetailClient from '@/components/features/route/route-detail-client';
import { buildRoutePageMetadata } from '@/lib/route-page-overlay';
import { getRoutePageOverlay } from '@/services/content';
import { getRouteById } from '@/services/route';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const [data, overlay] = await Promise.all([
      getRouteById(id),
      getRoutePageOverlay(id).catch(() => null),
    ]);
    const meta = buildRoutePageMetadata(data.route, overlay);
    return {
      title: meta.title,
      description: meta.description,
    };
  } catch {
    return { title: 'Rota | turta' };
  }
}

export default async function RouteDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Yükleniyor...
        </div>
      }
    >
      <RouteDetailClient routeId={id} />
    </Suspense>
  );
}
