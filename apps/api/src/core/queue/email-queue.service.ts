import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { EMAIL_QUEUE, EmailJobData } from './processors/email.processor';

@Injectable()
export class EmailQueueService {
  constructor(@InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue) {}

  async enqueue(
    payload: EmailJobData,
    options?: { delayMs?: number },
  ): Promise<string | undefined> {
    const job = await this.emailQueue.add('send', payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: 50,
      delay: options?.delayMs,
    });

    return job.id;
  }
}
