import { IyzicoWebhookDto } from '../../dto/iyzico-webhook.dto';

export class HandleWebhookCommand {
  constructor(public readonly dto: IyzicoWebhookDto) {}
}
