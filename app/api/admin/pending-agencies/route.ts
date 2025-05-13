import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const pendingAgencies = await prisma.tourOperator.count({
      where: {
        status: 'pending'
      }
    });

    return NextResponse.json({ count: pendingAgencies });
  } catch (error) {
    console.error('Pending acenteler kontrol edilirken hata:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 