export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  oldPrice?: number;
  image: string;
  features: string[];
  isBestSeller?: boolean;
  discount: number;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  description: string;
  stars: number;
  type: string;
  breakfast: boolean;
  cancellationPolicy: string;
}

export interface FeatureIconInfo {
  feature: string;
  iconType: string;
} 