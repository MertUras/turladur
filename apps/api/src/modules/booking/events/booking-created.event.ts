export class BookingCreatedEvent {
  constructor(
    public readonly reservationId: string,
    public readonly userId: string,
    public readonly tourDateId: string | null,
    public readonly agencyId: string,
    public readonly totalAmount: string,
  ) {}
}
