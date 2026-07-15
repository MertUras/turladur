export class CancelReservationCommand {
  constructor(
    public readonly reservationId: string,
    public readonly userId: string,
    public readonly role: string,
  ) {}
}
