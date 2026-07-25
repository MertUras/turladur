import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CancelReservationHandler } from './commands/cancel-reservation/cancel-reservation.handler';
import { CreateReservationHandler } from './commands/create-reservation/create-reservation.handler';
import { ReservationController } from './controllers/reservation.controller';
import { PaymentEventsListener } from './listeners/payment-events.listener';
import { GetReservationHandler } from './queries/get-reservation/get-reservation.handler';
import { ListReservationsHandler } from './queries/list-reservations/list-reservations.handler';
import { ReservationService } from './services/reservation.service';

const CommandHandlers = [CreateReservationHandler, CancelReservationHandler];
const QueryHandlers = [GetReservationHandler, ListReservationsHandler];

@Module({
  imports: [CqrsModule],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    PaymentEventsListener,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [ReservationService],
})
export class BookingModule {}
