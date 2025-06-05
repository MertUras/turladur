import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string; dateId: string } }
) {
  try {
    const ageRanges = await prisma.tourDateAgeRange.findMany({
      where: {
        tourDateId: params.dateId
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
  { params }: { params: { id: string; dateId: string } }
) {
  try {
    const data = await request.json();

    // Gerekli alanların kontrolü
    if (!data.minAge || !data.pricingType || data.value === undefined) {
      return NextResponse.json(
        { error: 'Eksik alanlar var' },
        { status: 400 }
      );
    }

    // Yaş aralığı oluştur
    const ageRange = await prisma.tourDateAgeRange.create({
      data: {
        tourDateId: params.dateId,
        minAge: data.minAge,
        description: data.description || '',
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string; dateId: string; ageRangeId: string } }
) {
  try {
    const data = await request.json();

    // Gerekli alanların kontrolü
    if (!data.minAge || !data.pricingType || data.value === undefined) {
      return NextResponse.json(
        { error: 'Eksik alanlar var' },
        { status: 400 }
      );
    }

    // Yaş aralığı güncelle
    const ageRange = await prisma.tourDateAgeRange.update({
      where: {
        id: params.ageRangeId,
        tourDateId: params.dateId
      },
      data: {
        minAge: data.minAge,
        description: data.description || '',
        pricingType: data.pricingType,
        value: data.value
      }
    });

    return NextResponse.json(ageRange);
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
  { params }: { params: { id: string; dateId: string; ageRangeId: string } }
) {
  try {
    // Yaş aralığı sil
    await prisma.tourDateAgeRange.delete({
      where: {
        id: params.ageRangeId,
        tourDateId: params.dateId
      }
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