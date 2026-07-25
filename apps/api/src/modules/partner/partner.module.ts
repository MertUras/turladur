import { Module } from '@nestjs/common';

import { StorageModule } from '../../core/storage/storage.module';
import { PartnerController } from './controllers/partner.controller';
import { PartnerService } from './services/partner.service';

@Module({
  imports: [StorageModule],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
