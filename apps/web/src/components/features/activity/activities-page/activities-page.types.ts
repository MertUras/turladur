/** Split from activities-page-client.tsx (Faz 7) — types only. */

export interface Experience {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
  location: string;
  duration: string;
  rating: number;
  reviewCount: number;
  popularityRate: number;
  price?: number;
  category?: string;
  durationHours?: number;
  experienceType?: string;
  experienceOperator?: {
    id: string;
    companyName: string;
    logo: string | null;
    membershipTier?: 'BRONZE' | 'SILVER' | 'GOLD' | null;
  } | null;
}

export interface ExperienceApiRow {
  id?: string | number;
  title?: string;
  description?: string;
  coverUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  createdAt?: string;
  location?: string;
  city?: string;
  durationHours?: number;
  duration?: string;
  averageRating?: number;
  rating?: number;
  reviewCount?: number;
  popularityRate?: number;
  price?: number;
  category?: string;
  experienceType?: string;
  experienceOperator?: Experience['experienceOperator'];
  partner?: Experience['experienceOperator'];
}
