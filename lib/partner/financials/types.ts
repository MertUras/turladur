import { RevenueChartData } from '@/lib/partner/dashboard';

export type FinancialDateRangeId =
  | 'thisWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'last3Months'
  | 'thisYear';

export interface FinancialSummary {
  totalRevenue: number;
  grossSales: number;
  refundTotal: number;
  pendingPayments: number;
  totalPayouts: number;
  netProfit: number;
  comparedToLastPeriod: number | null;
  increase: boolean | null;
  pendingTransactionCount: number;
  completedTransactionCount: number;
  completedToursCount: number;
  netProfitChange: number | null;
  netProfitIncrease: boolean | null;
}

export type FinancialTransactionType = 'ödeme' | 'iade' | 'beklemede';

export interface FinancialTransaction {
  id: string;
  date: string;
  type: FinancialTransactionType;
  amount: number;
  status: 'tamamlandı' | 'beklemede' | 'iptal';
  customer: string;
  tourName: string;
}

export interface PaymentMethodBreakdown {
  method: string;
  count: number;
  amount: number;
}

export interface PartnerFinancialsData {
  summary: FinancialSummary;
  transactions: FinancialTransaction[];
  revenueChart: RevenueChartData;
  paymentMethods: PaymentMethodBreakdown[];
}

export interface PartnerFinancialsProvider {
  getFinancials(
    context: PartnerFinancialsContext,
    dateRangeId: FinancialDateRangeId
  ): Promise<PartnerFinancialsData>;
}

export type PartnerFinancialsContext =
  | { operatorType: 'tour'; tourOperatorId: string; userId: string }
  | { operatorType: 'experience'; experienceOperatorId: string; userId: string };
