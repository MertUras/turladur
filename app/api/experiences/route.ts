import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/experiences (Partner's own experiences)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const experiences = await prisma.experience.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

// POST /api/experiences
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();

    const {
      name,
      price,
      category,
      duration,
      ageRestriction,
      activityDates,
    } = json;

    if (!name || price === undefined || !category || !duration || !ageRestriction) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return NextResponse.json(
        { error: 'Invalid price format' },
        { status: 400 }
      );
    }

    const createdExperience = await prisma.$transaction(async (tx) => {
      const experience = await tx.experience.create({
        data: {
          title: name,
          description: json.description || '',
          category,
          duration: duration.toString(),
          price: parsedPrice,
          ageRestriction: ageRestriction,
          longDescription: json.longDescription || '',
          location: json.location || '',
          included: json.included || [],
          notIncluded: json.notIncluded || [],
          highlights: json.highlights || [],
          schedule: json.schedule || [],
          userId: session.user.id,
          imageUrl: json.images?.[0] || '',
          gallery: json.images || [],
          meetingPoint: json.meetingPoint,
        },
      });

      if (Array.isArray(activityDates) && activityDates.length > 0) {
        await tx.activityDate.createMany({
          data: activityDates.map((date: any) => {
            const availableSeats = parseInt(date.availableSeats, 10);
            if (isNaN(availableSeats)) {
              throw new Error('Invalid availableSeats format for a date');
            }
            return {
              startDate: new Date(date.startDate),
              endDate: new Date(date.endDate),
              availableSeats: availableSeats,
              experienceId: experience.id,
              price: parsedPrice,
            };
          }),
        });
      }

      return experience;
    });

    return NextResponse.json(createdExperience);
  } catch (error) {
    console.error('Error creating experience:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create experience';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 