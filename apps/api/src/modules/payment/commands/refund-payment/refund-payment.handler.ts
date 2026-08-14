import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaymentService } from '../../services/payment.service';
import { RefundPaymentCommand } from './refund-payment.command';

@CommandHandler(RefundPaymentCommand)
export class RefundPaymentHandler implements ICommandHandler<RefundPaymentCommand> {
  constructor(private readonly paymentService: PaymentService) {}

  execute(command: RefundPaymentCommand) {
    return this.paymentService.refund(command.paymentId, command.amount);
  }
}
