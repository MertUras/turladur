import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/experiences
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
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
    console.log('Session:', session);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    console.log('Request body:', json);

    // userId'yi email ile bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const experience = await prisma.experience.create({
      data: {
        title: json.name,
        description: json.description,
        longDescription: json.longDescription || '',
        imageUrl: json.images?.[0] || '',
        gallery: json.images || [],
        location: json.location,
        duration: json.duration?.toString() || '1',
        price: parseFloat(json.price),
        category: json.category,
        included: json.included || [],
        notIncluded: json.notIncluded || [],
        highlights: json.highlights || [],
        schedule: json.schedule || [],
        featured: json.featured ?? false,
        userId: user.id,
        meetingPoint: json.meetingPoint || null,
      },
    });

    // Aktivite tarihlerini ekle
    if (Array.isArray(json.activityDates) && json.activityDates.length > 0) {
      await Promise.all(json.activityDates.map((date: any) =>
        prisma.activityDate.create({
          data: {
            activityId: experience.id,
            startDate: new Date(date.startDate),
            endDate: new Date(date.endDate),
            price: date.price,
            availableSeats: date.availableSeats
          }
        })
      ));
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
} 