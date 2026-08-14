export class BookingCompletedEvent {
  constructor(
    public readonly reservationId: string,
    public readonly userId: string,
    public readonly tourId: string | null,
    public readonly agencyId: string,
    public readonly contactEmail: string,
  ) {}
}
