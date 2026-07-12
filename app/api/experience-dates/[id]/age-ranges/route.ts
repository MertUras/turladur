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
    // Önce experience tarihinin aktif olup olmadığını kontrol et
    const experienceDate = await prisma.experienceDate.findUnique({
      where: {
        id
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
      console.warn('Yaş aralıkları isteği reddedildi:', {
        experienceDateId: id,
        isActive: experienceDate.isActive,
        status: experienceDate.status,
        startDate: experienceDate.startDate,
      });
      return NextResponse.json(
        { error: 'Bu aktivite tarihi artık aktif değil' },
        { status: 400 }
      );
    }

    return NextResponse.json(experienceDate.ageRanges);
  } catch (error) {
    console.error('Yaş aralıkları getirilemedi:', { experienceDateId: id, error });
    return NextResponse.json(
      { error: 'Yaş aralıkları getirilemedi' },
      { status: 500 }
    );
  }
} 