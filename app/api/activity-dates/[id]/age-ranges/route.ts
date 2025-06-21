import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Yaş aralıklarını getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Önce aktivite tarihinin aktif olup olmadığını kontrol et
    const activityDate = await prisma.activityDate.findUnique({
      where: {
        id: params.id
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
    console.error('Yaş aralıkları getirilemedi:', error);
    return NextResponse.json(
      { error: 'Yaş aralıkları getirilemedi' },
      { status: 500 }
    );
  }
} 