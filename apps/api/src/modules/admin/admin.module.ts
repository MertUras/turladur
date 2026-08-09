import { Module } from '@nestjs/common';

import { QueueModule } from '../../core/queue/queue.module';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';

@Module({
  imports: [QueueModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
