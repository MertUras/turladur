import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IdentityService } from '../../services/identity.service';
import { ChangePasswordCommand } from './change-password.command';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(private readonly identityService: IdentityService) {}

  execute(command: ChangePasswordCommand) {
    return this.identityService.changePassword(command.userId, command.dto);
  }
}
