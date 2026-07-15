import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TourService } from '../../services/tour.service';
import { CreateTourDateCommand } from './create-tour-date.command';

@CommandHandler(CreateTourDateCommand)
export class CreateTourDateHandler implements ICommandHandler<CreateTourDateCommand> {
  constructor(private readonly tourService: TourService) {}

  execute(command: CreateTourDateCommand) {
    return this.tourService.createTourDate(
      command.tourId,
      command.dto,
      command.partnerId,
      command.role,
    );
  }
}
