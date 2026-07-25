import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CreateTourDateHandler } from './commands/create-tour-date/create-tour-date.handler';
import { CreateTourHandler } from './commands/create-tour/create-tour.handler';
import { DeleteTourHandler } from './commands/delete-tour/delete-tour.handler';
import { UpdateTourHandler } from './commands/update-tour/update-tour.handler';
import { AgeRangeController } from './controllers/age-range.controller';
import { ExperienceController } from './controllers/experience.controller';
import { HotelController } from './controllers/hotel.controller';
import { RouteController } from './controllers/route.controller';
import { TourExtrasController } from './controllers/tour-extras.controller';
import { TourController } from './controllers/tour.controller';
import { ReviewRatingListener } from './listeners/review-rating.listener';
import { GetTourHandler } from './queries/get-tour/get-tour.handler';
import { ListTourDatesHandler } from './queries/list-tour-dates/list-tour-dates.handler';
import { SearchToursHandler } from './queries/search-tours/search-tours.handler';
import { AgeRangeService } from './services/age-range.service';
import { ExperienceService } from './services/experience.service';
import { HotelService } from './services/hotel.service';
import { RouteService } from './services/route.service';
import { TourExtrasService } from './services/tour-extras.service';
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
  controllers: [
    TourController,
    TourExtrasController,
    HotelController,
    ExperienceController,
    RouteController,
    AgeRangeController,
  ],
  providers: [
    TourService,
    TourExtrasService,
    HotelService,
    ExperienceService,
    RouteService,
    AgeRangeService,
    ReviewRatingListener,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [ExperienceService, HotelService, TourService],
})
export class CatalogModule {}
