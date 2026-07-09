import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '100');

    let where: any = {};
    if (category) {
        where.category = category;
    }

    const experiences = await prisma.experience.findMany({
        where,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    experienceOperators: {
                        select: {
                            id: true,
                            companyName: true,
                            logo: true,
                            rating: true,
                            reviewCount: true,
                            membershipTier: true,
                        },
                    },
                },
            },
        },
    });

    // Partnerin (aktivite sağlayıcısının) müşteri değerlendirmelerinden
    // otomatik hesaplanan güncel üyelik seviyesini karta taşıyoruz.
    const withOperator = experiences.map((exp) => {
        const { user, ...rest } = exp as typeof exp & { user?: { experienceOperators: any[] } };
        return {
            ...rest,
            experienceOperator: user?.experienceOperators?.[0] ?? null,
        };
    });

    return NextResponse.json(withOperator);
}
