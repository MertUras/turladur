import { Test } from '@nestjs/testing';

import { PaymentCompletedEvent } from '../../payment/events/payment-completed.event';
import { PaymentFailedEvent } from '../../payment/events/payment-failed.event';
import { PaymentRefundedEvent } from '../../payment/events/payment-refunded.event';
import { PaymentEventsListener } from '../listeners/payment-events.listener';
import { ReservationService } from '../services/reservation.service';

describe('PaymentEventsListener', () => {
  let listener: PaymentEventsListener;
  const reservationService = {
    markConfirmed: jest.fn(),
    markPaymentFailed: jest.fn(),
    markPaymentRefunded: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        PaymentEventsListener,
        { provide: ReservationService, useValue: reservationService },
      ],
    }).compile();
    listener = module.get(PaymentEventsListener);
  });

  it('payment.completed → markConfirmed', async () => {
    await listener.onPaymentCompleted(
      new PaymentCompletedEvent('pay1', 'res1', '100'),
    );
    expect(reservationService.markConfirmed).toHaveBeenCalledWith('res1');
  });

  it('payment.failed → markPaymentFailed', async () => {
    await listener.onPaymentFailed(
      new PaymentFailedEvent('pay1', 'res1', 'DECLINED'),
    );
    expect(reservationService.markPaymentFailed).toHaveBeenCalledWith('res1');
  });

  it('payment.refunded → markPaymentRefunded (Faz 2)', async () => {
    await listener.onPaymentRefunded(
      new PaymentRefundedEvent('pay1', 'res1', '100', 'TRY'),
    );
    expect(reservationService.markPaymentRefunded).toHaveBeenCalledWith('res1');
  });
});
