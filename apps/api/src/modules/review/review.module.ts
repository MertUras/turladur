import { Module } from '@nestjs/common';

import { ReviewController } from './controllers/review.controller';
import { OutboxService } from './services/outbox.service';
import { ReviewService } from './services/review.service';
import { TourMetricsService } from './services/tour-metrics.service';
import { OutboxWorker } from './workers/outbox.worker';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, TourMetricsService, OutboxService, OutboxWorker],
  exports: [ReviewService, TourMetricsService, OutboxService],
})
export class ReviewModule {}
