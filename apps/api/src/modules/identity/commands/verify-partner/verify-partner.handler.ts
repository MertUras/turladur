import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IdentityService } from '../../services/identity.service';
import { VerifyPartnerCommand } from './verify-partner.command';

@CommandHandler(VerifyPartnerCommand)
export class VerifyPartnerHandler implements ICommandHandler<VerifyPartnerCommand> {
  constructor(private readonly identityService: IdentityService) {}

  execute(command: VerifyPartnerCommand) {
    return this.identityService.verifyPartner(command.token);
  }
}
