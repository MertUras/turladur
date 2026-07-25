import { Injectable } from '@nestjs/common';

import {
  CompleteThreeDsInput,
  CompleteThreeDsResult,
  InitializePaymentInput,
  InitializePaymentResult,
  PaymentGateway,
  RefundPaymentInput,
  RefundPaymentResult,
} from './payment-gateway.interface';

/**
 * Dev adapter when İyzico keys are missing (company not founded yet).
 *
 * Cards:
 * - …0000 → fail
 * - …0008 → mock 3DS HTML (UI parity without sandbox keys)
 * - other → immediate SUCCESS
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

    // Simulate 3DS so checkout UI can be verified without İyzico keys.
    if (digits.endsWith('0008') || digits.endsWith('0006')) {
      const paymentId = `mock_3ds_${input.conversationId}`;
      const html = buildMockThreeDsHtml({
        callbackUrl: input.callbackUrl,
        conversationId: input.conversationId,
        paymentId,
      });
      return {
        success: true,
        status: 'AWAITING_3DS',
        providerPaymentId: paymentId,
        threeDSHtmlContent: html,
        raw: { mock: true, conversationId: input.conversationId, paymentId },
      };
    }

    return {
      success: true,
      status: 'SUCCESS',
      providerPaymentId: `mock_${input.conversationId}`,
      raw: { mock: true, conversationId: input.conversationId },
    };
  }

  async completeThreeDs(
    input: CompleteThreeDsInput,
  ): Promise<CompleteThreeDsResult> {
    return {
      success: true,
      status: 'SUCCESS',
      providerPaymentId: input.paymentId,
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

function buildMockThreeDsHtml(params: {
  callbackUrl: string;
  conversationId: string;
  paymentId: string;
}): string {
  const { callbackUrl, conversationId, paymentId } = params;
  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"/><title>Mock 3D Secure</title>
<style>
  body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f172a;color:#f8fafc}
  .card{background:#1e293b;padding:2rem;border-radius:1rem;max-width:24rem;text-align:center}
  button{margin-top:1rem;padding:.75rem 1.25rem;border:0;border-radius:.5rem;background:#22c55e;color:#052e16;font-weight:600;cursor:pointer}
</style>
</head>
<body>
  <div class="card">
    <h1>Mock 3D Secure</h1>
    <p>İyzico key yok — yerel simülasyon. Şirket kurulunca gerçek banka 3DS açılır.</p>
    <p>SMS kodu (sandbox): <strong>123456</strong></p>
    <form id="mock3ds" method="POST" action="${escapeHtml(callbackUrl)}">
      <input type="hidden" name="status" value="success"/>
      <input type="hidden" name="paymentId" value="${escapeHtml(paymentId)}"/>
      <input type="hidden" name="conversationId" value="${escapeHtml(conversationId)}"/>
      <input type="hidden" name="conversationData" value="mock"/>
      <button type="submit">Doğrula ve devam et</button>
    </form>
  </div>
  <script>
    setTimeout(function(){ document.getElementById('mock3ds').submit(); }, 1800);
  </script>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
