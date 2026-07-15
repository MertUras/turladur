import { Injectable } from '@nestjs/common';

import {
  InitializePaymentInput,
  InitializePaymentResult,
  PaymentGateway,
  RefundPaymentInput,
  RefundPaymentResult,
} from './payment-gateway.interface';

/**
 * Dev/sandbox adapter when İyzico keys are missing.
 * Fails cards ending with 0000; otherwise succeeds (simulates paid).
 */
@Injectable()
export class MockPaymentGateway extends PaymentGateway {
  readonly providerName = 'MOCK' as const;

  async initialize(
    input: InitializePaymentInput,
  ): Promise<InitializePaymentResult> {
    const digits = input.cardNumber.replace(/\s/g, '');
    if (digits.endsWith('0000')) {
      return {
        success: false,
        status: 'FAILED',
        errorMessage: 'Kart reddedildi (mock)',
        raw: { mock: true, conversationId: input.conversationId },
      };
    }

    return {
      success: true,
      status: 'SUCCESS',
      providerPaymentId: `mock_${input.conversationId}`,
      raw: { mock: true, conversationId: input.conversationId },
    };
  }

  async refund(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return {
      success: true,
      raw: { mock: true, refunded: input.amount },
    };
  }
}
