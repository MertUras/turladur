import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TourService } from '../../services/tour.service';
import { DeleteTourCommand } from './delete-tour.command';

@CommandHandler(DeleteTourCommand)
export class DeleteTourHandler implements ICommandHandler<DeleteTourCommand> {
  constructor(private readonly tourService: TourService) {}

  execute(command: DeleteTourCommand) {
    return this.tourService.softDelete(
      command.tourId,
      command.partnerId,
      command.role,
    );
  }
}
