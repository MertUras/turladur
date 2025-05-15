import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { success: false, message: 'İstek gövdesi boş olamaz.' },
        { status: 400 }
      );
    }

    const { email, password } = await request.json();
    console.log('Giriş denemesi:', { email }); // Debug log

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email ve şifre gereklidir.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tourOperators: true,
        experienceOperators: true,
      },
    });
    console.log('Bulunan kullanıcı:', { 
      userId: user?.id,
      userRole: user?.role,
      hasPassword: !!user?.password,
      tourOperatorCount: user?.tourOperators?.length,
      experienceOperatorCount: user?.experienceOperators?.length
    }); // Debug log

    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz email veya şifre.' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Şifre kontrolü:', { isPasswordValid }); // Debug log

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz email veya şifre.' },
        { status: 401 }
      );
    }

    if (user.role === 'TOUR_OPERATOR') {
      const tourOperator = user.tourOperators[0];
      console.log('Tour operator bilgileri:', { 
        id: tourOperator?.id,
        status: tourOperator?.status,
        companyName: tourOperator?.companyName
      }); // Debug log

      if (!tourOperator) {
        return NextResponse.json(
          { success: false, message: 'Partner hesabı bulunamadı.' },
          { status: 404 }
        );
      }

      // Status kontrolü
      switch (tourOperator.status) {
        case 'pending':
          return NextResponse.json(
            { success: false, message: 'Hesabınız henüz onaylanmamış. Lütfen admin onayını bekleyin.' },
            { status: 403 }
          );
        case 'rejected':
          return NextResponse.json(
            { success: false, message: 'Hesabınız reddedilmiş. Daha fazla bilgi için lütfen bizimle iletişime geçin.' },
            { status: 403 }
          );
        case 'suspended':
          return NextResponse.json(
            { success: false, message: 'Hesabınız askıya alınmış. Daha fazla bilgi için lütfen bizimle iletişime geçin.' },
            { status: 403 }
          );
        case 'approved':
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              role: user.role,
              tourOperatorId: tourOperator.id,
            },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: '1d' }
          );

          console.log('Başarılı giriş, token oluşturuldu'); // Debug log

          return NextResponse.json({
            success: true,
            message: 'Giriş başarılı!',
            data: {
              token,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              },
              tourOperator: {
                id: tourOperator.id,
                companyName: tourOperator.companyName,
                status: tourOperator.status
              }
            }
          });
        default:
          console.log('Geçersiz durum:', tourOperator.status); // Debug log
          return NextResponse.json(
            { success: false, message: 'Geçersiz hesap durumu.' },
            { status: 400 }
          );
      }
    } else if (user.role === 'EXPERIENCE_PROVIDER') {
      const experienceOperator = user.experienceOperators[0];
      console.log('Experience operator bilgileri:', { 
        id: experienceOperator?.id,
        status: experienceOperator?.status,
        companyName: experienceOperator?.companyName
      }); // Debug log

      if (!experienceOperator) {
        return NextResponse.json(
          { success: false, message: 'Partner hesabı bulunamadı.' },
          { status: 404 }
        );
      }

      // Status kontrolü
      switch (experienceOperator.status) {
        case 'pending':
          return NextResponse.json(
            { success: false, message: 'Hesabınız henüz onaylanmamış. Lütfen admin onayını bekleyin.' },
            { status: 403 }
          );
        case 'rejected':
          return NextResponse.json(
            { success: false, message: 'Hesabınız reddedilmiş. Daha fazla bilgi için lütfen bizimle iletişime geçin.' },
            { status: 403 }
          );
        case 'suspended':
          return NextResponse.json(
            { success: false, message: 'Hesabınız askıya alınmış. Daha fazla bilgi için lütfen bizimle iletişime geçin.' },
            { status: 403 }
          );
        case 'approved':
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              role: user.role,
              experienceOperatorId: experienceOperator.id,
            },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: '1d' }
          );
          return NextResponse.json({
            success: true,
            message: 'Giriş başarılı!',
            data: {
              token,
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              },
              experienceOperator: {
                id: experienceOperator.id,
                companyName: experienceOperator.companyName,
                status: experienceOperator.status
              }
            }
          });
        default:
          console.log('Geçersiz durum:', experienceOperator.status); // Debug log
          return NextResponse.json(
            { success: false, message: 'Geçersiz hesap durumu.' },
            { status: 400 }
          );
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Bu hesap bir partner hesabı değil.' },
        { status: 403 }
      );
    }
  } catch (error: unknown) {
    console.error('Partner login hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Giriş sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      },
      { status: 500 }
    );
  }
} 