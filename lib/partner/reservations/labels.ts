import { PaymentMethodType } from '@/app/lib/payments';

export function formatPaymentLabel(
  paymentMethod: string | null | undefined,
  paymentStatus: string
): string {
  const method = paymentMethod?.toLowerCase();

  if (method === 'bank_transfer' || method === 'havale') {
    if (paymentStatus === 'paid') {
      return 'Havale / EFT — Ödeme Onaylandı';
    }
    if (paymentStatus === 'refunded') {
      return 'Havale / EFT — İade Edildi';
    }
    return 'Havale / EFT — Onay Bekliyor';
  }

  if (method === 'card') {
    if (paymentStatus === 'paid') {
      return 'Banka & Kredi Kartı — Ödendi';
    }
    if (paymentStatus === 'refunded') {
      return 'Banka & Kredi Kartı — İade Edildi';
    }
    if (paymentStatus === 'partial' || paymentStatus === 'partially_paid') {
      return 'Banka & Kredi Kartı — Kısmi Ödeme';
    }
    return 'Banka & Kredi Kartı';
  }

  return translateLegacyPaymentStatus(paymentStatus);
}

export function translateLegacyPaymentStatus(status: string): string {
  switch (status) {
    case 'paid':
      return 'Ödendi';
    case 'partial':
    case 'partially_paid':
      return 'Kısmi Ödeme';
    case 'unpaid':
      return 'Ödenmedi';
    case 'refunded':
      return 'İade Edildi';
    default:
      return status;
  }
}

export function translateReservationStatus(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'Onaylandı';
    case 'pending':
      return 'Beklemede';
    case 'pending_payment':
      return 'Ödeme Bekliyor';
    case 'suspended':
      return 'Askıya Alındı';
    case 'cancelled':
      return 'İptal Edildi';
    case 'completed':
      return 'Tamamlandı';
    default:
      return status;
  }
}

export function getReservationStatusClass(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
    case 'pending_payment':
      return 'bg-yellow-100 text-yellow-800';
    case 'suspended':
      return 'bg-orange-100 text-orange-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getPaymentLabelClass(paymentMethod: string | null | undefined): string {
  const method = paymentMethod?.toLowerCase();
  if (method === 'bank_transfer' || method === 'havale') {
    return 'bg-amber-100 text-amber-900';
  }
  if (method === 'card') {
    return 'bg-indigo-100 text-indigo-800';
  }
  return 'bg-gray-100 text-gray-800';
}

export function isPaymentMethodType(value: string): value is PaymentMethodType {
  return value === 'bank_transfer' || value === 'card';
}
