import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { tourId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const tourId = params.tourId;
    
    // Partner'ı bul
    const partner = await prisma.tourOperator.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner not found' }, { status: 404 });
    }

    // Turu bul ve partner'a ait olduğunu kontrol et
    const tour = await prisma.tour.findFirst({
      where: {
        id: tourId,
        tourOperatorId: partner.id
      }
    });

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Turu sil
    await prisma.tour.delete({
      where: { id: tourId }
    });

    return NextResponse.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 