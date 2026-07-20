export class BookingCompletedEvent {
  constructor(
    public readonly reservationId: string,
    public readonly userId: string,
    public readonly tourId: string,
    public readonly partnerId: string,
    public readonly contactEmail: string,
  ) {}
}
