import { Module } from '@nestjs/common';

import { QueueModule } from '../../core/queue/queue.module';
import { RealtimeModule } from '../../core/realtime/realtime.module';
import { NotificationController } from './controllers/notification.controller';
import { NotificationEventsListener } from './listeners/notification-events.listener';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [QueueModule, RealtimeModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationEventsListener],
})
export class NotificationModule {}
