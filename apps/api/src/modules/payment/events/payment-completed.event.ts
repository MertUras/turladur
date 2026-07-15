export class PaymentCompletedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly reservationId: string,
    public readonly amount: string,
  ) {}
}
