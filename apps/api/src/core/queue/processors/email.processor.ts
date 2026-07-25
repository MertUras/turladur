import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { MailService } from '../../mail/mail.service';

export const EMAIL_QUEUE = 'email';

export type EmailJobData = {
  to: string;
  template: string;
  data: Record<string, unknown>;
};

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<EmailJobData>): Promise<void> {
    this.logger.log(`Processing email job ${job.id} (${job.data.template})`);
    await this.mailService.sendTemplate(
      job.data.to,
      job.data.template,
      job.data.data,
    );
  }
}
