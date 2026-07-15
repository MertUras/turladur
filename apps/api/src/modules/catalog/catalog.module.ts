import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CreateTourDateHandler } from './commands/create-tour-date/create-tour-date.handler';
import { CreateTourHandler } from './commands/create-tour/create-tour.handler';
import { DeleteTourHandler } from './commands/delete-tour/delete-tour.handler';
import { UpdateTourHandler } from './commands/update-tour/update-tour.handler';
import { TourController } from './controllers/tour.controller';
import { GetTourHandler } from './queries/get-tour/get-tour.handler';
import { ListTourDatesHandler } from './queries/list-tour-dates/list-tour-dates.handler';
import { SearchToursHandler } from './queries/search-tours/search-tours.handler';
import { TourService } from './services/tour.service';

const CommandHandlers = [
  CreateTourHandler,
  UpdateTourHandler,
  DeleteTourHandler,
  CreateTourDateHandler,
];

const QueryHandlers = [
  SearchToursHandler,
  GetTourHandler,
  ListTourDatesHandler,
];

@Module({
  imports: [CqrsModule],
  controllers: [TourController],
  providers: [TourService, ...CommandHandlers, ...QueryHandlers],
})
export class CatalogModule {}
