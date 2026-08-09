export class GetReservationQuery {
  constructor(
    public readonly reservationId: string,
    public readonly userId: string,
    public readonly role: string,
    public readonly agencyId?: string,
  ) {}
}
