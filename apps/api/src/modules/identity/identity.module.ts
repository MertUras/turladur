import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AuthModule } from '../../core/auth/auth.module';
import { QueueModule } from '../../core/queue/queue.module';
import { ChangePasswordHandler } from './commands/change-password/change-password.handler';
import { LoginUserHandler } from './commands/login-user/login-user.handler';
import { RegisterPartnerHandler } from './commands/register-partner/register-partner.handler';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';
import { UpdateProfileHandler } from './commands/update-profile/update-profile.handler';
import { VerifyPartnerHandler } from './commands/verify-partner/verify-partner.handler';
import { AgencyController } from './controllers/agency.controller';
import { IdentityController } from './controllers/identity.controller';
import { SubUserController } from './controllers/sub-user.controller';
import { GetProfileHandler } from './queries/get-profile/get-profile.handler';
import { AgencyService } from './services/agency.service';
import { IdentityService } from './services/identity.service';
import { OtpService } from './services/otp.service';
import { SubUserService } from './services/sub-user.service';

const CommandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  RegisterPartnerHandler,
  VerifyPartnerHandler,
  UpdateProfileHandler,
  ChangePasswordHandler,
];

const QueryHandlers = [GetProfileHandler];

@Module({
  imports: [CqrsModule, AuthModule, QueueModule],
  controllers: [IdentityController, SubUserController, AgencyController],
  providers: [
    IdentityService,
    OtpService,
    SubUserService,
    AgencyService,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [IdentityService, OtpService, SubUserService, AgencyService],
})
export class IdentityModule {}
