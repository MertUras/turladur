import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IdentityService } from '../../services/identity.service';
import { LoginUserCommand } from './login-user.command';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(private readonly identityService: IdentityService) {}

  execute(command: LoginUserCommand) {
    return this.identityService.login(command.dto);
  }
}
