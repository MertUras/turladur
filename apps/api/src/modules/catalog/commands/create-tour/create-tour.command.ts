import { CreateTourDto } from '../../dto/create-tour.dto';

export class CreateTourCommand {
  constructor(
    public readonly dto: CreateTourDto,
    public readonly agencyId: string | undefined,
  ) {}
}
