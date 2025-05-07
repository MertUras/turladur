import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// Alt kullanıcıları listele
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tourOperator = await prisma.tourOperator.findFirst({
    where: { userId: session.user.id },
    include: { subUsers: true }
  });

  if (!tourOperator) {
    return NextResponse.json({ error: 'Tour operator not found' }, { status: 404 });
  }

  return NextResponse.json(tourOperator.subUsers);
}

// Yeni alt kullanıcı oluştur
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tourOperator = await prisma.tourOperator.findFirst({
    where: { userId: session.user.id }
  });

  if (!tourOperator) {
    return NextResponse.json({ error: 'Tour operator not found' }, { status: 404 });
  }

  const body = await request.json();
  const { name, email, password, role, permissions } = body;

  // Email kontrolü
  const existingUser = await prisma.subUser.findFirst({
    where: {
      tourOperatorId: tourOperator.id,
      email: email
    }
  });

  if (existingUser) {
    return NextResponse.json({ error: 'Bu email adresi zaten kullanımda' }, { status: 400 });
  }

  // Şifreyi hashle
  const hashedPassword = await bcrypt.hash(password, 10);

  const subUser = await prisma.subUser.create({
    data: {
      tourOperatorId: tourOperator.id,
      name,
      email,
      password: hashedPassword,
      role,
      permissions,
    }
  });

  return NextResponse.json(subUser);
}

// Alt kullanıcı güncelle
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tourOperator = await prisma.tourOperator.findFirst({
    where: { userId: session.user.id }
  });

  if (!tourOperator) {
    return NextResponse.json({ error: 'Tour operator not found' }, { status: 404 });
  }

  const body = await request.json();
  const { id, name, email, role, permissions, status } = body;

  const subUser = await prisma.subUser.update({
    where: {
      id,
      tourOperatorId: tourOperator.id
    },
    data: {
      name,
      email,
      role,
      permissions,
      status
    }
  });

  return NextResponse.json(subUser);
}

// Alt kullanıcı sil
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tourOperator = await prisma.tourOperator.findFirst({
    where: { userId: session.user.id }
  });

  if (!tourOperator) {
    return NextResponse.json({ error: 'Tour operator not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  await prisma.subUser.delete({
    where: {
      id,
      tourOperatorId: tourOperator.id
    }
  });

  return NextResponse.json({ success: true });
} 