import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TourService } from '../../services/tour.service';
import { SearchToursQuery } from './search-tours.query';

@QueryHandler(SearchToursQuery)
export class SearchToursHandler implements IQueryHandler<SearchToursQuery> {
  constructor(private readonly tourService: TourService) {}

  execute(query: SearchToursQuery) {
    return this.tourService.search(query.dto);
  }
}
