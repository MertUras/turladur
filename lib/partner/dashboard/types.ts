export type RevenueTimeRange = 'week' | 'month' | 'year';

export interface StatTrend {
  change: string;
  changeType: 'increase' | 'decrease';
  changeText: string;
}

export interface PartnerDashboardStats {
  totalTours: number;
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
  upcomingTours: number;
}

export interface PartnerDashboardStatTrends {
  totalTours?: StatTrend;
  totalBookings?: StatTrend;
  totalRevenue?: StatTrend;
  totalCustomers?: StatTrend;
  averageRating?: StatTrend;
  upcomingTours?: StatTrend;
}

export interface ReservationStatusBreakdown {
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

export interface RecentReservationItem {
  id: string;
  customerName: string;
  customerEmail: string;
  customerInitials: string;
  activity: string;
  activityType: string;
  date: string;
  time: string;
  amount: string;
  status: 'Onaylandı' | 'Beklemede' | 'İptal Edildi' | 'Tamamlandı' | 'Ödeme Bekliyor' | 'Askıya Alındı';
}

export interface PopularTourItem {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  reservationCount: number;
  guestCount: number;
  price: string;
  image: string;
}

export interface RevenueChartPoint {
  label: string;
  revenue: number;
}

export interface RevenueChartData {
  week: RevenueChartPoint[];
  month: RevenueChartPoint[];
  year: RevenueChartPoint[];
}

export interface PartnerDashboardData {
  stats: PartnerDashboardStats;
  trends: PartnerDashboardStatTrends;
  recentReservations: RecentReservationItem[];
  popularTours: PopularTourItem[];
  reservationStatus: ReservationStatusBreakdown;
  revenueChart: RevenueChartData;
}

export interface PartnerDashboardProvider {
  getDashboard(context: PartnerDashboardContext): Promise<PartnerDashboardData>;
}

export type PartnerDashboardContext =
  | { operatorType: 'tour'; tourOperatorId: string; userId: string }
  | { operatorType: 'experience'; experienceOperatorId: string; userId: string };
