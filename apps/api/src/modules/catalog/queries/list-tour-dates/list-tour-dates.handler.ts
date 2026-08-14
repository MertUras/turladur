import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TourService } from '../../services/tour.service';
import { ListTourDatesQuery } from './list-tour-dates.query';

@QueryHandler(ListTourDatesQuery)
export class ListTourDatesHandler implements IQueryHandler<ListTourDatesQuery> {
  constructor(private readonly tourService: TourService) {}

  execute(query: ListTourDatesQuery) {
    return this.tourService.listTourDates(query.tourId);
  }
}
