import { CreateTourDateDto } from '../../dto/create-tour-date.dto';

export class CreateTourDateCommand {
  constructor(
    public readonly tourId: string,
    public readonly dto: CreateTourDateDto,
    public readonly partnerId: string | undefined,
    public readonly role: string,
  ) {}
}
