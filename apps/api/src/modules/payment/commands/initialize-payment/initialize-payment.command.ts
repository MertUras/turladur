import { CheckoutPaymentDto } from '../../dto/checkout-payment.dto';

export class InitializePaymentCommand {
  constructor(
    public readonly dto: CheckoutPaymentDto,
    public readonly userId: string,
  ) {}
}
