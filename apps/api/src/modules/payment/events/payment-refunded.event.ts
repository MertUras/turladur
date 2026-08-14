export class PaymentRefundedEvent {
  constructor(
    public readonly paymentId: string,
    public readonly reservationId: string,
    public readonly amount: string,
    public readonly currency: string,
  ) {}
}
