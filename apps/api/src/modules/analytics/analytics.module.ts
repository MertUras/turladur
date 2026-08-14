import { Module } from '@nestjs/common';

import { AnalyticsController } from './controllers/analytics.controller';
import { SearchQueryListener } from './listeners/search-query.listener';
import { AnalyticsService } from './services/analytics.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, SearchQueryListener],
})
export class AnalyticsModule {}
