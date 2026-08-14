export type CancelledTourDateInfo = {
  id: string;
  startDate: string;
  endDate: string;
  label: string;
};

/**
 * Emitted when partner cancels one or more departure dates (not necessarily whole tour).
 */
export class TourDatesCancelledEvent {
  constructor(
    public readonly tourId: string,
    public readonly agencyId: string,
    public readonly tourTitle: string,
    public readonly dates: CancelledTourDateInfo[],
    public readonly reasonCode: string,
    public readonly reasonLabel: string,
    /** True when no active dates remain — tour was archived */
    public readonly tourArchived: boolean,
  ) {}
}
