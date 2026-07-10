export type TourDateStatusValue = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type TourDateAction = 'complete' | 'cancel';

export interface TourDateItem {
  id: string;
  tourId: string;
  startDate: string;
  endDate: string;
  price: number;
  availableSeats: number;
  status: TourDateStatusValue;
  isActive: boolean;
  updatedAt: string;
}

export interface TourDateActionResult {
  tourDate: TourDateItem;
  updatedBookingsCount: number;
}

export interface PartnerTourDatesContext {
  tourOperatorId: string;
}

export interface PartnerTourDatesProvider {
  completeTourDate(
    context: PartnerTourDatesContext,
    tourId: string,
    dateId: string
  ): Promise<TourDateActionResult | null>;

  cancelTourDate(
    context: PartnerTourDatesContext,
    tourId: string,
    dateId: string
  ): Promise<TourDateActionResult | null>;
}
