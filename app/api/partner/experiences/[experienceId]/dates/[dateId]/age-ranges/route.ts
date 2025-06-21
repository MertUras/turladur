import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { experienceId: string; dateId: string } }
) {
  console.log('GET /api/partner/experiences/[experienceId]/dates/[dateId]/age-ranges params:', params);
  console.log('GET activityDateId ile arama:', params.dateId);
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const ageRanges = await prisma.experienceDateAgeRange.findMany({
      where: {
        activityDateId: params.dateId
      },
      orderBy: {
        minAge: 'asc'
      }
    });
    return NextResponse.json(ageRanges);
  } catch (error) {
    console.error('Yaş aralıkları alınırken hata:', error);
    return NextResponse.json(
      { error: 'Yaş aralıkları alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { experienceId: string; dateId: string } }
) {
  console.log('POST /api/partner/experiences/[experienceId]/dates/[dateId]/age-ranges params:', params);
  console.log('POST activityDateId ile ekleme:', params.dateId);
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
    const existingRanges = await prisma.experienceDateAgeRange.findMany({
      where: {
        activityDateId: params.dateId
      },
      orderBy: {
        minAge: 'asc'
      }
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
    const ageRange = await prisma.experienceDateAgeRange.create({
      data: {
        activityDateId: params.dateId,
        minAge: data.minAge,
        maxAge: data.maxAge,
        pricingType: data.pricingType,
        value: data.value
      }
    });
    return NextResponse.json(ageRange);
  } catch (error) {
    console.error('Yaş aralığı oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Yaş aralığı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 