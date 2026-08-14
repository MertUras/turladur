import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { PaymentCompletedEvent } from '../../payment/events/payment-completed.event';
import { PaymentFailedEvent } from '../../payment/events/payment-failed.event';
import { PaymentRefundedEvent } from '../../payment/events/payment-refunded.event';
import { ReservationService } from '../services/reservation.service';

/**
 * Booking listens to payment domain events (no PaymentService import).
 */
@Injectable()
export class PaymentEventsListener {
  private readonly logger = new Logger(PaymentEventsListener.name);

  constructor(private readonly reservationService: ReservationService) {}

  @OnEvent('payment.completed')
  async onPaymentCompleted(event: PaymentCompletedEvent): Promise<void> {
    this.logger.log(
      `payment.completed → confirm reservation ${event.reservationId}`,
    );
    await this.reservationService.markConfirmed(event.reservationId);
  }

  @OnEvent('payment.failed')
  async onPaymentFailed(event: PaymentFailedEvent): Promise<void> {
    this.logger.log(`payment.failed → mark reservation ${event.reservationId}`);
    await this.reservationService.markPaymentFailed(event.reservationId);
  }

  @OnEvent('payment.refunded')
  async onPaymentRefunded(event: PaymentRefundedEvent): Promise<void> {
    this.logger.log(
      `payment.refunded → mark reservation ${event.reservationId}`,
    );
    await this.reservationService.markPaymentRefunded(event.reservationId);
  }
}
