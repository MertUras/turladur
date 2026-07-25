import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PaymentService } from '../../services/payment.service';
import { HandleWebhookCommand } from './handle-webhook.command';

@CommandHandler(HandleWebhookCommand)
export class HandleWebhookHandler implements ICommandHandler<HandleWebhookCommand> {
  constructor(private readonly paymentService: PaymentService) {}

  execute(command: HandleWebhookCommand) {
    return this.paymentService.handleWebhook(command.dto);
  }
}
