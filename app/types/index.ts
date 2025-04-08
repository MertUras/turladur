// Kullanıcı tipleri
export type UserRole = 'USER' | 'HOTEL_ADMIN' | 'AGENCY_ADMIN' | 'TOUR_OPERATOR' | 'EXPERIENCE_PROVIDER' | 'ADMIN';

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
  description?: string;
  duration: number;
  price: number;
  discount?: number;
  startDate?: Date;
  endDate?: Date;
  maxParticipants?: number;
  currentParticipants?: number;
  departureCity?: string;
  region?: string;
  transportation?: string;
  period?: string;
  destinations: string; // JSON formatında
  inclusions: string; // JSON formatında
  exclusions: string; // JSON formatında
  itinerary?: string; // JSON formatında
  images: string; // JSON formatında
  features: string; // JSON formatında
  rating?: number;
  reviews?: number;
  featured: boolean;
  isJointTour?: boolean;
  createdAt: Date;
  updatedAt: Date;
  tourOperatorId: string;
  experienceType?: string;
}

// Deneyim tipleri
export interface Experience {
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
}

// Rezervasyon tipleri
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
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