export type MembershipTier = 'BRONZE' | 'SILVER' | 'GOLD';

/** Shape expected by the legacy tours listing UI (ModernTourCard). */
export type LegacyTourCard = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string;
  departureCity: string | string[] | null;
  destinations: string;
  region: string | null;
  duration: string | null;
  maxParticipants: number;
  discount: number;
  inclusions: string;
  tourDates: Array<{ startDate: string; endDate: string; price?: number }>;
  tourOperator: {
    id: string;
    companyName: string;
    logo: string | null;
    membershipTier: MembershipTier | null;
  };
};
