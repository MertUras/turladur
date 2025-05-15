import { NextResponse } from 'next/server';
import { createUser } from '@/lib/auth/register';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    const user = await createUser({ name, email, password, role });

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
      { message: error instanceof Error ? error.message : 'Kayıt işlemi sırasında bir hata oluştu' },
      { status: 400 }
    );
  }
} 