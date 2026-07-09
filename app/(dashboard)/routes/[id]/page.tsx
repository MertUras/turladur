import React, { Suspense, use } from 'react';
import RouteDetailClient from './RouteDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RouteDetailPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>}>
      <RouteDetailClient routeId={id} />
    </Suspense>
  );
}
