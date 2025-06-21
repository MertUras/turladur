import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { startDate, endDate, availableSeats, experienceId, price } = body;

    if (!startDate || !endDate || !availableSeats || !experienceId || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newActivityDate = await prisma.activityDate.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price: Number(price),
        availableSeats: Number(availableSeats),
        experience: {
          connect: {
            id: experienceId,
          }
        }
      },
    });

    return NextResponse.json(newActivityDate, { status: 201 });
  } catch (error) {
    console.error('Error creating activity date:', error);
    return NextResponse.json({ error: 'An error occurred while creating the activity date.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const experienceId = searchParams.get('experienceId');
  
    if (!experienceId) {
      return NextResponse.json({ error: 'Experience ID is required' }, { status: 400 });
    }
  
    try {
      const dates = await prisma.activityDate.findMany({
        where: {
          experienceId: experienceId,
        },
        orderBy: {
          startDate: 'asc',
        },
      });
      return NextResponse.json(dates);
    } catch (error) {
      console.error('Error fetching activity dates:', error);
      return NextResponse.json({ error: 'Failed to fetch activity dates' }, { status: 500 });
    }
  } 