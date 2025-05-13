import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { success: false, message: 'İstek gövdesi boş olamaz.' },
        { status: 400 }
      );
    }

    const { email, password, companyName, phone, address } = await request.json();

    // Gerekli alanların kontrolü
    if (!email || !password || !companyName) {
      return NextResponse.json(
        { success: false, message: 'Email, şifre ve şirket adı zorunludur.' },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Geçerli bir email adresi giriniz.' },
        { status: 400 }
      );
    }

    // Email kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        tourOperators: true,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Bu email adresi zaten kullanılıyor.' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı ve tour operator oluştur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: companyName,
        role: 'TOUR_OPERATOR',
        tourOperators: {
          create: {
            companyName,
            email,
            phone: phone || '',
            address: address || '',
            status: 'pending'
          }
        }
      },
      include: {
        tourOperators: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Kayıt başarılı! Hesabınız onaylandıktan sonra giriş yapabilirsiniz.',
      data: {
        id: user.id,
        email: user.email,
        companyName: user.name,
        tourOperator: user.tourOperators[0]
      }
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Partner kayıt hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Kayıt sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
} 