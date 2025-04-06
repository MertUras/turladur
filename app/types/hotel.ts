export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  features: string[];
  isBestSeller?: boolean;
  stars: number;
  checkInDate: string;
  checkOutDate: string;
  type: string;
  roomType: string;
  breakfast: boolean;
  cancellationPolicy: string;
}

export interface FeatureIconInfo {
  feature: string;
  iconType: string;
} 