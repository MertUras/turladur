import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TourService } from '../../services/tour.service';
import { GetTourQuery } from './get-tour.query';

@QueryHandler(GetTourQuery)
export class GetTourHandler implements IQueryHandler<GetTourQuery> {
  constructor(private readonly tourService: TourService) {}

  execute(query: GetTourQuery) {
    return this.tourService.getById(query.tourId);
  }
}
