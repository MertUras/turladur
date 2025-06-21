import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Yaş aralıklarını getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Önce experience tarihinin aktif olup olmadığını kontrol et
    const experienceDate = await prisma.experienceDate.findUnique({
      where: {
        id: params.id
      },
      select: {
        isActive: true,
        status: true,
        startDate: true,
        ageRanges: {
          orderBy: {
            minAge: 'asc'
          }
        }
      }
    });

    if (!experienceDate) {
      return NextResponse.json(
        { error: 'Aktivite tarihi bulunamadı' },
        { status: 404 }
      );
    }

    // Eğer aktivite tarihi aktif değilse veya geçmiş bir tarihse
    if (!experienceDate.isActive || experienceDate.status !== 'ACTIVE' || new Date(experienceDate.startDate) < new Date()) {
      return NextResponse.json(
        { error: 'Bu aktivite tarihi artık aktif değil' },
        { status: 400 }
      );
    }

    return NextResponse.json(experienceDate.ageRanges);
  } catch (error) {
    console.error('Yaş aralıkları getirilemedi:', error);
    return NextResponse.json(
      { error: 'Yaş aralıkları getirilemedi' },
      { status: 500 }
    );
  }
} 