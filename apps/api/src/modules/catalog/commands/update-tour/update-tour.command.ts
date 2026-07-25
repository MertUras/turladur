import { UpdateTourDto } from '../../dto/update-tour.dto';

export class UpdateTourCommand {
  constructor(
    public readonly tourId: string,
    public readonly dto: UpdateTourDto,
    public readonly partnerId: string | undefined,
    public readonly role: string,
  ) {}
}
