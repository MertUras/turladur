import { Module } from '@nestjs/common';

import { ContentModule } from '../content/content.module';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';

@Module({
  imports: [ContentModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
