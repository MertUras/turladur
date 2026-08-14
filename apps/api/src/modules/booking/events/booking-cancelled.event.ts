export class BookingCancelledEvent {
  constructor(
    public readonly reservationId: string,
    public readonly userId: string,
    /** RESERVATION = single booking; TOUR = whole tour; TOUR_DATE = specific departure */
    public readonly scope:
      'RESERVATION' | 'TOUR' | 'TOUR_DATE' | 'PAYMENT' = 'RESERVATION',
    public readonly reasonCode?: string,
    public readonly reasonLabel?: string,
    /** Human-readable departure window, e.g. "25 Tem 2026 – 1 Ağu 2026" */
    public readonly cancelledDateLabel?: string,
  ) {}
}
