import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Yaş aralıklarını getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Önce tur tarihinin aktif olup olmadığını kontrol et
    const tourDate = await prisma.tourDate.findUnique({
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

    if (!tourDate) {
      return NextResponse.json(
        { error: 'Tur tarihi bulunamadı' },
        { status: 404 }
      );
    }

    // Eğer tur tarihi aktif değilse veya geçmiş bir tarihse
    if (!tourDate.isActive || tourDate.status !== 'ACTIVE' || new Date(tourDate.startDate) < new Date()) {
      return NextResponse.json(
        { error: 'Bu tur tarihi artık aktif değil' },
        { status: 400 }
      );
    }

    return NextResponse.json(tourDate.ageRanges);
  } catch (error) {
    console.error('Yaş aralıkları getirilemedi:', error);
    return NextResponse.json(
      { error: 'Yaş aralıkları getirilemedi' },
      { status: 500 }
    );
  }
}

// Yeni yaş aralığı ekle
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { minAge, description, pricingType, value } = data;

    // Validasyon
    if (!minAge || !pricingType || value === undefined) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Yaş aralığı oluştur
    const ageRange = await prisma.tourDateAgeRange.create({
      data: {
        minAge,
        description,
        pricingType,
        value,
        tourDateId: params.id
      }
    });

    return NextResponse.json(ageRange);
  } catch (error) {
    console.error('Yaş aralığı eklenemedi:', error);
    return NextResponse.json(
      { error: 'Yaş aralığı eklenemedi' },
      { status: 500 }
    );
  }
}

// Yaş aralığını güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id, minAge, description, pricingType, value } = data;

    // Validasyon
    if (!id || !minAge || !pricingType || value === undefined) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Yaş aralığını güncelle
    const ageRange = await prisma.tourDateAgeRange.update({
      where: { id },
      data: {
        minAge,
        description,
        pricingType,
        value
      }
    });

    return NextResponse.json(ageRange);
  } catch (error) {
    console.error('Yaş aralığı güncellenemedi:', error);
    return NextResponse.json(
      { error: 'Yaş aralığı güncellenemedi' },
      { status: 500 }
    );
  }
}

// Yaş aralığını sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Yaş aralığı ID\'si gerekli' },
        { status: 400 }
      );
    }

    await prisma.tourDateAgeRange.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Yaş aralığı silinemedi:', error);
    return NextResponse.json(
      { error: 'Yaş aralığı silinemedi' },
      { status: 500 }
    );
  }
} 