export class BookingCancelledEvent {
  constructor(
    public readonly reservationId: string,
    public readonly userId: string,
  ) {}
}
