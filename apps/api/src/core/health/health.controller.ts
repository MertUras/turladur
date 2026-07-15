import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';
import { CacheService } from '../cache/cache.service';
import { PrismaService } from '../database/prisma.service';

@ApiTags('health')
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
}
