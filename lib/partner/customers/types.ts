export interface PartnerCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalBookings: number;
  totalSpent: number;
  totalSpentFormatted: string;
  lastBookingDate: string;
  lastBookingAt: string;
  profileImage?: string;
}

export interface PartnerCustomersData {
  customers: PartnerCustomer[];
  totalCount: number;
}

export interface PartnerCustomersProvider {
  list(context: PartnerCustomersContext): Promise<PartnerCustomersData>;
}

export type PartnerCustomersContext =
  | { operatorType: 'tour'; tourOperatorId: string; userId: string }
  | { operatorType: 'experience'; experienceOperatorId: string; userId: string };
