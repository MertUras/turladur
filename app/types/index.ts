// Kullanıcı tipleri
export type UserRole = 'USER' | 'HOTEL_ADMIN' | 'AGENCY_ADMIN' | 'TOUR_OPERATOR' | 'ACTIVITY_PROVIDER' | 'ADMIN';
// types/env.d.ts

declare namespace NodeJS {
  interface ProcessEnv {
    SMTP_USER: string;
    SMTP_PASS: string;
    EMAIL_TO: string;
    EMAIL_PORT?: string;
    EMAIL_HOST?: string;
    EMAIL_SECURE?: string;
    DATABASE_URL?: string;
  }
}

export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Otel tipleri
export type HotelType = 'HOTEL' | 'BOUTIQUE_HOTEL' | 'RESORT' | 'HOSTEL' | 'APARTMENT' | 'VILLA' | 'GUESTHOUSE';

export interface Hotel {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  stars?: number;
  type: HotelType;
  amenities: string; // JSON formatında
  images: string; // JSON formatında
  latitude?: number;
  longitude?: number;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Oda tipleri
export interface Room {
  id: string;
  name: string;
  description?: string;
  type?: string;
  capacity: number;
  price: number;
  discount?: number;
  size?: number;
  bedType?: string;
  images: string; // JSON formatında
  amenities: string; // JSON formatında
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
  hotelId: string;
}

// Acente tipleri
export interface Agency {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  license?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Tur Operatörü tipleri
export interface TourOperator {
  id: string;
  companyName: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  license?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  categories?: string[];
  rating?: number;
  certified?: boolean;
  popularity?: number;
  coverImage?: string;
}

// Tur tipleri
export interface Tour {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  discount: number;
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  destinations: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: string[];
  images: string[];
  featured: boolean;
  departureCity: string;
  region: string;
  transportation: string;
  period: string;
  rating: number;
  reviewCount?: number;
  tourType: string;
  accommodationType: string;
  difficultyLevel: string;
  ageRestriction: string;
  isPopular: boolean;
  isLastMinute: boolean;
  isEarlyBird: boolean;
  languages: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  tourOperator: {
    id: string;
    companyName: string;
    logo: string;
    membershipTier?: 'BRONZE' | 'SILVER' | 'GOLD' | null;
  };
}

// Aktiviteler tipleri
export interface Activity {
  id: string;
  name: string;
  description?: string;
  category?: string;
  duration: number;
  price: number;
  discount?: number;
  location?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  maxParticipants?: number;
  inclusions: string; // JSON formatında
  exclusions: string; // JSON formatında
  images: string; // JSON formatında
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  providerId: string;
  activityId?: string;
}

// Rezervasyon tipleri
export type BookingStatus =
  | 'PENDING'
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'SUSPENDED'
  | 'CANCELLED'
  | 'COMPLETED';
export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';

export interface Booking {
  id: string;
  bookingNumber: string;
  startDate: Date;
  endDate: Date;
  adults: number;
  children: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  hotelId?: string;
  roomId?: string;
  tourId?: string;
  experienceId?: string;
  agencyId?: string;
  /** Tur / deneyim / otel adı */
  productTitle?: string;
  /** Tur firması veya deneyim sağlayıcısı */
  operatorName?: string;
  fromLocation?: string;
  toLocation?: string;
  /** Örn. "İstanbul → Kapadokya" */
  routeLabel?: string;
}

// Değerlendirme tipleri
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  hotelId?: string;
  experienceId?: string;
}

export interface TourDateAgeRange {
  id: string;
  minAge: number;
  maxAge: number | null;
  pricingType: 'free' | 'half' | 'percentage' | 'fixed';
  value: number;
  tourDateId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TourDate {
  id: string;
  startDate: Date;
  endDate: Date;
  price: number;
  availableSeats: number;
  soldSeats?: number;
  waitingList?: number;
  minParticipants?: number;
  maxParticipants?: number;
  earlyBirdDiscount?: number;
  lastMinuteDiscount?: number;
  earlyBirdDeadline?: Date;
  lastMinuteStart?: Date;
  status: string;
  notes?: string;
  isActive: boolean;
  tourId: string;
  createdAt: Date;
  updatedAt: Date;
  ageRanges: TourDateAgeRange[];
} 