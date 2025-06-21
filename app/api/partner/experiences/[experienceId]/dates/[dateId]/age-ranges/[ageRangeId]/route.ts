import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { experienceId: string; dateId: string; ageRangeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const data = await request.json();
    if (!data.minAge || !data.pricingType || data.value === undefined) {
      return NextResponse.json(
        { error: 'Eksik alanlar var' },
        { status: 400 }
      );
    }
    // Çakışma kontrolü
    const existingRanges = await prisma.experienceDateAgeRange.findMany({
      where: {
        activityDateId: params.dateId,
        NOT: { id: params.ageRangeId }
      },
      orderBy: { minAge: 'asc' }
    });
    const currentMin = data.minAge;
    const currentMax = data.maxAge ?? Infinity;
    const hasOverlap = existingRanges.some(range => {
      const rangeMin = range.minAge;
      const rangeMax = range.maxAge ?? Infinity;
      return (currentMin <= rangeMax && currentMax >= rangeMin);
    });
    if (hasOverlap) {
      return NextResponse.json(
        { error: 'Bu yaş aralığı mevcut bir aralıkla çakışıyor' },
        { status: 400 }
      );
    }
    const updated = await prisma.experienceDateAgeRange.update({
      where: { id: params.ageRangeId },
      data: {
        minAge: data.minAge,
        maxAge: data.maxAge,
        pricingType: data.pricingType,
        value: data.value
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Yaş aralığı güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Yaş aralığı güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { experienceId: string; dateId: string; ageRangeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await prisma.experienceDateAgeRange.delete({
      where: { id: params.ageRangeId }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Yaş aralığı silinirken hata:', error);
    return NextResponse.json(
      { error: 'Yaş aralığı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 