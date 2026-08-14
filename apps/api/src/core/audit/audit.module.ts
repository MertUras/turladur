import { Global, Module } from '@nestjs/common';

import { AuditService } from './audit.service';
import { DomainAuditListener } from './domain-audit.listener';

@Global()
@Module({
  providers: [AuditService, DomainAuditListener],
  exports: [AuditService],
})
export class AuditModule {}
