/**
 * Shared API response envelope used by web and api.
 */
export interface ApiError {
  code: string;
  message: string;
}

export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta?: ApiMeta;
}

export type UserRole =
  'CUSTOMER' | 'PARTNER' | 'PARTNER_STAFF' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: UserRole;
  partnerId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TourCategory =
  'CULTURAL' | 'ADVENTURE' | 'GASTRONOMY' | 'NATURE' | 'CITY' | 'BEACH';

export type TourStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl: string | null;
  price: string;
  currency: string;
  category: TourCategory;
  status: TourStatus;
  durationDays: number;
  averageRating: string;
  reviewCount: number;
  partnerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TourDate {
  id: string;
  tourId: string;
  startDate: string;
  endDate: string;
  capacity: number;
  remainingCapacity: number;
  priceOverride: string | null;
  isActive: boolean;
}

export interface TourSearchResponse {
  items: Tour[];
  meta: ApiMeta;
}

export type BookingStatus =
  'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'PAYMENT_FAILED';

export interface BookingGuest {
  firstName: string;
  lastName: string;
  birthDate?: string;
  identityNumber?: string;
}

export interface Reservation {
  id: string;
  bookingNumber: string;
  userId: string;
  tourId: string;
  tourDateId: string;
  partnerId: string;
  status: BookingStatus;
  adults: number;
  children: number;
  totalAmount: string;
  currency: string;
  contactEmail: string;
  contactPhone: string | null;
  guests: BookingGuest[];
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus =
  'PENDING' | 'AWAITING_3DS' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface PaymentTransaction {
  id: string;
  reservationId: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  provider: 'IYZICO' | 'MOCK';
  conversationId: string;
  providerPaymentId: string | null;
  paidAt: string | null;
}

export interface Review {
  id: string;
  tourId: string;
  reservationId: string;
  userId: string;
  partnerId: string;
  rating: number;
  comment: string | null;
  photoUrls: string[];
  partnerReply: string | null;
  partnerRepliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_COMPLETED'
  | 'REVIEW_RECEIVED'
  | 'REVIEW_REQUEST'
  | 'WELCOME'
  | 'GENERIC';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType | string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}
