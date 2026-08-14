import { Global, Module } from '@nestjs/common';

import { AgencyLinkService } from './agency-link.service';

@Global()
@Module({
  providers: [AgencyLinkService],
  exports: [AgencyLinkService],
})
export class AgencyLinkModule {}
