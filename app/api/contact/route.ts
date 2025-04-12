// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { name, email, phone, subject, message } = await request.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Zorunlu alanlar eksik.' }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // maile göre değişicek ksıım
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: 'contact@turladur.com',
      subject: `İletişim Formu: ${subject}`,
      html: `
        <h2>Yeni Mesaj</h2>
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || '-'}</p>
        <p><strong>Konu:</strong> ${subject}</p>
        <p><strong>Mesaj:</strong><br>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Mail gönderim hatası:', error);
    return NextResponse.json({ error: 'Mail gönderilemedi.' }, { status: 500 });
  }
}
