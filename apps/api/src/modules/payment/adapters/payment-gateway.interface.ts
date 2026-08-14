export type InitializePaymentInput = {
  conversationId: string;
  amount: string;
  currency: string;
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  callbackUrl: string;
  buyer: {
    id: string;
    email: string;
    name: string;
    surname: string;
    phone?: string;
    identityNumber?: string;
    registrationAddress?: string;
    city?: string;
    country?: string;
    ip?: string;
  };
};

export type InitializePaymentResult = {
  success: boolean;
  providerPaymentId?: string;
  status: 'SUCCESS' | 'FAILED' | 'AWAITING_3DS';
  /** Bank / İyzico 3DS HTML (iframe or document.write). */
  threeDSHtmlContent?: string;
  errorMessage?: string;
  raw?: Record<string, unknown>;
};

export type CompleteThreeDsInput = {
  conversationId: string;
  paymentId: string;
  conversationData?: string;
};

export type CompleteThreeDsResult = {
  success: boolean;
  status: 'SUCCESS' | 'FAILED';
  providerPaymentId?: string;
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
  abstract completeThreeDs(
    input: CompleteThreeDsInput,
  ): Promise<CompleteThreeDsResult>;
  abstract refund(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}
