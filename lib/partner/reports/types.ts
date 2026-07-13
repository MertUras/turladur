export type ReportType = 'sales' | 'visitors' | 'performance' | 'customer';

export type ReportDateRangeId =
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'last3Months'
  | 'lastYear'
  | 'custom';

export interface ResolvedDateRange {
  id: ReportDateRangeId;
  label: string;
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
}

export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  comparedToLastPeriod: number | null;
  increase: boolean | null;
}

export interface TopSellingItem {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number | null;
}

export interface BookingSummary {
  totalReservations: number;
  completedTours: number;
  cancelledReservations: number;
  refundedCount: number;
  averageRating: number;
}

export interface SalesTrendPoint {
  label: string;
  sales: number;
  revenue: number;
}

export interface SalesReportData {
  summary: SalesSummary;
  periodLabel: string;
  periodRangeText: string;
  topSelling: TopSellingItem[];
  bookingSummary: BookingSummary;
  trend: SalesTrendPoint[];
}

export interface PerformanceSummary {
  conversionRate: number | null;
  completionRate: number;
  avgBookingValue: number;
  monthlyBookings: number;
}

export interface TourPerformanceRow {
  id: string;
  name: string;
  bookings: number;
  avgRating: number;
  conversionRate: number | null;
  revenue: number;
}

export interface PerformanceReportData {
  summary: PerformanceSummary;
  monthlyTrend: { label: string; count: number }[];
  tourPerformance: TourPerformanceRow[];
  goals: {
    name: string;
    current: number;
    target: number;
    percentage: number;
  }[];
}

export interface CustomerSummary {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  customerLifetimeValue: number;
  percentChange: number | null;
  increase: boolean | null;
}

export interface TopCustomerRow {
  id: string;
  name: string;
  bookings: number;
  spent: number;
  lastBooking: string;
}

export interface CustomerReportData {
  summary: CustomerSummary;
  topCustomers: TopCustomerRow[];
  satisfactionDistribution: { rating: number; percentage: number }[];
}

export interface VisitorsSummary {
  uniqueVisitors: number;
  totalInteractions: number;
  conversionRate: number;
  comparedToLastPeriod: number | null;
  increase: boolean | null;
}

export interface VisitorsTrendPoint {
  label: string;
  interactions: number;
  uniqueVisitors: number;
}

export interface TourVisitorRow {
  id: string;
  name: string;
  interactions: number;
  uniqueVisitors: number;
  conversions: number;
  conversionRate: number;
}

export interface VisitorsReportData {
  available: true;
  dataSource: 'booking_proxy';
  disclaimer: string;
  summary: VisitorsSummary;
  trend: VisitorsTrendPoint[];
  tourBreakdown: TourVisitorRow[];
}

export interface PartnerReportsData {
  dateRange: ResolvedDateRange;
  sales: SalesReportData;
  performance: PerformanceReportData;
  customer: CustomerReportData;
  visitors: VisitorsReportData;
}

export interface PartnerReportsProvider {
  getReports(
    context: PartnerReportsContext,
    dateRangeId: ReportDateRangeId
  ): Promise<PartnerReportsData>;
}

export type PartnerReportsContext =
  | { operatorType: 'tour'; tourOperatorId: string; userId: string }
  | { operatorType: 'experience'; experienceOperatorId: string; userId: string };
