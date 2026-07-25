import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ReservationService } from '../../services/reservation.service';
import { CancelReservationCommand } from './cancel-reservation.command';

@CommandHandler(CancelReservationCommand)
export class CancelReservationHandler implements ICommandHandler<CancelReservationCommand> {
  constructor(private readonly reservationService: ReservationService) {}

  execute(command: CancelReservationCommand) {
    return this.reservationService.cancel(
      command.reservationId,
      command.userId,
      command.role,
    );
  }
}
