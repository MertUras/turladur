import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveMembershipTier } from '@/lib/membership';

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
        const operator = user?.experienceOperators?.[0] ?? null;
        return {
            ...rest,
            experienceOperator: operator
                ? {
                    ...operator,
                    membershipTier: resolveMembershipTier(operator.rating, operator.reviewCount),
                  }
                : null,
        };
    });

    return NextResponse.json(withOperator);
}
