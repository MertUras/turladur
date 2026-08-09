import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { ReservationService } from '../services/reservation.service';

const HOLD_SWEEP_INTERVAL_MS = 60_000;

/**
 * HoldReleaseWorker — PENDING_PAYMENT + holdExpiresAt < now → EXPIRED + capacity iade.
 */
@Injectable()
export class HoldReleaseWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(HoldReleaseWorker.name);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly reservationService: ReservationService) {}

  onModuleInit() {
    this.timer = setInterval(() => {
      void this.tick();
    }, HOLD_SWEEP_INTERVAL_MS);
    this.logger.log('HoldReleaseWorker started (60s interval)');
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick() {
    try {
      const released = await this.reservationService.releaseExpiredHolds();
      if (released > 0) {
        this.logger.log(`Released ${released} expired hold(s)`);
      }
    } catch (error) {
      this.logger.error(
        `Hold sweep failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}
