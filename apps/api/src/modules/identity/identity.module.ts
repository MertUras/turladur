import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../../core/auth/auth.module';
import { QueueModule } from '../../core/queue/queue.module';
import { LoginUserHandler } from './commands/login-user/login-user.handler';
import { RegisterPartnerHandler } from './commands/register-partner/register-partner.handler';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';
import { VerifyPartnerHandler } from './commands/verify-partner/verify-partner.handler';
import { IdentityController } from './controllers/identity.controller';
import { GetProfileHandler } from './queries/get-profile/get-profile.handler';
import { IdentityService } from './services/identity.service';

const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  RegisterPartnerHandler,
  VerifyPartnerHandler,
];

const QueryHandlers = [GetProfileHandler];

@Module({
  imports: [CqrsModule, AuthModule, QueueModule],
  controllers: [IdentityController],
  providers: [IdentityService, ...CommandHandlers, ...QueryHandlers],
  exports: [IdentityService],
})
export class IdentityModule {}
