import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { Public } from '../auth/decorators/public.decorator';
import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../database/prisma.service';

@ApiTags('health')
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'API health check (DB + Redis)' })
  async check() {
    const [database, redis] = await Promise.all([
      this.prisma.isHealthy(),
      this.cache.isHealthy(),
    ]);

    const healthy = database && redis;

    return {
      success: healthy,
      data: {
        status: healthy ? 'ok' : 'degraded',
        service: 'api',
        database: database ? 'up' : 'down',
        redis: redis ? 'up' : 'down',
        timestamp: new Date().toISOString(),
      },
      error: healthy
        ? null
        : {
            code: 'DEPENDENCY_UNAVAILABLE',
            message: 'One or more dependencies are unreachable',
          },
    };
  }

  /**
   * Band 0 Sentry smoke — only when ENABLE_SENTRY_SMOKE=true.
   * Remove or keep gated; never leave open in prod without the flag.
   */
  @Public()
  @Get('debug-sentry')
  @ApiOperation({ summary: 'Sentry smoke (ENABLE_SENTRY_SMOKE=true only)' })
  debugSentry(): never {
    if (process.env.ENABLE_SENTRY_SMOKE !== 'true') {
      throw new NotFoundException();
    }
    throw new Error('Sentry smoke test');
  }
}
