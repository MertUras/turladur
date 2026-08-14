import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReservationService } from '../../services/reservation.service';
import { CreateReservationCommand } from './create-reservation.command';

@CommandHandler(CreateReservationCommand)
export class CreateReservationHandler implements ICommandHandler<CreateReservationCommand> {
  constructor(private readonly reservationService: ReservationService) {}

  execute(command: CreateReservationCommand) {
    return this.reservationService.create(command.dto, command.userId);
  }
}
