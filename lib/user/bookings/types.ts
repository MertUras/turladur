import { BookingStatus, PaymentStatus } from '@/app/types';

export interface UserBookingOperator {
  id: string;
  name: string;
  rating?: number | null;
  membershipTier?: string | null;
}

export interface UserBookingTour {
  id: string;
  name: string;
  images?: string[];
  operator?: UserBookingOperator | null;
  departureCity?: string | null;
  destinations?: unknown;
}

export interface UserBookingExperience {
  id: string;
  title: string;
  imageUrl?: string | null;
  location?: string | null;
  meetingPoint?: string | null;
  operator?: UserBookingOperator | null;
}

export interface UserBookingHotel {
  id: string;
  name: string;
  images?: string[];
  city?: string | null;
}

export interface UserBookingPartnerReview {
  id: string;
  rating: number;
  comment?: string | null;
}

export interface UserBooking {
  id: string;
  bookingNumber: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  adults: number;
  children: number;
  specialRequests?: string | null;
  createdAt?: string;
  updatedAt?: string;
  hotelId?: string | null;
  tourId?: string | null;
  experienceId?: string | null;
  hotel?: UserBookingHotel | null;
  tour?: UserBookingTour | null;
  experience?: UserBookingExperience | null;
  partnerReview?: UserBookingPartnerReview | null;
  canReviewPartner: boolean;
  /** Tur / deneyim / otel adı */
  productTitle?: string | null;
  /** Tur firması veya deneyim sağlayıcısı */
  operatorName?: string | null;
  fromLocation?: string | null;
  toLocation?: string | null;
  /** Örn. "İstanbul → Kapadokya" */
  routeLabel?: string | null;
  /** Örn. "23 Temmuz 2026" */
  displayDateLabel?: string | null;
  /** adults + children */
  guestCount?: number;
  /** Aynı tur/aktivite + tarih aralığı grubu anahtarı */
  reviewGroupKey?: string | null;
  /** Gruptaki toplam rezervasyon sayısı */
  reviewGroupBookingCount?: number;
  /** Gruptaki toplam misafir sayısı (tüm rezervasyonlar) */
  reviewGroupGuestCount?: number;
  /** Bu rezervasyon başka bir rezervasyonun değerlendirmesiyle kapatıldıysa */
  reviewedViaBookingId?: string | null;
  /** Banner/modal için gruptaki tek değerlendirme temsilcisi */
  isReviewGroupRepresentative?: boolean;
}

export interface UserBookingsData {
  bookings: UserBooking[];
}

/** İstemci tarafı gerçek zamanlı abonelik geri çağrıları */
export interface UserBookingsSubscriptionCallbacks {
  onData: (data: UserBookingsData) => void;
  onError: (error: Error) => void;
  onFetching?: () => void;
}

/**
 * İstemci tarafı abonelik sağlayıcısı.
 * Prisma uygulaması polling kullanır; Firebase uygulaması onSnapshot kullanabilir.
 */
export interface UserBookingsSubscriptionProvider {
  subscribe(callbacks: UserBookingsSubscriptionCallbacks): () => void;
}

export const EMPTY_USER_BOOKINGS_DATA: UserBookingsData = {
  bookings: [],
};

/** UI filtreleri için durum grupları */
export const PENDING_BOOKING_STATUSES: BookingStatus[] = ['PENDING', 'PENDING_PAYMENT'];

export function matchesStatusFilter(
  status: BookingStatus,
  filter: 'all' | 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED'
): boolean {
  if (filter === 'all') return true;
  if (filter === 'PENDING') return PENDING_BOOKING_STATUSES.includes(status);
  return status === filter;
}
