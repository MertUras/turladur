import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tour = await prisma.tour.findUnique({
      where: {
        id: params.id,
      },
      include: {
        tourOperator: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
          },
        },
      },
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tur bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Tur detayları alınırken hata:', error);
    return NextResponse.json(
      { error: 'Tur detayları alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 