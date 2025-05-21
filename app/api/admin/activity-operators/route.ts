import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Aktivite Operatörleri Listesi (Admin)
export async function GET() {
  try {
    const activityOperators = await prisma.user.findMany({
      where: { role: 'EXPERIENCE_PROVIDER' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        status: true,
      }
    });
    return NextResponse.json(activityOperators);
  } catch (error) {
    console.error('Aktivite operatörleri yüklenirken hata:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Aktivite Operatörü Onay/Reddet
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    // User'ı güncelle
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status },
    });

    // ExperienceOperator'ı da güncelle
    await prisma.experienceOperator.updateMany({
      where: { userId: id },
      data: { status },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Aktivite operatörü güncellenirken hata:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 