import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@turladur/shared-constants';

import { CurrentUser } from '../../../core/auth/decorators/current-user.decorator';
import { Public } from '../../../core/auth/decorators/public.decorator';
import { Roles } from '../../../core/auth/decorators/roles.decorator';
import { UserPayload } from '../../../core/auth/types/auth.types';
import { HandleWebhookCommand } from '../commands/handle-webhook/handle-webhook.command';
import { InitializePaymentCommand } from '../commands/initialize-payment/initialize-payment.command';
import { RefundPaymentCommand } from '../commands/refund-payment/refund-payment.command';
import { CheckoutPaymentDto } from '../dto/checkout-payment.dto';
import { IyzicoWebhookDto } from '../dto/iyzico-webhook.dto';
import { RefundPaymentDto } from '../dto/refund-payment.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('checkout')
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Initialize payment for a reservation' })
  checkout(@Body() dto: CheckoutPaymentDto, @CurrentUser() user: UserPayload) {
    return this.commandBus.execute(
      new InitializePaymentCommand(dto, user.userId),
    );
  }

  @Public()
  @Post('webhook/iyzico')
  @ApiOperation({ summary: 'İyzico / sandbox payment callback' })
  webhook(@Body() dto: IyzicoWebhookDto) {
    return this.commandBus.execute(new HandleWebhookCommand(dto));
  }

  @Post('refund')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Refund a successful payment' })
  refund(@Body() dto: RefundPaymentDto) {
    return this.commandBus.execute(
      new RefundPaymentCommand(dto.paymentId, dto.amount),
    );
  }
}
