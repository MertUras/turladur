import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { TourCancelledEvent } from '../../catalog/events/tour-cancelled.event';
import { TourDatesCancelledEvent } from '../../catalog/events/tour-dates-cancelled.event';
import { ReservationService } from '../services/reservation.service';

/**
 * Booking listens to catalog tour / date cancellation (no CatalogService import).
 */
@Injectable()
export class TourCancelledListener {
  private readonly logger = new Logger(TourCancelledListener.name);

  constructor(private readonly reservationService: ReservationService) {}

  @OnEvent('tour.cancelled')
  async onTourCancelled(event: TourCancelledEvent): Promise<void> {
    this.logger.log(
      `tour.cancelled → cancel active reservations for tour ${event.tourId}`,
    );
    await this.reservationService.cancelAllForTour(
      event.tourId,
      event.reasonCode,
      event.reasonLabel,
    );
  }

  @OnEvent('tour.dates.cancelled')
  async onTourDatesCancelled(event: TourDatesCancelledEvent): Promise<void> {
    const dateIds = event.dates.map((d) => d.id);
    this.logger.log(
      `tour.dates.cancelled → cancel reservations for ${dateIds.length} date(s) on tour ${event.tourId}`,
    );
    const dateLabelById = Object.fromEntries(
      event.dates.map((d) => [d.id, d.label]),
    );
    await this.reservationService.cancelAllForTourDates(
      dateIds,
      event.reasonCode,
      event.reasonLabel,
      dateLabelById,
    );
  }
}
