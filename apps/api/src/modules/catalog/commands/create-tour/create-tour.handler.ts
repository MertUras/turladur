import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TourService } from '../../services/tour.service';
import { CreateTourCommand } from './create-tour.command';

@CommandHandler(CreateTourCommand)
export class CreateTourHandler implements ICommandHandler<CreateTourCommand> {
  constructor(private readonly tourService: TourService) {}

  execute(command: CreateTourCommand) {
    return this.tourService.create(command.dto, command.agencyId);
  }
}
