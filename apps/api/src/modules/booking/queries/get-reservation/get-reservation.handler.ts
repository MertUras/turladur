import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ReservationService } from '../../services/reservation.service';
import { GetReservationQuery } from './get-reservation.query';

@QueryHandler(GetReservationQuery)
export class GetReservationHandler implements IQueryHandler<GetReservationQuery> {
  constructor(private readonly reservationService: ReservationService) {}

  execute(query: GetReservationQuery) {
    return this.reservationService.getById(
      query.reservationId,
      query.userId,
      query.role,
      query.partnerId,
    );
  }
}
