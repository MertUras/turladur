import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Şifre uzunluk kontrolü
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Şifre en az 8 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Şifre karmaşıklık kontrolü
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return NextResponse.json(
        { message: 'Şifre en az bir büyük harf, bir küçük harf, bir sayı ve bir özel karakter içermelidir' },
        { status: 400 }
      );
    }

    // Salt değerini environment variable'dan al
    const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER', // Varsayılan rol
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(
      { 
        message: 'Kullanıcı başarıyla oluşturuldu',
        user
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { message: 'Kayıt işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 