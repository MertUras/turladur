/**
 * Ödeme sağlayıcı soyutlaması — gelecekte Stripe / iyzico entegrasyonu için.
 * Şu an havale ve kart akışları placeholder olarak çalışır.
 */

export type PaymentMethodType = 'bank_transfer' | 'card';

export interface BankTransferDetails {
  bankName: string;
  accountHolder: string;
  iban: string;
  referenceNote: string;
}

export interface PaymentInitRequest {
  bookingId: string;
  bookingNumber: string;
  amount: number;
  currency: 'TRY';
  method: PaymentMethodType;
  customerEmail: string;
}

export interface PaymentInitResult {
  success: boolean;
  status: 'pending' | 'completed' | 'failed';
  providerReference?: string;
  redirectUrl?: string;
  bankTransferDetails?: BankTransferDetails;
  message?: string;
}

export interface PaymentProvider {
  readonly name: string;
  initPayment(request: PaymentInitRequest): Promise<PaymentInitResult>;
  confirmPayment?(reference: string): Promise<{ success: boolean }>;
}

/** Demo / placeholder banka bilgileri — gerçek entegrasyon öncesi */
export const PLACEHOLDER_BANK_DETAILS: BankTransferDetails = {
  bankName: 'TourTech Bankası (Demo)',
  accountHolder: 'TourTech Turizm A.Ş.',
  iban: 'TR00 0001 2345 6789 0123 4567 89',
  referenceNote: 'Rezervasyon numaranızı havale açıklama alanına yazınız.',
};

export class BankTransferProvider implements PaymentProvider {
  readonly name = 'bank_transfer';

  async initPayment(request: PaymentInitRequest): Promise<PaymentInitResult> {
    return {
      success: true,
      status: 'pending',
      providerReference: `HVL-${request.bookingNumber}`,
      bankTransferDetails: {
        ...PLACEHOLDER_BANK_DETAILS,
        referenceNote: `${PLACEHOLDER_BANK_DETAILS.referenceNote} (${request.bookingNumber})`,
      },
      message: 'Havale/EFT talimatları oluşturuldu. Ödeme onaylandığında rezervasyonunuz kesinleşecektir.',
    };
  }
}

/** Gelecekte Stripe / iyzico ile değiştirilecek placeholder kart sağlayıcısı */
export class CardPaymentProvider implements PaymentProvider {
  readonly name = 'card';

  async initPayment(request: PaymentInitRequest): Promise<PaymentInitResult> {
    return {
      success: true,
      status: 'pending',
      providerReference: `CARD-STUB-${Date.now()}`,
      message:
        'Kart ödeme entegrasyonu yakında aktif olacaktır. Rezervasyonunuz ödeme bekliyor durumunda oluşturuldu.',
    };
  }
}

export function getPaymentProvider(method: PaymentMethodType): PaymentProvider {
  switch (method) {
    case 'bank_transfer':
      return new BankTransferProvider();
    case 'card':
      return new CardPaymentProvider();
    default:
      throw new Error(`Desteklenmeyen ödeme yöntemi: ${method}`);
  }
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  bank_transfer: 'Havale / EFT',
  card: 'Banka & Kredi Kartı',
};
