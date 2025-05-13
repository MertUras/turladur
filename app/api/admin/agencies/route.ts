import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const agencies = await prisma.tourOperator.findMany({
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(agencies);
  } catch (error) {
    console.error('Acenteler yüklenirken hata:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    const updatedAgency = await prisma.tourOperator.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(updatedAgency);
  } catch (error) {
    console.error('Acente güncellenirken hata:', error);
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 