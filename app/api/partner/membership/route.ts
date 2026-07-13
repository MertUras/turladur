import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { computeMembershipTier, computeStarTier } from '@/lib/membership';

// GET /api/partner/membership
// Partner dashboard'unun üst kısmında isim yanında gösterilecek üyelik
// (Bronze/Silver/Gold) armasını döndürür. Bu seviye SATIN ALINAN bir paket
// DEĞİLDİR; müşterilerin tamamlanan rezervasyonlar sonrası verdiği 1-5
// yıldızlı partner değerlendirmelerinin ortalamasından otomatik hesaplanıp
// cache'lenir (bkz. lib/membership.ts). Hesap türüne göre (tur operatörü ya
// da aktivite sağlayıcısı) doğru tabloya bakar.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  if (session.user.role === 'EXPERIENCE_PROVIDER') {
    const experienceOperator = await prisma.experienceOperator.findFirst({
      where: { userId },
      select: { rating: true, reviewCount: true },
    });
    const rating = experienceOperator?.rating ?? 0;
    const reviewCount = experienceOperator?.reviewCount ?? 0;
    return NextResponse.json({
      tier: experienceOperator ? computeMembershipTier(rating, reviewCount) : null,
      starTier: experienceOperator ? computeStarTier(reviewCount, rating) : 0,
      rating,
      reviewCount,
    });
  }

  const tourOperator = await prisma.tourOperator.findFirst({
    where: { userId },
    select: { rating: true, reviewCount: true },
  });
  const rating = tourOperator?.rating ?? 0;
  const reviewCount = tourOperator?.reviewCount ?? 0;
  return NextResponse.json({
    tier: tourOperator ? computeMembershipTier(rating, reviewCount) : null,
    starTier: tourOperator ? computeStarTier(reviewCount, rating) : 0,
    rating,
    reviewCount,
  });
}
