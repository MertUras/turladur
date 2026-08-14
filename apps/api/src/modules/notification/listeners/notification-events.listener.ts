import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { BookingCancelledEvent } from '../../booking/events/booking-cancelled.event';
import { BookingCompletedEvent } from '../../booking/events/booking-completed.event';
import { PaymentCompletedEvent } from '../../payment/events/payment-completed.event';
import { PaymentRefundedEvent } from '../../payment/events/payment-refunded.event';
import { PartnerVerifiedEvent } from '../../identity/events/partner-verified.event';
import { ReviewCreatedEvent } from '../../review/events/review-created.event';
import { NotificationService } from '../services/notification.service';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

@Injectable()
export class NotificationEventsListener {
  private readonly logger = new Logger(NotificationEventsListener.name);

  constructor(private readonly notifications: NotificationService) {}

  @OnEvent('partner.verified')
  async onPartnerVerified(event: PartnerVerifiedEvent) {
    try {
      await this.notifications.notifyPartnerApproved(event);
    } catch (err) {
      this.logger.warn(`partner.verified notify failed: ${String(err)}`);
    }
  }

  @OnEvent('payment.completed')
  async onPaymentCompleted(event: PaymentCompletedEvent) {
    try {
      await this.notifications.notifyBookingConfirmed(event.reservationId);
    } catch (err) {
      this.logger.warn(`payment.completed notify failed: ${String(err)}`);
    }
  }

  @OnEvent('payment.refunded')
  async onPaymentRefunded(event: PaymentRefundedEvent) {
    try {
      await this.notifications.notifyPaymentRefunded({
        reservationId: event.reservationId,
        amount: event.amount,
        currency: event.currency,
      });
    } catch (err) {
      this.logger.warn(`payment.refunded notify failed: ${String(err)}`);
    }
  }

  @OnEvent('booking.cancelled')
  async onBookingCancelled(event: BookingCancelledEvent) {
    try {
      await this.notifications.notifyBookingCancelled(event);
    } catch (err) {
      this.logger.warn(`booking.cancelled notify failed: ${String(err)}`);
    }
  }

  @OnEvent('review.created')
  async onReviewCreated(event: ReviewCreatedEvent) {
    try {
      await this.notifications.notifyReviewReceived(event);
    } catch (err) {
      this.logger.warn(`review.created notify failed: ${String(err)}`);
    }
  }

  @OnEvent('booking.completed')
  async onBookingCompleted(event: BookingCompletedEvent) {
    try {
      await this.notifications.notifyBookingCompleted(event);
      await this.notifications.enqueueEmail(
        event.contactEmail,
        'review-request',
        {
          tourId: event.tourId,
          reservationId: event.reservationId,
          reviewUrl: `http://localhost:3001/tours/${event.tourId}`,
        },
        THREE_DAYS_MS,
      );
    } catch (err) {
      this.logger.warn(`booking.completed notify failed: ${String(err)}`);
    }
  }
}
