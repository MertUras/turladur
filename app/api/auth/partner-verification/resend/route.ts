import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Partner'ı bul
    const partner = await prisma.partner.findUnique({
      where: { email },
    });

    if (!partner) {
      return NextResponse.json(
        { message: 'Bu e-posta adresi ile kayıtlı bir partner bulunamadı.' },
        { status: 404 }
      );
    }

    if (partner.status !== 'PENDING') {
      return NextResponse.json(
        { message: 'Bu hesap zaten doğrulanmış veya reddedilmiş.' },
        { status: 400 }
      );
    }

    // Doğrulama token'ı oluştur
    const verificationToken = crypto.randomUUID();

    // Partner'ı güncelle
    await prisma.partner.update({
      where: { email },
      data: {
        verificationToken,
        verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 saat
      },
    });

    // Doğrulama e-postasını gönder
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/partner-verification/verify?token=${verificationToken}`;
    
    await resend.emails.send({
      from: 'TourTech Partner <partner@tourtech.com>',
      to: email,
      subject: 'TourTech Partner Hesabınızı Doğrulayın',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0369a1; font-size: 24px; margin-bottom: 20px;">TourTech Partner Hesabınızı Doğrulayın</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #374151; margin-bottom: 20px;">
            Merhaba ${partner.companyName},
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #374151; margin-bottom: 20px;">
            TourTech partner ağına hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Hesabımı Doğrula
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.5; color: #6b7280; margin-bottom: 20px;">
            Bu bağlantı 24 saat boyunca geçerlidir. Eğer bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın.
          </p>
          <p style="font-size: 14px; line-height: 1.5; color: #6b7280;">
            Saygılarımızla,<br>
            TourTech Partner Ekibi
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Doğrulama e-postası başarıyla gönderildi.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Doğrulama e-postası gönderme hatası:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Doğrulama e-postası gönderilemedi' },
      { status: 500 }
    );
  }
} 