import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Doğrulama token\'ı bulunamadı.' },
        { status: 400 }
      );
    }

    // Token'ı kullanarak kullanıcıyı bul
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date()
        }
      },
      include: {
        tourOperators: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Geçersiz veya süresi dolmuş doğrulama token\'ı.' },
        { status: 400 }
      );
    }

    // Kullanıcıyı aktifleştir
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      }
    });

    return NextResponse.json(
      { message: 'Hesap başarıyla doğrulandı.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Doğrulama hatası:', error);
    return NextResponse.json(
      { message: 'Hesap doğrulanırken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 