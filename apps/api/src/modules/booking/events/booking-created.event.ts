export class BookingCreatedEvent {
  constructor(
    public readonly reservationId: string,
    public readonly userId: string,
    public readonly tourDateId: string | null,
    public readonly partnerId: string,
    public readonly totalAmount: string,
  ) {}
}
