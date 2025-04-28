import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { companyName, email, password, phone, address, city, country, website, description } = await request.json();

    // Email kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12);

    // Önce kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'TOUR_OPERATOR',
      },
    });

    // Sonra tour operator oluştur
    const tourOperator = await prisma.tourOperator.create({
      data: {
        name: companyName,
        email,
        phone,
        address,
        city,
        country,
        website,
        description,
        userId: user.id,
      },
    });

    return NextResponse.json(
      { 
        message: 'Kayıt başarılı',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        tourOperator: {
          id: tourOperator.id,
          name: tourOperator.name,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Partner kayıt hatası:', error);
    return NextResponse.json(
      { message: 'Kayıt sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 