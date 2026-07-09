import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

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
      select: { membershipTier: true, rating: true, reviewCount: true },
    });
    return NextResponse.json({
      tier: experienceOperator?.membershipTier ?? null,
      rating: experienceOperator?.rating ?? 0,
      reviewCount: experienceOperator?.reviewCount ?? 0,
    });
  }

  const tourOperator = await prisma.tourOperator.findFirst({
    where: { userId },
    select: { membershipTier: true, rating: true, reviewCount: true },
  });
  return NextResponse.json({
    tier: tourOperator?.membershipTier ?? null,
    rating: tourOperator?.rating ?? 0,
    reviewCount: tourOperator?.reviewCount ?? 0,
  });
}
