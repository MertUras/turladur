import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { Public } from '../../../core/auth/decorators/public.decorator';
import { ContentService } from '../services/content.service';

@ApiTags('Content - Route pages')
@Controller('content/route-pages')
export class RoutePageController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Get()
  @ApiOperation({
    summary: 'List all route page overlays (empty when none / table missing)',
  })
  list() {
    return this.contentService.listRoutePages();
  }

  @Public()
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Get(':routeKey')
  @ApiOperation({
    summary: 'Public route page overlay (missing row = exists:false)',
  })
  get(@Param('routeKey') routeKey: string) {
    return this.contentService.getRoutePage(routeKey);
  }
}
