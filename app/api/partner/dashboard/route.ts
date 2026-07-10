import { NextResponse } from 'next/server';
import { resolvePartnerContext } from '@/lib/partner/auth';
import { getPartnerDashboardProvider } from '@/lib/partner/dashboard';

export async function GET() {
  try {
    const partner = await resolvePartnerContext();
    if (!partner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const provider = getPartnerDashboardProvider();
    const context =
      partner.type === 'tour'
        ? {
            operatorType: 'tour' as const,
            tourOperatorId: partner.tourOperatorId,
            userId: partner.userId,
          }
        : {
            operatorType: 'experience' as const,
            experienceOperatorId: partner.experienceOperatorId,
            userId: partner.userId,
          };

    const data = await provider.getDashboard(context);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
