import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = { params: Promise<{ id: string }> };

// Yaş aralıklarını getir
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  const { id } = await params;

  try {
    // Önce aktivite tarihinin aktif olup olmadığını kontrol et
    const activityDate = await prisma.activityDate.findUnique({
      where: {
        id
      },
      select: {
        // isActive ve status alanları ActivityDate modelinde yok, bu yüzden kaldırıldı.
        // Gerekirse schema.prisma'ya eklenebilir.
        // isActive: true,
        // status: true,
        startDate: true,
        ageRanges: {
          orderBy: {
            minAge: 'asc'
          }
        }
      }
    });

    if (!activityDate) {
      return NextResponse.json(
        { error: 'Aktivite tarihi bulunamadı' },
        { status: 404 }
      );
    }

    // Tarih kontrolü
    if (new Date(activityDate.startDate) < new Date()) {
      return NextResponse.json(
        { error: 'Bu aktivite tarihi artık aktif değil' },
        { status: 400 }
      );
    }

    return NextResponse.json(activityDate.ageRanges);
  } catch (error) {
    console.error('Yaş aralıkları getirilemedi:', { activityDateId: id, error });
    return NextResponse.json(
      { error: 'Yaş aralıkları getirilemedi' },
      { status: 500 }
    );
  }
} 