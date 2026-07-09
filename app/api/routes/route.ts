import { NextResponse } from 'next/server';
import { getRoutesWithStats, type RouteFilters } from '@/lib/routes';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: RouteFilters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      duration: searchParams.get('duration') || undefined,
      season: searchParams.get('season') || undefined,
    };

    const data = await getRoutesWithStats(filters);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching routes:', error);
    return NextResponse.json(
      { error: 'Rotalar getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
