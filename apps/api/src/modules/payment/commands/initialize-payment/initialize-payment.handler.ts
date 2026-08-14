import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaymentService } from '../../services/payment.service';
import { InitializePaymentCommand } from './initialize-payment.command';

@CommandHandler(InitializePaymentCommand)
export class InitializePaymentHandler implements ICommandHandler<InitializePaymentCommand> {
  constructor(private readonly paymentService: PaymentService) {}

  execute(command: InitializePaymentCommand) {
    return this.paymentService.checkout(command.dto, command.userId);
  }
}
