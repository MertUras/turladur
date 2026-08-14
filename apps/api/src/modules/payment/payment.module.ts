import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { IyzicoPaymentGateway } from './adapters/iyzico-payment.gateway';
import { MockPaymentGateway } from './adapters/mock-payment.gateway';
import { PAYMENT_GATEWAY } from './adapters/payment-gateway.interface';
import { HandleWebhookHandler } from './commands/handle-webhook/handle-webhook.handler';
import { InitializePaymentHandler } from './commands/initialize-payment/initialize-payment.handler';
import { RefundPaymentHandler } from './commands/refund-payment/refund-payment.handler';
import { AgencyFinanceController } from './controllers/agency-finance.controller';
import { PaymentController } from './controllers/payment.controller';
import {
  AgencyBankInfoService,
  AgencyCommissionService,
} from './services/agency-commission.service';
import { AgencyEarningService } from './services/agency-earning.service';
import { InvoiceService } from './services/invoice.service';
import { PaymentService } from './services/payment.service';
import { PayoutWorker } from './workers/payout.worker';

const CommandHandlers = [
  InitializePaymentHandler,
  HandleWebhookHandler,
  RefundPaymentHandler,
];

@Module({
  imports: [CqrsModule, ConfigModule],
  controllers: [PaymentController, AgencyFinanceController],
  providers: [
    PaymentService,
    InvoiceService,
    AgencyEarningService,
    AgencyCommissionService,
    AgencyBankInfoService,
    PayoutWorker,
    MockPaymentGateway,
    IyzicoPaymentGateway,
    {
      provide: PAYMENT_GATEWAY,
      inject: [ConfigService, MockPaymentGateway, IyzicoPaymentGateway],
      useFactory: (
        config: ConfigService,
        mock: MockPaymentGateway,
        iyzico: IyzicoPaymentGateway,
      ) => {
        const hasKeys =
          Boolean(config.get<string>('IYZICO_API_KEY')) &&
          Boolean(config.get<string>('IYZICO_SECRET_KEY'));
        return hasKeys ? iyzico : mock;
      },
    },
    ...CommandHandlers,
  ],
  exports: [
    PaymentService,
    InvoiceService,
    AgencyEarningService,
    AgencyBankInfoService,
  ],
})
export class PaymentModule {}
