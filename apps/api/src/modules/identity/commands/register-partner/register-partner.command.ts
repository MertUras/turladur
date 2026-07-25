import { RegisterPartnerDto } from '../../dto/register-partner.dto';

export class RegisterPartnerCommand {
  constructor(public readonly dto: RegisterPartnerDto) {}
}
