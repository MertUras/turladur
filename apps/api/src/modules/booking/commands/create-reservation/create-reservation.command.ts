import { CreateReservationDto } from '../../dto/create-reservation.dto';

export class CreateReservationCommand {
  constructor(
    public readonly dto: CreateReservationDto,
    public readonly userId: string,
  ) {}
}
