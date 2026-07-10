import { NextResponse } from 'next/server';
import { resolvePartnerContext } from '@/lib/partner/auth';
import { getPartnerCustomersProvider } from '@/lib/partner/customers';

export async function GET() {
  try {
    const partner = await resolvePartnerContext();
    if (!partner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const provider = getPartnerCustomersProvider();
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

    const data = await provider.list(context);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
