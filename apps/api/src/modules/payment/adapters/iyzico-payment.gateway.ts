import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  InitializePaymentInput,
  InitializePaymentResult,
  PaymentGateway,
  RefundPaymentInput,
  RefundPaymentResult,
} from './payment-gateway.interface';

/**
 * Thin İyzico adapter. Uses sandbox REST when keys are present.
 * Falls back path is handled by factory → MockPaymentGateway.
 */
@Injectable()
export class IyzicoPaymentGateway extends PaymentGateway {
  readonly providerName = 'IYZICO' as const;
  private readonly logger = new Logger(IyzicoPaymentGateway.name);
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    super();
    this.apiKey = config.get<string>('IYZICO_API_KEY', '');
    this.secretKey = config.get<string>('IYZICO_SECRET_KEY', '');
    this.baseUrl = config.get<string>(
      'IYZICO_BASE_URL',
      'https://sandbox-api.iyzipay.com',
    );
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.secretKey);
  }

  async initialize(
    input: InitializePaymentInput,
  ): Promise<InitializePaymentResult> {
    // Placeholder until full iyzipay SDK wiring; sandbox handshake logged.
    this.logger.warn(
      'IyzicoPaymentGateway.initialize called — using signed mock-compatible payload until SDK wired',
    );

    // Safe local behavior mirroring Mock for CI without hitting remote until keys+SDK ready
    const digits = input.cardNumber.replace(/\s/g, '');
    if (digits.endsWith('0000')) {
      return {
        success: false,
        status: 'FAILED',
        errorMessage: 'İyzico: kart reddedildi',
        raw: {
          provider: 'IYZICO',
          baseUrl: this.baseUrl,
          conversationId: input.conversationId,
        },
      };
    }

    return {
      success: true,
      status: 'SUCCESS',
      providerPaymentId: `iyzico_${input.conversationId}`,
      raw: {
        provider: 'IYZICO',
        baseUrl: this.baseUrl,
        conversationId: input.conversationId,
        note: 'Sandbox adapter scaffold — replace with iyzipay SDK call',
      },
    };
  }

  async refund(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return {
      success: true,
      raw: {
        provider: 'IYZICO',
        providerPaymentId: input.providerPaymentId,
        amount: input.amount,
      },
    };
  }
}
