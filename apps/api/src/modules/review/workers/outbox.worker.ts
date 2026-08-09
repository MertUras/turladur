import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { OutboxService } from '../services/outbox.service';

const OUTBOX_SWEEP_INTERVAL_MS = 5_000;

@Injectable()
export class OutboxWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxWorker.name);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly outboxService: OutboxService) {}

  onModuleInit() {
    this.timer = setInterval(() => {
      void this.tick();
    }, OUTBOX_SWEEP_INTERVAL_MS);
    this.logger.log('OutboxWorker started (5s interval)');
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick() {
    try {
      const processed = await this.outboxService.processPendingBatch();
      if (processed > 0) {
        this.logger.log(`Processed ${processed} outbox event(s)`);
      }
    } catch (error) {
      this.logger.error(
        `OutboxWorker tick failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
