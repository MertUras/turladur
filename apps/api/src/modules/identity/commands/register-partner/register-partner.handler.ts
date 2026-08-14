import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IdentityService } from '../../services/identity.service';
import { RegisterPartnerCommand } from './register-partner.command';

@CommandHandler(RegisterPartnerCommand)
export class RegisterPartnerHandler implements ICommandHandler<RegisterPartnerCommand> {
  constructor(private readonly identityService: IdentityService) {}

  execute(command: RegisterPartnerCommand) {
    return this.identityService.registerPartner(command.dto);
  }
}
