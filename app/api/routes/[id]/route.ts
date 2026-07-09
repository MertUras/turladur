import { NextResponse } from 'next/server';
import { getRouteDetail, type RouteFilters } from '@/lib/routes';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const filters: RouteFilters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      duration: searchParams.get('duration') || undefined,
      season: searchParams.get('season') || undefined,
    };

    const data = await getRouteDetail(id, filters);
    if (!data) {
      return NextResponse.json({ error: 'Rota bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching route detail:', error);
    return NextResponse.json(
      { error: 'Rota detayı getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
