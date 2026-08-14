import { UpdateTourDto } from '../../dto/update-tour.dto';

export class UpdateTourCommand {
  constructor(
    public readonly tourId: string,
    public readonly dto: UpdateTourDto,
    public readonly agencyId: string | undefined,
    public readonly role: string,
  ) {}
}
