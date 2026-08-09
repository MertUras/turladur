import { apiRequest } from './api-client';

export type MarketplaceAgencyProfile = {
  id: string;
  companyName: string;
  logo: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  membershipTier: 'BRONZE' | 'SILVER' | 'GOLD' | string;
  averageRating: string;
  reviewCount: number;
  status: string;
  publishedTourCount: number;
  description: string | null;
  createdAt: string;
};

export async function getMarketplaceAgencyProfile(agencyId: string) {
  return apiRequest<MarketplaceAgencyProfile>(
    `/identity/agencies/${encodeURIComponent(agencyId)}`,
    { next: { revalidate: 60 } },
  );
}
