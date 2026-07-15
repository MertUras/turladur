import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TourService } from '../../services/tour.service';
import { UpdateTourCommand } from './update-tour.command';

@CommandHandler(UpdateTourCommand)
export class UpdateTourHandler implements ICommandHandler<UpdateTourCommand> {
  constructor(private readonly tourService: TourService) {}

  execute(command: UpdateTourCommand) {
    return this.tourService.update(
      command.tourId,
      command.dto,
      command.partnerId,
      command.role,
    );
  }
}
