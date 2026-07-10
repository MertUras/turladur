import { NextResponse } from 'next/server';
import { resolvePartnerContext } from '@/lib/partner/auth';
import {
  FinancialDateRangeId,
  getPartnerFinancialsProvider,
} from '@/lib/partner/financials';

const VALID_RANGES: FinancialDateRangeId[] = [
  'thisWeek',
  'thisMonth',
  'lastMonth',
  'last3Months',
  'thisYear',
];

export async function GET(request: Request) {
  try {
    const partner = await resolvePartnerContext();
    if (!partner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get('range') || 'thisMonth';
    const dateRangeId = VALID_RANGES.includes(rangeParam as FinancialDateRangeId)
      ? (rangeParam as FinancialDateRangeId)
      : 'thisMonth';

    const provider = getPartnerFinancialsProvider();
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

    const data = await provider.getFinancials(context, dateRangeId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching financials:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
