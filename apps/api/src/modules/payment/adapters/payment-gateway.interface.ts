export type InitializePaymentInput = {
  conversationId: string;
  amount: string;
  currency: string;
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  buyer: {
    id: string;
    email: string;
    name: string;
    surname: string;
  };
};

export type InitializePaymentResult = {
  success: boolean;
  providerPaymentId?: string;
  status: 'SUCCESS' | 'FAILED' | 'AWAITING_3DS';
  errorMessage?: string;
  raw?: Record<string, unknown>;
};

export type RefundPaymentInput = {
  providerPaymentId: string;
  amount: string;
  conversationId: string;
};

export type RefundPaymentResult = {
  success: boolean;
  errorMessage?: string;
  raw?: Record<string, unknown>;
};

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

/** Abstract class so Nest emitDecoratorMetadata works with @Inject */
export abstract class PaymentGateway {
  abstract readonly providerName: 'IYZICO' | 'MOCK';
  abstract initialize(
    input: InitializePaymentInput,
  ): Promise<InitializePaymentResult>;
  abstract refund(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}
