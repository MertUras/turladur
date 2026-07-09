import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MembershipTier } from '@prisma/client';

// GET /api/home/deals?type=tour|activity&category=all|popular|lastMinute|discount
//
// Ana sayfadaki "Sizin İçin Seçtiğimiz Turlar" / "Macera Dolu Aktiviteler"
// bölümleri için GERÇEK turları/aktiviteleri getirir. Sonuçlar, o turu/
// aktiviteyi sunan PARTNERİN güncel üyelik seviyesine göre önceliklendirilir:
// GOLD > SILVER > BRONZE, eşitlik durumunda partner puanına göre sıralanır.
const TIER_RANK: Record<MembershipTier, number> = { GOLD: 3, SILVER: 2, BRONZE: 1 };

function sortByTier<T extends { tierRank: number; operatorRating: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (b.tierRank !== a.tierRank) return b.tierRank - a.tierRank;
    return b.operatorRating - a.operatorRating;
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') === 'activity' ? 'activity' : 'tour';
    const category = searchParams.get('category') || 'all';
    const limit = Math.min(parseInt(searchParams.get('limit') || '8'), 20);

    if (type === 'tour') {
      const where: Record<string, unknown> = {};
      if (category === 'popular') where.isPopular = true;
      else if (category === 'lastMinute') where.isLastMinute = true;
      else if (category === 'discount') where.discount = { gt: 0 };

      const tours = await prisma.tour.findMany({
        where,
        include: {
          tourOperator: { select: { companyName: true, rating: true, reviewCount: true, membershipTier: true } },
        },
        take: 30,
        orderBy: { createdAt: 'desc' },
      });

      const mapped = tours.map((tour) => ({
        id: tour.id,
        title: tour.name,
        description: tour.description || '',
        image: Array.isArray(tour.images) && tour.images.length > 0 ? (tour.images[0] as string) : null,
        location: tour.departureCity || tour.region || '',
        salePrice: tour.price,
        originalPrice: tour.discount && tour.discount > 0 ? Math.round(tour.price * (1 + tour.discount / 100)) : null,
        discount: tour.discount || 0,
        type: 'tour' as const,
        partnerName: tour.tourOperator?.companyName || null,
        partnerTier: (tour.tourOperator?.membershipTier || 'BRONZE') as MembershipTier,
        tierRank: TIER_RANK[(tour.tourOperator?.membershipTier || 'BRONZE') as MembershipTier],
        operatorRating: tour.tourOperator?.rating || 0,
      }));

      return NextResponse.json({ deals: sortByTier(mapped).slice(0, limit) });
    }

    // type === 'activity'
    // Experience modelinde Tour'daki isLastMinute/discount alanlarının
    // karşılığı yok; bu yüzden "popular" için `featured` kullanılır, diğer
    // kategoriler için (şema desteği eklenene kadar) tüm aktiviteler döner.
    const where: Record<string, unknown> = {};
    if (category === 'popular') where.featured = true;

    const experiences = await prisma.experience.findMany({
      where,
      include: {
        user: {
          select: {
            experienceOperators: { select: { companyName: true, rating: true, reviewCount: true, membershipTier: true } },
          },
        },
      },
      take: 30,
      orderBy: { createdAt: 'desc' },
    });

    const mapped = experiences.map((exp) => {
      const operator = exp.user?.experienceOperators?.[0];
      const gallery = Array.isArray(exp.gallery) ? (exp.gallery as string[]) : [];
      return {
        id: exp.id,
        title: exp.title,
        description: exp.description || '',
        image: exp.imageUrl || gallery[0] || null,
        location: exp.location || '',
        salePrice: exp.price,
        originalPrice: null as number | null,
        discount: 0,
        type: 'activity' as const,
        partnerName: operator?.companyName || null,
        partnerTier: (operator?.membershipTier || 'BRONZE') as MembershipTier,
        tierRank: TIER_RANK[(operator?.membershipTier || 'BRONZE') as MembershipTier],
        operatorRating: operator?.rating || 0,
      };
    });

    return NextResponse.json({ deals: sortByTier(mapped).slice(0, limit) });
  } catch (error) {
    console.error('Error fetching home deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
