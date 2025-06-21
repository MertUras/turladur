import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Prisma } from '@prisma/client';

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
    const { startDate, endDate, price, availableSeats, ageRanges } = body;

    const result = await prisma.$transaction(async (tx) => {
      const date = await tx.activityDate.create({
        data: {
          activityId: experienceId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          price: price,
          availableSeats: availableSeats,
        }
      });
      if (ageRanges && ageRanges.length > 0) {
        for (const range of ageRanges) {
          await tx.experienceDateAgeRange.create({
            data: {
              activityDateId: date.id,
              minAge: parseInt(range.minAge, 10),
              maxAge: range.maxAge ? parseInt(range.maxAge, 10) : null,
              pricingType: range.pricingType,
              value: parseFloat(range.value)
            }
          });
        }
      }
      return date;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 