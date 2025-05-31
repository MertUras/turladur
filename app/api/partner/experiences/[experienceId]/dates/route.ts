import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { experienceId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { experienceId } = params;
    const dates = await prisma.activityDate.findMany({
      where: { activityId: experienceId },
      orderBy: { startDate: 'asc' }
    });
    return NextResponse.json(dates);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { experienceId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { experienceId } = params;
    const body = await req.json();
    const date = await prisma.activityDate.create({
      data: {
        activityId: experienceId,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        price: body.price,
        availableSeats: body.availableSeats
      }
    });
    return NextResponse.json(date);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 