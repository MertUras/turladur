import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ReservationService } from '../../services/reservation.service';
import { ListReservationsQuery } from './list-reservations.query';

@QueryHandler(ListReservationsQuery)
export class ListReservationsHandler implements IQueryHandler<ListReservationsQuery> {
  constructor(private readonly reservationService: ReservationService) {}

  execute(query: ListReservationsQuery) {
    return this.reservationService.listForUser(query.userId);
  }
}
