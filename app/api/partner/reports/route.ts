import { NextResponse } from 'next/server';
import { resolvePartnerContext } from '@/lib/partner/auth';
import { getPartnerReportsProvider, ReportDateRangeId } from '@/lib/partner/reports';

const VALID_DATE_RANGES: ReportDateRangeId[] = [
  'today',
  'yesterday',
  'thisWeek',
  'lastWeek',
  'thisMonth',
  'lastMonth',
  'last3Months',
  'lastYear',
  'custom',
];

export async function GET(request: Request) {
  try {
    const partner = await resolvePartnerContext();
    if (!partner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateRangeParam = searchParams.get('dateRange') || 'thisMonth';
    const dateRangeId = (
      VALID_DATE_RANGES.includes(dateRangeParam as ReportDateRangeId)
        ? dateRangeParam
        : 'thisMonth'
    ) as ReportDateRangeId;

    const provider = getPartnerReportsProvider();
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

    const data = await provider.getReports(context, dateRangeId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching partner reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
