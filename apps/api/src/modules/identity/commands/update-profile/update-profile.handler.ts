import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IdentityService } from '../../services/identity.service';
import { UpdateProfileCommand } from './update-profile.command';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(private readonly identityService: IdentityService) {}

  execute(command: UpdateProfileCommand) {
    return this.identityService.updateProfile(command.userId, command.dto);
  }
}
