import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@turta/shared-constants';
import type { Response } from 'express';

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
import { ThreeDsCallbackDto } from '../dto/three-ds-callback.dto';
import { PaymentService } from '../services/payment.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('checkout')
  @ApiBearerAuth()
  @Roles(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Initialize payment for a reservation (may return 3DS HTML)',
  })
  checkout(@Body() dto: CheckoutPaymentDto, @CurrentUser() user: UserPayload) {
    return this.commandBus.execute(
      new InitializePaymentCommand(dto, user.userId),
    );
  }

  @Public()
  @SkipThrottle()
  @Post('3ds/callback')
  @HttpCode(302)
  @ApiOperation({
    summary:
      'İyzico / mock 3DS bank callback — redirects browser to checkout success/fail',
  })
  async threeDsCallback(@Body() dto: ThreeDsCallbackDto, @Res() res: Response) {
    const { redirectUrl } =
      await this.paymentService.completeThreeDsCallback(dto);
    return res.redirect(redirectUrl);
  }

  @Public()
  @SkipThrottle()
  @Post('webhook/iyzico')
  @ApiOperation({ summary: 'İyzico server-to-server payment webhook' })
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
