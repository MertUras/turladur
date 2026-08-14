import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CancelReservationHandler } from './commands/cancel-reservation/cancel-reservation.handler';
import { CreateReservationHandler } from './commands/create-reservation/create-reservation.handler';
import { ReservationController } from './controllers/reservation.controller';
import { SeatAssignmentController } from './controllers/seat-assignment.controller';
import { PaymentEventsListener } from './listeners/payment-events.listener';
import { AgencyReservationListener } from './listeners/agency-reservation.listener';
import { TourCancelledListener } from './listeners/tour-cancelled.listener';
import { GetReservationHandler } from './queries/get-reservation/get-reservation.handler';
import { ListReservationsHandler } from './queries/list-reservations/list-reservations.handler';
import { ReservationService } from './services/reservation.service';
import { SeatAssignmentService } from './services/seat-assignment.service';
import { VoucherService } from './services/voucher.service';
import { HoldReleaseWorker } from './workers/hold-release.worker';

const CommandHandlers = [CreateReservationHandler, CancelReservationHandler];
const QueryHandlers = [GetReservationHandler, ListReservationsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ReservationController, SeatAssignmentController],
  providers: [
    ReservationService,
    SeatAssignmentService,
    VoucherService,
    PaymentEventsListener,
    AgencyReservationListener,
    TourCancelledListener,
    HoldReleaseWorker,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [VoucherService, SeatAssignmentService],
})
export class BookingModule {}
