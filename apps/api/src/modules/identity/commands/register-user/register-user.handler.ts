import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IdentityService } from '../../services/identity.service';
import { RegisterUserCommand } from './register-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(private readonly identityService: IdentityService) {}

  execute(command: RegisterUserCommand) {
    return this.identityService.register(command.dto);
  }
}
